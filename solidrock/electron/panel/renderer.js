const clockEl = document.getElementById('clock');
const appsButton = document.getElementById('appsButton');
const panel = document.querySelector('.panel');

function updateClock() {
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function applyTheme() {
  const settings = window.solidrock.getThemeSettings();
  panel.dataset.theme = settings.theme;
  panel.style.fontFamily = settings.fontFamily;
}

appsButton.addEventListener('click', () => {
  window.solidrock.toggleLauncher();
});

applyTheme();
updateClock();
setInterval(updateClock, 1000);
