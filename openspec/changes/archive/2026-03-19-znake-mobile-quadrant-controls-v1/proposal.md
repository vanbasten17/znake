## Why

Current mobile run controls consume too much vertical space and rely on a D-pad interaction that feels less native on touch devices.

A quadrant tap pad improves one-handed usability and screen economy while preserving keyboard controls on larger devices.

## What Changes

- Replace touch D-pad directional controls with tap-by-quadrant on gameplay area:
  - Tap upper area -> `up`
  - Tap lower area -> `down`
  - Tap left area -> `left`
  - Tap right area -> `right`
- Remove Start/Pause touch action buttons and keep keyboard controls unchanged.
- Remove default swipe directional mapping to avoid conflicting touch intents.
- Update mobile hint copy to reflect tap-based movement.
- Remove reserved touch controls layout slice so gameplay uses full available content height.
- Remove bottom hint bar so game content can extend to the bottom edge.

## Capabilities

### Modified Capabilities

- `input-hud`: touch directional input moves from swipe + D-pad buttons to quadrant tap pad by default.
- `input-hud`: mobile UX copy reflects tap movement model.

## Impact

- Affected code:
  - `src/ui/mountShell.ts`
  - `src/game/systems/input.ts`
  - `src/game/systems/i18n.ts`
  - `src/styles/app.css`
- No new dependencies.
