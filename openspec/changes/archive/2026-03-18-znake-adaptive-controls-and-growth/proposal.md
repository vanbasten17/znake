## Why

Znake needs platform-appropriate controls so desktop users are not forced to use mobile HUD buttons, and touch users still have an accessible control surface. We also need to guarantee visible snake growth behavior when eating red orbs to preserve core gameplay clarity.

## What Changes

- Add adaptive control mode detection (touch-first small screens vs keyboard/large screens).
- Show DOM HUD controls only in touch mode; hide them for keyboard mode.
- Make HUD hint copy mode-aware (keyboard hints on desktop, touch hints on mobile).
- Guarantee snake growth by explicit `pendingGrowth` handling when food is eaten.
- Fix snake body rendering so the tail is always drawn (head draw no longer aborts frame rendering).
- Rebrand in-game title text to Znake.

## Capabilities

### New Capabilities

- `adaptive-controls`: Context-aware control-mode selection and UI visibility policy.
- `snake-visual-growth`: Deterministic visual growth and tail rendering guarantees after food collection.

### Modified Capabilities

- `input-hud`: HUD hint behavior and control visibility rules now vary by active control mode.
- `gameplay`: Snake growth and rendering behavior are clarified and enforced.

## Impact

- Affected code:
  - `src/game/systems/controlScheme.ts`
  - `src/game/systems/domHud.ts`
  - `src/styles/app.css`
  - `src/main.ts`
  - `src/game/scenes/GameScene.ts`
  - `src/game/scenes/UpgradeScene.ts`
  - `src/game/scenes/DeathScene.ts`
- No external API changes.
- No dependency additions.
