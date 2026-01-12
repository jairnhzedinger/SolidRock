const { contextBridge } = require('electron');
const { exec } = require('child_process');

contextBridge.exposeInMainWorld('novaShell', {
  toggleLauncher: () => {
    exec('novashell-launcher --toggle');
  }
});
