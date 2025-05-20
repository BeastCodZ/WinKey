const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");

let mainWindow; 

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

  mainWindow.loadFile("index.html");
}

ipcMain.on("close-window", () => {
  if (mainWindow) mainWindow.close();
});
ipcMain.handle('get-user-data-path', () => {
  return app.getPath('userData');
});
ipcMain.on('get-user-data-path', (event) => {
  event.returnValue = app.getPath('userData');
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
