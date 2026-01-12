const searchInput = document.getElementById('search');
const appList = document.getElementById('appList');

let apps = [];

function renderList(filter = '') {
  const query = filter.toLowerCase();
  appList.innerHTML = '';
  const filtered = apps.filter((app) => app.name.toLowerCase().includes(query));

  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'Nenhum aplicativo encontrado.';
    appList.appendChild(empty);
    return;
  }

  for (const app of filtered) {
    const item = document.createElement('button');
    item.className = 'app-item';
    item.type = 'button';
    item.innerHTML = `
      <span class="app-name">${app.name}</span>
      <span class="app-meta">${app.categories || ''}</span>
    `;
    item.addEventListener('click', () => {
      window.novaShell.launch(app);
    });
    appList.appendChild(item);
  }
}

async function init() {
  apps = await window.novaShell.getApps();
  renderList();
  searchInput.focus();
}

searchInput.addEventListener('input', (event) => {
  renderList(event.target.value);
});

init();
