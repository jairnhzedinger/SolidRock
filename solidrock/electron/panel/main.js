const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const { getThemeSettings } = require('../common/theme');

let panelWindow;

function createPanelWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width } = primaryDisplay.bounds;
  const { panelHeight } = getThemeSettings();
  const height = Number(panelHeight) || 34;

  panelWindow = new BrowserWindow({
    width,
    height,
    x: 0,
    y: 0,
    frame: false,
    transparent: false,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  panelWindow.setAlwaysOnTop(true, 'screen-saver');
  panelWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  panelWindow.loadFile(path.join(__dirname, 'renderer.html'));

  const reposition = () => {
    const display = screen.getPrimaryDisplay();
    panelWindow.setBounds({ x: 0, y: 0, width: display.bounds.width, height });
  };

  screen.on('display-metrics-changed', reposition);
  screen.on('display-added', reposition);
  screen.on('display-removed', reposition);
}

app.setName('solidrock-panel');

app.whenReady().then(() => {
  createPanelWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createPanelWindow();
    }
  });
});

app.on('window-all-closed', () => {
  app.quit();
});
