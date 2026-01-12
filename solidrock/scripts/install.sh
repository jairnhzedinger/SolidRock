#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PREFIX="/usr"

if [[ $EUID -ne 0 ]]; then
  echo "Por favor execute como root: sudo ./scripts/install.sh"
  exit 1
fi

install_packages() {
  if command -v apt-get >/dev/null 2>&1; then
    apt-get update
    apt-get install -y sway swaybg wl-clipboard xdg-utils
  elif command -v dnf >/dev/null 2>&1; then
    dnf install -y sway swaybg wl-clipboard xdg-utils
  elif command -v pacman >/dev/null 2>&1; then
    pacman -Syu --noconfirm sway swaybg wl-clipboard xdg-utils
  elif command -v zypper >/dev/null 2>&1; then
    zypper install -y sway swaybg wl-clipboard xdg-utils
  else
    echo "Nenhum gerenciador de pacotes suportado encontrado. Instale sway, swaybg, wl-clipboard e xdg-utils manualmente."
  fi
}

install_packages

install -Dm755 "$ROOT_DIR/scripts/solidrock-session" "$PREFIX/bin/solidrock-session"
install -Dm755 "$ROOT_DIR/scripts/solidrock-panel" "$PREFIX/bin/solidrock-panel"
install -Dm755 "$ROOT_DIR/scripts/solidrock-dock" "$PREFIX/bin/solidrock-dock"
install -Dm755 "$ROOT_DIR/scripts/solidrock-launcher" "$PREFIX/bin/solidrock-launcher"
install -Dm755 "$ROOT_DIR/scripts/solidrock-settings" "$PREFIX/bin/solidrock-settings"
install -Dm755 "$ROOT_DIR/scripts/solidrock-notify" "$PREFIX/bin/solidrock-notify"

install -Dm644 "$ROOT_DIR/xsession/solidrock.desktop" "/usr/share/wayland-sessions/solidrock.desktop"

install -Dm644 "$ROOT_DIR/sway/config" "/etc/solidrock/sway/config"
install -Dm644 "$ROOT_DIR/sway/keybindings.conf" "/etc/solidrock/sway/keybindings.conf"

install -Dm644 "$ROOT_DIR/services/solidrock-panel.service" "/usr/lib/systemd/user/solidrock-panel.service"
install -Dm644 "$ROOT_DIR/services/solidrock-notify.service" "/usr/lib/systemd/user/solidrock-notify.service"

rm -rf /usr/share/solidrock
mkdir -p /usr/share/solidrock
cp -r "$ROOT_DIR/electron" /usr/share/solidrock/
cp "$ROOT_DIR/package.json" /usr/share/solidrock/

cat <<'INFO'
SolidRock Desktop instalado. Selecione a sessão SolidRock Desktop na tela de login.

Para habilitar serviços do usuário:
  systemctl --user daemon-reload
  systemctl --user enable --now solidrock-panel.service solidrock-notify.service
INFO
