const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const otplib = require("otplib");

const userDataPath = ipcRenderer.sendSync('get-user-data-path');
const secretsFilePath = path.join(userDataPath, 'secrets.json');

if (!fs.existsSync(secretsFilePath)) {
    fs.writeFileSync(secretsFilePath, '[]', 'utf-8');
}

contextBridge.exposeInMainWorld('api', {
    closeWindow: () => ipcRenderer.send('close-window'),
    loadSecrets: () => {
        if (fs.existsSync(secretsFilePath)) {
            const data = fs.readFileSync(secretsFilePath, "utf-8");
            return JSON.parse(data);
        }
        return [];
    },
    saveSecrets: (secrets) => {
        fs.writeFileSync(secretsFilePath, JSON.stringify(secrets, null, 2), "utf-8");
    },
    generateTOTP: (secret) => otplib.authenticator.generate(secret)
});
