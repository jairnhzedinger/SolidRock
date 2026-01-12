const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('solidrock', {
  onNotify: (callback) => ipcRenderer.on('solidrock:notify', (_event, payload) => callback(payload)),
  onClose: (callback) => ipcRenderer.on('solidrock:closeNotification', (_event, id) => callback(id)),
  ready: () => ipcRenderer.send('solidrock:notify-ready')
});
