# SolidRock Desktop

**SolidRock Desktop** é um desktop shell para Wayland construído sobre **Sway** (compositor) e **Electron** (shell).

**Slogan:** “Estável. Previsível. Inabalável.”

## Filosofia do projeto

- Desktop estável
- Comportamento previsível
- Zero surpresa em atualização
- Infraestrutura sólida
- Pensado para uso sério e institucional

## O que é o SolidRock Desktop

SolidRock Desktop é uma camada de shell que roda sobre o Sway, oferecendo painel, launcher, central de controle e notificações. O compositor continua sendo o Sway — não há compositor próprio.

## Arquitetura (Shell vs Compositor)

- **Compositor:** Sway (responsável por janelas, entrada e renderização Wayland)
- **Shell:** Electron (UI de painel, launcher, settings e notificações)

Componentes oficiais:

- `solidrock-panel` → painel Wayland (layer-shell)
- `solidrock-launcher` → launcher de apps
- `solidrock-settings` → central de controle
- `solidrock-notify` → daemon de notificações (DBus)
- `solidrock-system-api` → integração com sistema (módulo JS em `electron/common/system-api.js`)

## Painel Wayland (Layer-Shell)

O painel precisa ficar sempre no topo, sem foco e sem aparecer como janela comum. Como o Electron não implementa **zwlr-layer-shell**, o SolidRock utiliza um **helper nativo** (`solidrock-layer-host`) para hospedar a surface layer-shell e posicionar o painel. O helper é pensado para ser minimalista: criar a surface layer-shell e entregar ao Electron a responsabilidade da UI.

A base do helper está em `scripts/solidrock-layer-host.c` e será compilada/instalada junto ao sistema.

## Notificações (DBus / Freedesktop)

O daemon `solidrock-notify` implementa `org.freedesktop.Notifications` e exibe notificações no canto superior direito. Ele é executado como serviço `systemd --user`.

## Estrutura do projeto

```
solidrock/
 ├─ electron/
 │   ├─ panel/
 │   ├─ launcher/
 │   ├─ settings/
 │   ├─ notifications/
 │   ├─ common/
 │   │   ├─ system-api.js
 │   │   ├─ dbus.js
 │   │   ├─ theme.js
 ├─ services/
 │   ├─ solidrock-panel.service
 │   ├─ solidrock-notify.service
 ├─ sway/
 │   ├─ config
 │   ├─ keybindings.conf
 ├─ scripts/
 │   ├─ install.sh
 │   ├─ uninstall.sh
 │   ├─ dev.sh
 │   ├─ solidrock-layer-host.c
 ├─ xsession/
 │   ├─ solidrock.desktop
 ├─ README.md
```

## Instalação

```bash
cd solidrock
npm install
sudo ./scripts/install.sh
```

Na tela de login, selecione a sessão **SolidRock Desktop**.

Para habilitar serviços do usuário:

```bash
systemctl --user daemon-reload
systemctl --user enable --now solidrock-panel.service solidrock-notify.service
```

## Execução (modo dev)

```bash
./scripts/dev.sh
```

## Atalhos padrão

- **Super** → abre launcher
- **Super+S** → abre SolidRock Settings
- Painel não rouba foco
- Notificações discretas

## Roadmap V3

- Installer oficial e pacote para distros
- Helper layer-shell completo com integração IPC
- Migração opcional para Tauri
- Ferramentas de provisionamento institucional

## Uso em ambiente institucional

SolidRock Desktop foi desenhado para ambientes que exigem previsibilidade, estabilidade e políticas de mudança controladas. A arquitetura separa o compositor (Sway) do shell (Electron), permitindo validações de segurança, upgrades isolados e manutenção controlada.

## Limitações atuais

- Helper layer-shell ainda precisa de implementação completa e empacotamento.
- As ações de rede/som dependem de ferramentas externas (`nmcli`, `wpctl`).
- Notificações ainda não suportam ações avançadas (actions/hints complexos).
