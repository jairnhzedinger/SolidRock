#!/usr/bin/env bash
set -euo pipefail

CONFIG_PATH="/etc/novashell/sway/config"
if [[ ! -f "$CONFIG_PATH" ]]; then
  CONFIG_PATH="/usr/share/novashell/sway/config"
fi

export XDG_CURRENT_DESKTOP="NovaShell"
export XDG_SESSION_DESKTOP="NovaShell"
export XDG_SESSION_TYPE="wayland"
export XDG_SESSION_CLASS="user"
export XDG_CURRENT_SESSION="NovaShell"

exec sway -c "$CONFIG_PATH"
