const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const otplib = require("otplib");

const userDataPath = ipcRenderer.sendSync('get-user-data-path');

const secretsFile = path.resolve(userDataPath, 'secrets.json');

const iconsFile = path.resolve(__dirname, 'icons.json'); // adjust if needed

if (!fs.existsSync(secretsFile)) {
  fs.writeFileSync(secretsFile, '[]', 'utf-8');
}

contextBridge.exposeInMainWorld('api', {
  closeWindow: () => ipcRenderer.send('close-window'),
  loginGoogle: () => ipcRenderer.send('start-google-login'),
  updategdrive: () => ipcRenderer.send('updategdrive'),
  updatelocal: () => ipcRenderer.send('updatelocal'),
  clearLogin: () => ipcRenderer.send('clear-login'),
  onLoginError: (cb) => ipcRenderer.on('login-error', (_, msg) => cb(msg)),
  syncSecrets: () => ipcRenderer.send('upload-secrets'),
  loadSecrets: () => {
    if (fs.existsSync(secretsFile)) {
      const data = fs.readFileSync(secretsFile, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  },
  saveSecrets: (secrets) => {
    fs.writeFileSync(secretsFile, JSON.stringify(secrets, null, 2), 'utf-8');
    ipcRenderer.send('upload-secrets');
  },
  generateTOTP: (secret) => otplib.authenticator.generate(secret),
  loadIcons: () => {
    if (fs.existsSync(iconsFile)) {
      return JSON.parse(fs.readFileSync(iconsFile, 'utf-8'));
    }
    return {};
  }
});
