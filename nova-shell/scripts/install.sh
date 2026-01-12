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

install -Dm755 "$ROOT_DIR/scripts/run-session.sh" "$PREFIX/bin/novashell-session"
install -Dm755 "$ROOT_DIR/scripts/novashell-panel" "$PREFIX/bin/novashell-panel"
install -Dm755 "$ROOT_DIR/scripts/novashell-launcher" "$PREFIX/bin/novashell-launcher"

install -Dm644 "$ROOT_DIR/xsession/novashell.desktop" "/usr/share/wayland-sessions/novashell.desktop"

install -Dm644 "$ROOT_DIR/sway/config" "/etc/novashell/sway/config"

rm -rf /usr/share/novashell
mkdir -p /usr/share/novashell
cp -r "$ROOT_DIR/electron" /usr/share/novashell/
cp "$ROOT_DIR/package.json" /usr/share/novashell/

echo "NovaShell instalado. Selecione a sessão NovaShell na tela de login."
