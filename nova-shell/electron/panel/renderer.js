const clockEl = document.getElementById('clock');
const appsButton = document.getElementById('appsButton');

function updateClock() {
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

appsButton.addEventListener('click', () => {
  window.novaShell.toggleLauncher();
});

updateClock();
setInterval(updateClock, 1000);
