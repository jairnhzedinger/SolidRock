const dockInner = document.getElementById('dockInner');

function renderDock(apps) {
  dockInner.innerHTML = '';
  for (const app of apps) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'dock-item';
    button.title = app.name;

    const icon = document.createElement('div');
    icon.className = 'dock-icon';
    icon.textContent = app.icon || '⬤';

    const label = document.createElement('span');
    label.className = 'dock-label';
    label.textContent = app.name;

    const indicator = document.createElement('span');
    indicator.className = 'dock-indicator';

    button.appendChild(icon);
    button.appendChild(label);
    button.appendChild(indicator);
    button.addEventListener('click', () => {
      window.solidrock.launchDockApp(app);
    });

    dockInner.appendChild(button);
  }
}

async function init() {
  const apps = await window.solidrock.getDockApps();
  renderDock(apps);
}

init();
