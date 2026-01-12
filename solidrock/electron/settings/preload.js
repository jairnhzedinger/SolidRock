const { contextBridge } = require('electron');
const systemApi = require('../common/system-api');
const { getThemeSettings, setThemeSettings } = require('../common/theme');

contextBridge.exposeInMainWorld('solidrock', {
  getNetworkStatus: () => systemApi.getNetworkStatus(),
  listWifiNetworks: () => systemApi.listWifiNetworks(),
  setWifiEnabled: (enabled) => systemApi.setWifiEnabled(enabled),
  connectWifi: (ssid, password) => systemApi.connectWifi(ssid, password),
  disconnectWifi: (device) => systemApi.disconnectWifi(device),
  getVolume: () => systemApi.getVolume(),
  setVolume: (volume) => systemApi.setVolume(volume),
  toggleMute: () => systemApi.toggleMute(),
  logout: () => systemApi.logout(),
  suspend: () => systemApi.suspend(),
  reboot: () => systemApi.reboot(),
  poweroff: () => systemApi.poweroff(),
  getThemeSettings: () => getThemeSettings(),
  setThemeSettings: (settings) => setThemeSettings(settings)
});
