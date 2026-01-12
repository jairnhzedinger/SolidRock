const { app, BrowserWindow } = require('electron');
const path = require('path');

let settingsWindow;

function createSettingsWindow() {
  settingsWindow = new BrowserWindow({
    width: 720,
    height: 640,
    frame: false,
    resizable: true,
    show: true,
    title: 'SolidRock Settings',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  settingsWindow.loadFile(path.join(__dirname, 'renderer.html'));
}

app.setName('solidrock-settings');

app.whenReady().then(() => {
  createSettingsWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createSettingsWindow();
    }
  });
});

app.on('window-all-closed', () => {
  app.quit();
});
