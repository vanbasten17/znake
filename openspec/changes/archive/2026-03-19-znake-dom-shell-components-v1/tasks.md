## 1. OpenSpec definition

- [x] 1.1 Create proposal/design/tasks and relevant spec deltas.

## 2. Runtime shell implementation

- [x] 2.1 Add runtime shell mount module and render current shell markup from TypeScript.
- [x] 2.2 Reduce `index.html` to minimal boot container and keep styles/script loading intact.
- [x] 2.3 Update boot flow to mount shell before input, i18n, and Phaser lifecycle setup.
- [x] 2.4 Make HUD DOM references runtime-safe (no import-time required element lookups).

## 3. Validation

- [x] 3.1 Run `openspec validate znake-dom-shell-components-v1`.
- [x] 3.2 Run `pnpm check`.
- [x] 3.3 Run `pnpm build`.
