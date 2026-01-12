const networkStatus = document.getElementById('networkStatus');
const wifiToggle = document.getElementById('wifiToggle');
const wifiList = document.getElementById('wifiList');
const wifiPassword = document.getElementById('wifiPassword');
const wifiConnect = document.getElementById('wifiConnect');
const volumeSlider = document.getElementById('volumeSlider');
const volumeLabel = document.getElementById('volumeLabel');
const muteButton = document.getElementById('muteButton');
const logoutButton = document.getElementById('logoutButton');
const suspendButton = document.getElementById('suspendButton');
const rebootButton = document.getElementById('rebootButton');
const poweroffButton = document.getElementById('poweroffButton');
const themeSelect = document.getElementById('themeSelect');
const panelHeightInput = document.getElementById('panelHeight');
const fontFamilyInput = document.getElementById('fontFamily');
const saveAppearance = document.getElementById('saveAppearance');

async function refreshNetwork() {
  const status = await window.solidrock.getNetworkStatus();
  networkStatus.textContent = status.wifiEnabled ? 'Wi-Fi ativo' : 'Wi-Fi desligado';
  wifiToggle.checked = status.wifiEnabled;

  const networks = await window.solidrock.listWifiNetworks();
  wifiList.innerHTML = '';
  networks.forEach((net) => {
    const option = document.createElement('option');
    option.value = net.ssid;
    option.textContent = `${net.ssid || 'Rede oculta'} (${net.signal}%)`;
    if (net.inUse) {
      option.selected = true;
    }
    wifiList.appendChild(option);
  });
}

async function refreshAudio() {
  const info = await window.solidrock.getVolume();
  volumeSlider.value = info.volume;
  volumeLabel.textContent = `${info.volume}%`;
  muteButton.textContent = info.muted ? 'Unmute' : 'Mute';
}

function loadAppearance() {
  const settings = window.solidrock.getThemeSettings();
  themeSelect.value = settings.theme;
  panelHeightInput.value = settings.panelHeight;
  fontFamilyInput.value = settings.fontFamily;
}

wifiToggle.addEventListener('change', async () => {
  await window.solidrock.setWifiEnabled(wifiToggle.checked);
  await refreshNetwork();
});

wifiConnect.addEventListener('click', async () => {
  const ssid = wifiList.value;
  if (!ssid) return;
  await window.solidrock.connectWifi(ssid, wifiPassword.value);
  wifiPassword.value = '';
  await refreshNetwork();
});

volumeSlider.addEventListener('input', async () => {
  await window.solidrock.setVolume(volumeSlider.value);
  volumeLabel.textContent = `${volumeSlider.value}%`;
});

muteButton.addEventListener('click', async () => {
  await window.solidrock.toggleMute();
  await refreshAudio();
});

logoutButton.addEventListener('click', () => window.solidrock.logout());
suspendButton.addEventListener('click', () => window.solidrock.suspend());
rebootButton.addEventListener('click', () => window.solidrock.reboot());
poweroffButton.addEventListener('click', () => window.solidrock.poweroff());

saveAppearance.addEventListener('click', () => {
  window.solidrock.setThemeSettings({
    theme: themeSelect.value,
    panelHeight: Number(panelHeightInput.value),
    fontFamily: fontFamilyInput.value
  });
});

async function init() {
  await refreshNetwork();
  await refreshAudio();
  loadAppearance();
}

init();
