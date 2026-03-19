## Design Summary

Implement scene-scoped DOM overlay mounted inside `#game-area` during `Upgrade`.

Overlay lifecycle follows scene lifecycle (mounted on create, removed on shutdown/pick) to avoid leakage.

## UI Approach

- New CSS Module (`upgradeOverlay.module.css`) for scoped styles.
- Reuse global design tokens for consistency with relic overlay and shell primitives.
- Keep bottom controls/hints outside overlay unchanged.

## Interaction Model

- Pointer: each upgrade card is a clickable button.
- Keyboard: `1/2/3` and numpad equivalents.
- Selection path remains unchanged (`pick` logic, telemetry, floor advance, scene start).
