const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

async function runCommand(command, args = []) {
  const { stdout } = await execFileAsync(command, args, { encoding: 'utf8' });
  return stdout.trim();
}

async function getNetworkStatus() {
  try {
    const wifi = await runCommand('nmcli', ['-t', '-f', 'WIFI', 'g']);
    const devices = await runCommand('nmcli', ['-t', '-f', 'DEVICE,TYPE,STATE,CONNECTION', 'device']);
    return {
      wifiEnabled: wifi.toLowerCase().includes('enabled'),
      devices: devices.split('\n').filter(Boolean)
    };
  } catch (error) {
    return { wifiEnabled: false, devices: [], error: error.message };
  }
}

async function listWifiNetworks() {
  try {
    const networks = await runCommand('nmcli', ['-t', '-f', 'SSID,SECURITY,SIGNAL,IN-USE', 'dev', 'wifi']);
    return networks
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [ssid, security, signal, inUse] = line.split(':');
        return {
          ssid,
          security,
          signal: Number(signal || 0),
          inUse: inUse === '*'
        };
      });
  } catch (error) {
    return [];
  }
}

async function setWifiEnabled(enabled) {
  await runCommand('nmcli', ['radio', 'wifi', enabled ? 'on' : 'off']);
}

async function connectWifi(ssid, password = '') {
  const args = ['dev', 'wifi', 'connect', ssid];
  if (password) {
    args.push('password', password);
  }
  await runCommand('nmcli', args);
}

async function disconnectWifi(device) {
  if (device) {
    await runCommand('nmcli', ['dev', 'disconnect', device]);
  }
}

function parseVolume(output) {
  const match = output.match(/Volume: (\d+(?:\.\d+)?)/);
  if (!match) return 0;
  return Math.round(Number(match[1]) * 100);
}

async function getVolume() {
  try {
    const output = await runCommand('wpctl', ['get-volume', '@DEFAULT_AUDIO_SINK@']);
    return {
      volume: parseVolume(output),
      muted: output.includes('MUTED')
    };
  } catch (error) {
    return { volume: 0, muted: false, error: error.message };
  }
}

async function setVolume(volume) {
  const value = Math.min(100, Math.max(0, Number(volume))) / 100;
  await runCommand('wpctl', ['set-volume', '@DEFAULT_AUDIO_SINK@', value.toString()]);
}

async function toggleMute() {
  await runCommand('wpctl', ['set-mute', '@DEFAULT_AUDIO_SINK@', 'toggle']);
}

async function logout() {
  const sessionId = process.env.XDG_SESSION_ID;
  if (sessionId) {
    await runCommand('loginctl', ['terminate-session', sessionId]);
  }
}

async function suspend() {
  await runCommand('systemctl', ['suspend']);
}

async function reboot() {
  await runCommand('systemctl', ['reboot']);
}

async function poweroff() {
  await runCommand('systemctl', ['poweroff']);
}

async function setBrightness(value) {
  await runCommand('brightnessctl', ['set', `${value}%`]);
}

async function toggleLauncher() {
  await runCommand('solidrock-launcher', ['--toggle']);
}

async function toggleSettings() {
  await runCommand('solidrock-settings', ['--toggle']);
}

module.exports = {
  getNetworkStatus,
  listWifiNetworks,
  setWifiEnabled,
  connectWifi,
  disconnectWifi,
  getVolume,
  setVolume,
  toggleMute,
  logout,
  suspend,
  reboot,
  poweroff,
  setBrightness,
  toggleLauncher,
  toggleSettings
};
