const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const dbus = require('dbus-next');
const { getSessionBus } = require('../common/dbus');

let notifyWindow;
let nextId = 1;

function createNotifyWindow() {
  const display = screen.getPrimaryDisplay();
  const width = 340;
  const height = 480;

  notifyWindow = new BrowserWindow({
    width,
    height,
    x: display.workArea.x + display.workArea.width - width - 16,
    y: display.workArea.y + 16,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    focusable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  notifyWindow.setAlwaysOnTop(true, 'screen-saver');
  notifyWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  notifyWindow.loadFile(path.join(__dirname, 'renderer.html'));
}

function registerNotificationService() {
  const bus = getSessionBus();
  const iface = new dbus.interface.Interface('org.freedesktop.Notifications');

  iface.addMethod(
    'GetCapabilities',
    { inSignature: '', outSignature: 'as' },
    () => ['body', 'body-markup', 'actions']
  );

  iface.addMethod(
    'GetServerInformation',
    { inSignature: '', outSignature: 'ssss' },
    () => ['SolidRock Notify', 'SolidRock Desktop', '0.2.0', '1.2']
  );

  iface.addMethod(
    'Notify',
    { inSignature: 'susssasa{sv}i', outSignature: 'u' },
    (appName, replacesId, appIcon, summary, body, actions, hints, expireTimeout) => {
      const id = replacesId && replacesId !== 0 ? replacesId : nextId++;
      const payload = {
        id,
        appName,
        appIcon,
        summary,
        body,
        actions,
        hints,
        expireTimeout
      };
      if (notifyWindow) {
        notifyWindow.webContents.send('solidrock:notify', payload);
      }
      return id;
    }
  );

  iface.addMethod(
    'CloseNotification',
    { inSignature: 'u', outSignature: '' },
    (id) => {
      if (notifyWindow) {
        notifyWindow.webContents.send('solidrock:closeNotification', id);
      }
    }
  );

  bus.requestName('org.freedesktop.Notifications').then(() => {
    bus.export('/org/freedesktop/Notifications', iface);
  });
}

app.setName('solidrock-notify');

app.whenReady().then(() => {
  createNotifyWindow();
  registerNotificationService();

  ipcMain.on('solidrock:notify-ready', () => {
    // Renderer ready
  });
});

app.on('window-all-closed', () => {
  app.quit();
});
