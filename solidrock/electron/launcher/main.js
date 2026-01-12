const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { loadDesktopEntries } = require('../common/desktopEntries');

let launcherWindow;

function createLauncherWindow() {
  const display = screen.getPrimaryDisplay();
  const width = Math.min(720, display.workAreaSize.width - 40);
  const height = Math.min(520, display.workAreaSize.height - 80);

  launcherWindow = new BrowserWindow({
    width,
    height,
    show: false,
    frame: false,
    transparent: false,
    resizable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  launcherWindow.setAlwaysOnTop(true, 'screen-saver');
  launcherWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  launcherWindow.loadFile(path.join(__dirname, 'renderer.html'));

  const startHidden = process.env.SOLIDROCK_LAUNCHER_START_HIDDEN === '1';
  if (!startHidden) {
    launcherWindow.once('ready-to-show', () => launcherWindow.show());
  }

  launcherWindow.on('blur', () => {
    if (!startHidden) {
      launcherWindow.hide();
    }
  });
}

function launchApp(appEntry) {
  if (!appEntry) return;
  const command = appEntry.exec;
  if (!command) return;

  if (appEntry.terminal) {
    spawn('alacritty', ['-e', command], { detached: true, stdio: 'ignore' }).unref();
    return;
  }

  spawn('sh', ['-c', command], { detached: true, stdio: 'ignore' }).unref();
}

app.setName('solidrock-launcher');

app.whenReady().then(() => {
  createLauncherWindow();

  ipcMain.handle('solidrock:getApps', () => {
    return loadDesktopEntries();
  });

  ipcMain.handle('solidrock:launch', (_event, appEntry) => {
    launchApp(appEntry);
    if (launcherWindow && launcherWindow.isVisible()) {
      launcherWindow.hide();
    }
  });
});

app.on('window-all-closed', () => {
  app.quit();
});
