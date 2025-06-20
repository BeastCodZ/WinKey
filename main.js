const path = require("path");
const fs = require("fs");
const { app, BrowserWindow, ipcMain } = require("electron");
const axios = require("axios");
const { google } = require("googleapis");
const ElectronGoogleOAuth2 = require('@getstation/electron-google-oauth2').default;
const { format } = require('date-fns');

const CLIENT_ID = 'Change this';
const CLIENT_SECRET = 'Change this';

const myOAuth = new ElectronGoogleOAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  [
    'openid',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/drive.file'
  ],
  {
    successRedirectURL: 'http://127.0.0.1:42813/callback'
  }
);

const userDataPath = app.getPath('userData');
const tokensFile = path.join(userDataPath, 'tokens.json');
const secretsFile = path.join(userDataPath, 'secrets.json');

let mainWindow;

// === Helper: Token store ===
function saveTokens(tokens) {
  try {
    fs.writeFileSync(tokensFile, JSON.stringify(tokens, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed saving tokens:', err);
  }
}

function loadTokens() {
  try {
    if (fs.existsSync(tokensFile)) {
      return JSON.parse(fs.readFileSync(tokensFile, 'utf-8'));
    }
    return null;
  } catch (err) {
    console.error('Failed loading tokens:', err);
    return null;
  }
}

// === Helper: Google Drive ===
function getDrive(tokens) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials(tokens);
  return google.drive({ version: 'v3', auth: oauth2Client });
}

async function ensureWinKeyFolder(drive) {
  const res = await drive.files.list({
    q: "name='WinKey' and mimeType='application/vnd.google-apps.folder' and trashed=false",
    fields: 'files(id, name)'
  });
  if (res.data.files.length) return res.data.files[0].id;
  const folder = await drive.files.create({
    requestBody: {
      name: 'WinKey',
      mimeType: 'application/vnd.google-apps.folder'
    },
    fields: 'id'
  });
  return folder.data.id;
}

async function uploadSecrets(drive, folderId) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and name='secrets.json' and trashed=false`,
    fields: 'files(id)'
  });

  if (res.data.files.length) {
    await drive.files.update({
      fileId: res.data.files[0].id,
      media: {
        mimeType: 'application/json',
        body: fs.createReadStream(secretsFile)
      }
    });
  } else {
    await drive.files.create({
      requestBody: {
        name: 'secrets.json',
        parents: [folderId]
      },
      media: {
        mimeType: 'application/json',
        body: fs.createReadStream(secretsFile)
      }
    });
  }
}

async function downloadSecrets(drive, folderId) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and name='secrets.json' and trashed=false`,
    fields: 'files(id)'
  });
  if (!res.data.files.length) return false;

  const dest = fs.createWriteStream(secretsFile);
  const result = await drive.files.get(
    { fileId: res.data.files[0].id, alt: 'media' },
    { responseType: 'stream' }
  );
  await new Promise((resolve, reject) => {
    result.data.on('end', resolve).on('error', reject).pipe(dest);
  });
  return true;
}

function backupLocalSecrets() {
  if (fs.existsSync(secretsFile)) {
    try {
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const backupDir = path.join(userDataPath, `backup_${timestamp}`);
      if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);
      fs.renameSync(secretsFile, path.join(backupDir, 'secrets.json'));
      console.log(`Local secrets.json backed up to ${backupDir}`);
    } catch (err) {
      console.error('Backup failed:', err);
    }
  }
}

// === Electron ===
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 550,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    icon: './favicon.ico',
    transparent: true,
    frame: false,
  });
  mainWindow.loadFile("login.html");
}

ipcMain.on("close-window", () => mainWindow && mainWindow.close());
ipcMain.on('get-user-data-path', event => {
  event.returnValue = app.getPath('userData');
});

ipcMain.on('start-google-login', async () => {
  try {
    const existingTokens = loadTokens();
    if (existingTokens) {
      myOAuth.setTokens(existingTokens);
      console.log('Using existing tokens, secrets downloaded.');
      console.log(existingTokens)
      mainWindow.loadFile('index.html');
      return;
    }

    const tokens = await myOAuth.openAuthWindowAndGetTokens();
    console.log('Google login successful:', tokens);
    saveTokens(tokens);

    const drive = getDrive(tokens);
    const folderId = await ensureWinKeyFolder(drive);
    await downloadSecrets(drive, folderId);

    mainWindow.loadFile('index.html');
  } catch (err) {
    console.error('[Google login failed]', err);
    // safer: check if window still exists & is not destroyed
    if (mainWindow && !mainWindow.isDestroyed()) {
      try {
        mainWindow.webContents.send('login-error', String(err.message || err));
      } catch (sendErr) {
        console.error('Failed to send error to renderer:', sendErr);
      }
    }
  }
});


ipcMain.on('upload-secrets', async () => {
  try {
    const tokens = loadTokens();
    if (!tokens) throw new Error('No tokens found');
    const drive = getDrive(tokens);
    const folderId = await ensureWinKeyFolder(drive);
    await uploadSecrets(drive, folderId);
    console.log('Secrets uploaded to Drive.');
  } catch (err) {
    console.error('Upload failed:', err);
  }
});

ipcMain.on('updatelocal', async () => {
  try {
    const tokens = loadTokens();
    if (!tokens) throw new Error('No tokens found');
    const drive = getDrive(tokens);
    const folderId = await ensureWinKeyFolder(drive);
    backupLocalSecrets();
    const ok = await downloadSecrets(drive, folderId);
    console.log(ok ? 'Local secrets.json updated from Drive.' : 'No secrets.json found in Drive.');
  } catch (err) {
    console.error('Update local failed:', err);
  }
});

ipcMain.on('updategdrive', async () => {
  try {
    const tokens = loadTokens();
    if (!tokens) throw new Error('No tokens found');
    const drive = getDrive(tokens);
    const folderId = await ensureWinKeyFolder(drive);

    const res = await drive.files.list({
      q: `'${folderId}' in parents and name='secrets.json' and trashed=false`,
      fields: 'files(id)'
    });

    if (res.data.files.length) {
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const backupFolder = await drive.files.create({
        requestBody: {
          name: `backup_${timestamp}`,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [folderId]
        },
        fields: 'id'
      });

      await drive.files.copy({
        fileId: res.data.files[0].id,
        requestBody: {
          name: 'secrets.json',
          parents: [backupFolder.data.id]
        }
      });
      console.log(`Remote secrets.json backed up to Drive folder backup_${timestamp}`);
    }

    await uploadSecrets(drive, folderId);
    console.log('Local secrets.json uploaded to Drive (with remote backup).');
  } catch (err) {
    console.error('Update GDrive failed:', err);
  }
});

ipcMain.on('clear-login', () => {
  try {
    if (fs.existsSync(tokensFile)) fs.unlinkSync(tokensFile);
    console.log('Login cleared.');
    mainWindow.loadFile('login.html');
  } catch (err) {
    console.error('Clear login failed:', err);
  }
});

app.whenReady().then(() => {
  const tokens = loadTokens();
  if (tokens) myOAuth.setTokens(tokens);
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
