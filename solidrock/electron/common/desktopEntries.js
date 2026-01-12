const fs = require('fs');
const path = require('path');

const DESKTOP_DIRS = [
  '/usr/share/applications',
  path.join(process.env.HOME || '', '.local/share/applications')
];

function parseDesktopFile(contents) {
  const lines = contents.split(/\r?\n/);
  let inEntry = false;
  const data = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    if (trimmed === '[Desktop Entry]') {
      inEntry = true;
      continue;
    }
    if (!inEntry) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx);
    const value = trimmed.slice(idx + 1);
    data[key] = value;
  }
  return data;
}

function cleanExec(execLine) {
  if (!execLine) return '';
  return execLine
    .replace(/\s+%[fFuUdDnNickvm]/g, '')
    .replace(/%[fFuUdDnNickvm]/g, '')
    .trim();
}

function loadDesktopEntries() {
  const entries = [];
  for (const dir of DESKTOP_DIRS) {
    if (!dir || !fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((file) => file.endsWith('.desktop'));
    for (const file of files) {
      const fullPath = path.join(dir, file);
      try {
        const contents = fs.readFileSync(fullPath, 'utf8');
        const data = parseDesktopFile(contents);
        if (data.NoDisplay === 'true' || data.Hidden === 'true') continue;
        if (!data.Name || !data.Exec) continue;
        entries.push({
          id: path.basename(file, '.desktop'),
          name: data.Name,
          exec: cleanExec(data.Exec),
          terminal: data.Terminal === 'true',
          categories: data.Categories || '',
          filePath: fullPath
        });
      } catch (error) {
        // Skip invalid desktop files
      }
    }
  }

  return entries.sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = {
  loadDesktopEntries
};
