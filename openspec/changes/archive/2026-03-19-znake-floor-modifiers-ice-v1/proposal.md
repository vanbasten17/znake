## Why

Darkness already adds one environmental modifier, but runs still need a second low-cost variation mechanic to improve floor-to-floor feel.

Ice tiles are a good MVP modifier: simple visuals, deterministic behavior, and clear tuning knobs.

## What Changes

- Add centralized balance knobs for an Ice floor modifier.
- Extend floor setup model with ice activation + tile count + slide-step config.
- Generate non-blocking ice tiles on eligible floors.
- Apply deterministic extra slide behavior when the snake lands on ice.
- Surface active ice state in run status text alongside existing modifiers.

## Capabilities

### Modified Capabilities

- `balance-config`: modifier cadence knobs include Ice parameters.
- `gameplay`: floor modifiers include deterministic Ice tile sliding behavior.

## Impact

- Affected code:
  - `src/game/core/balance.ts`
  - `src/game/core/constants.ts`
  - `src/game/scenes/GameScene.ts`
  - `src/game/systems/i18n.ts`
- No new dependencies.
