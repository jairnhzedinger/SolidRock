const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('novaShell', {
  getApps: () => ipcRenderer.invoke('novaShell:getApps'),
  launch: (appEntry) => ipcRenderer.invoke('novaShell:launch', appEntry)
});
