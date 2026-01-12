const dbus = require('dbus-next');

function getSessionBus() {
  return dbus.sessionBus();
}

module.exports = {
  getSessionBus
};
