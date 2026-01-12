const stack = document.getElementById('stack');

const notifications = new Map();

function removeNotification(id) {
  const node = notifications.get(id);
  if (node) {
    node.remove();
    notifications.delete(id);
  }
}

function addNotification(payload) {
  const node = document.createElement('div');
  node.className = 'notification';
  node.innerHTML = `
    <div class="meta">${payload.appName || 'Aplicativo'} · ${new Date().toLocaleTimeString('pt-BR')}</div>
    <h3>${payload.summary || 'Notificação'}</h3>
    <p>${payload.body || ''}</p>
  `;
  stack.prepend(node);
  notifications.set(payload.id, node);

  const timeout = payload.expireTimeout && payload.expireTimeout > 0 ? payload.expireTimeout : 6000;
  setTimeout(() => removeNotification(payload.id), timeout);
}

window.solidrock.onNotify(addNotification);
window.solidrock.onClose(removeNotification);
window.solidrock.ready();
