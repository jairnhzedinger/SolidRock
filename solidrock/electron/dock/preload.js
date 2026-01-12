const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('solidrock', {
  getDockApps: () => ipcRenderer.invoke('solidrock:getDockApps'),
  launchDockApp: (appEntry) => ipcRenderer.invoke('solidrock:launchDockApp', appEntry)
});
