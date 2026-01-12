const fs = require('fs');
const path = require('path');

const DEFAULT_SETTINGS = {
  theme: 'dark',
  panelHeight: 34,
  fontFamily: 'Inter, system-ui, sans-serif'
};

function getConfigPath() {
  const home = process.env.HOME || '';
  return path.join(home, '.config', 'solidrock', 'settings.json');
}

function loadSettings() {
  const configPath = getConfigPath();
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (error) {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings) {
  const configPath = getConfigPath();
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(settings, null, 2), 'utf8');
}

function getThemeSettings() {
  return loadSettings();
}

function setThemeSettings(partial) {
  const current = loadSettings();
  const next = { ...current, ...partial };
  saveSettings(next);
  return next;
}

module.exports = {
  getThemeSettings,
  setThemeSettings
};
