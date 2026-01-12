#!/usr/bin/env bash
set -euo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "Por favor execute como root: sudo ./scripts/uninstall.sh"
  exit 1
fi

rm -f /usr/bin/novashell-session
rm -f /usr/bin/novashell-panel
rm -f /usr/bin/novashell-launcher
rm -f /usr/share/wayland-sessions/novashell.desktop
rm -rf /etc/novashell
rm -rf /usr/share/novashell

echo "NovaShell removido."
