## Why

Ice increases volatility, but we also need an opposite floor modifier that introduces controlled friction and tactical pacing.

Sand tiles provide that contrast with minimal implementation risk and high gameplay readability.

## What Changes

- Add centralized balance knobs for Sand modifier activation and slowdown strength.
- Extend floor setup with sand activation/tile count/penalty values.
- Generate non-blocking sand tiles on eligible floors.
- Apply movement slowdown while the snake is standing on sand.
- Add dev scenario entry in `?dev=1` to smoke-test sand quickly.
- Surface sand state in run status modifier text.

## Capabilities

### Modified Capabilities

- `balance-config`: floor modifier knobs include Sand cadence and slowdown penalty.
- `gameplay`: floor modifiers include deterministic sand slowdown behavior.

## Impact

- Affected code:
  - `src/game/core/balance.ts`
  - `src/game/core/constants.ts`
  - `src/game/core/devScenarios.ts`
  - `src/game/scenes/GameScene.ts`
  - `src/game/systems/i18n.ts`
- No new dependencies.
