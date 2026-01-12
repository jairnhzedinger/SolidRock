#!/usr/bin/env bash
set -euo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "Por favor execute como root: sudo ./scripts/uninstall.sh"
  exit 1
fi

rm -f /usr/bin/solidrock-session
rm -f /usr/bin/solidrock-panel
rm -f /usr/bin/solidrock-launcher
rm -f /usr/bin/solidrock-settings
rm -f /usr/bin/solidrock-notify
rm -f /usr/share/wayland-sessions/solidrock.desktop
rm -rf /etc/solidrock
rm -rf /usr/share/solidrock
rm -f /usr/lib/systemd/user/solidrock-panel.service
rm -f /usr/lib/systemd/user/solidrock-notify.service

echo "SolidRock Desktop removido."
