## 1. Control mode and UI policy

- [x] 1.1 Add runtime control-scheme detection for touch-first small screens vs keyboard/large screens.
- [x] 1.2 Apply body class toggles and hide HUD touch controls in keyboard mode.
- [x] 1.3 Centralize mode-aware HUD hint strings and use them from scene flows.

## 2. Gameplay growth and rendering reliability

- [x] 2.1 Add deterministic `pendingGrowth` handling on food pickup and movement resolution.
- [x] 2.2 Fix snake segment rendering loop so drawing the head does not stop tail rendering.
- [x] 2.3 Verify lint/type/build checks after the gameplay and HUD changes.
