# NovaShell (MVP)

MVP de um "desktop shell" com Electron rodando sobre Sway/Wayland.

## Requisitos

- Node.js 20+
- npm
- Electron 29+ (instalado via `npm install` no diretório do projeto)
- Sway, swaybg, wl-clipboard, xdg-utils

## Instalação

```bash
cd nova-shell
npm install
sudo ./scripts/install.sh
```

Na tela de login, selecione a sessão **NovaShell**.

## Execução (modo dev)

Abre painel e launcher fora da sessão para testes rápidos:

```bash
npm run dev
```

## Logs e troubleshooting

- Confira logs do Sway em `~/.local/share/sway/`.
- Para validar que o launcher está rodando: `ps -ef | grep nova-shell-launcher`.
- Se o launcher não abre, teste manualmente: `novashell-launcher --toggle`.
- Para depuração do Electron, execute `ELECTRON_ENABLE_LOGGING=1 novashell-panel`.

## Desinstalação

```bash
sudo ./scripts/uninstall.sh
```
