## Why

Kill-objective floors currently feel similar to normal runs. Elimination mode + venom introduces a distinct combat loop and strategic ranged pressure.

## What Changes

- Treat kill-objective floors as elimination runs:
  - no food spawn
  - kill-target objective remains primary
- Add venom mechanic:
  - collectible venom charge powerup
  - manual fire with cooldown
  - projectile travels forward and damages enemies
- Add localized run-status and hint cues for venom readiness/cooldown.
- Add venom to field guide with i18n.

## Impact

- Affected specs:
  - `gameplay`
  - `input-hud`
  - `scenes`
- Affected runtime:
  - GameScene objective/spawn and projectile loop
  - Virtual input for ability trigger
  - glossary + i18n entries
