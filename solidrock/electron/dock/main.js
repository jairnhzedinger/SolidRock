const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { loadDesktopEntries } = require('../common/desktopEntries');

let dockWindow;

function findEntry(entries, { ids = [], names = [], categories = [] }) {
  const loweredIds = ids.map((id) => id.toLowerCase());
  const loweredNames = names.map((name) => name.toLowerCase());
  const loweredCategories = categories.map((category) => category.toLowerCase());

  return entries.find((entry) => {
    const entryId = entry.id.toLowerCase();
    const entryName = entry.name.toLowerCase();
    if (loweredIds.includes(entryId)) return true;
    if (loweredNames.some((name) => entryName.includes(name))) return true;
    if (!entry.categories) return false;
    const entryCategories = entry.categories
      .split(';')
      .map((category) => category.toLowerCase())
      .filter(Boolean);
    return loweredCategories.some((category) => entryCategories.includes(category));
  });
}

function buildDockApps() {
  const entries = loadDesktopEntries();

  const fileManager = findEntry(entries, {
    ids: [
      'org.gnome.nautilus',
      'org.gnome.Nautilus',
      'nautilus',
      'thunar',
      'pcmanfm',
      'org.kde.dolphin',
      'dolphin',
      'nemo'
    ],
    names: ['Files', 'Arquivos', 'File Manager', 'File Explorer', 'Dolphin', 'Nautilus', 'Thunar'],
    categories: ['FileManager']
  });

  const browser = findEntry(entries, {
    ids: [
      'firefox',
      'org.mozilla.firefox',
      'chromium',
      'google-chrome',
      'brave-browser',
      'org.brave.Browser',
      'microsoft-edge',
      'org.vivaldi.Vivaldi'
    ],
    names: ['Firefox', 'Chromium', 'Chrome', 'Brave', 'Edge', 'Vivaldi', 'Browser', 'Navegador'],
    categories: ['WebBrowser']
  });

  const terminal = findEntry(entries, {
    ids: ['alacritty', 'kitty', 'org.kde.konsole', 'org.gnome.Terminal', 'gnome-terminal'],
    names: ['Terminal', 'Konsole', 'Alacritty', 'Kitty'],
    categories: ['TerminalEmulator']
  });

  const items = [
    {
      id: 'launcher',
      name: 'Apps',
      exec: 'solidrock-launcher --toggle',
      icon: '✨'
    },
    {
      id: 'files',
      name: 'Arquivos',
      exec: fileManager?.exec || 'xdg-open "$HOME"',
      icon: '🗂️'
    },
    {
      id: 'browser',
      name: 'Navegador',
      exec: browser?.exec || 'xdg-open https://duckduckgo.com',
      icon: '🌐'
    },
    {
      id: 'terminal',
      name: 'Terminal',
      exec: terminal?.exec || 'alacritty',
      icon: '🖥️'
    },
    {
      id: 'settings',
      name: 'Configurações',
      exec: 'solidrock-settings --toggle',
      icon: '⚙️'
    }
  ];

  return items;
}

function launchApp(appEntry) {
  if (!appEntry?.exec) return;
  spawn('sh', ['-c', appEntry.exec], { detached: true, stdio: 'ignore' }).unref();
}

function createDockWindow() {
  const display = screen.getPrimaryDisplay();
  const width = display.bounds.width;
  const height = 84;
  const y = display.bounds.height - height;

  dockWindow = new BrowserWindow({
    width,
    height,
    x: 0,
    y,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  dockWindow.setAlwaysOnTop(true, 'screen-saver');
  dockWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  dockWindow.loadFile(path.join(__dirname, 'renderer.html'));

  const reposition = () => {
    const currentDisplay = screen.getPrimaryDisplay();
    dockWindow.setBounds({
      x: 0,
      y: currentDisplay.bounds.height - height,
      width: currentDisplay.bounds.width,
      height
    });
  };

  screen.on('display-metrics-changed', reposition);
  screen.on('display-added', reposition);
  screen.on('display-removed', reposition);
}

app.setName('solidrock-dock');

app.whenReady().then(() => {
  createDockWindow();

  ipcMain.handle('solidrock:getDockApps', () => buildDockApps());
  ipcMain.handle('solidrock:launchDockApp', (_event, appEntry) => launchApp(appEntry));

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createDockWindow();
    }
  });
});

app.on('window-all-closed', () => {
  app.quit();
});
