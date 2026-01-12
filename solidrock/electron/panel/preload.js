const { contextBridge } = require('electron');
const systemApi = require('../common/system-api');
const { getThemeSettings } = require('../common/theme');

contextBridge.exposeInMainWorld('solidrock', {
  toggleLauncher: () => systemApi.toggleLauncher(),
  getThemeSettings: () => getThemeSettings()
});
