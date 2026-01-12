const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('solidrock', {
  getApps: () => ipcRenderer.invoke('solidrock:getApps'),
  launch: (appEntry) => ipcRenderer.invoke('solidrock:launch', appEntry)
});
