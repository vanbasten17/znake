## Why

Current enemy variety is solid but mostly direct pursuit. Adding `Egg` and `Mirror` introduces pattern-learning and route planning without requiring a full combat redesign.

## What Changes

- Add two new enemy archetypes:
  - `Egg`: stationary trap that hatches into a moving snake after a short countdown.
  - `Mirror`: snake that tracks the player's recent path with delay.
- Add data-driven spawn knobs for both archetypes.
- Extend dev scenarios with a quick `egg+mirror` encounter for smoke testing.
- Render distinct silhouettes/colors for both enemies for readability.

## Capabilities

### Modified Capabilities

- `gameplay`: enemy AI/collision includes Egg hatch behavior and Mirror delayed tracking.
- `balance-config`: spawn rates and behavior knobs for Egg/Mirror are centralized.

## Impact

- Affected code:
  - `src/game/core/types.ts`
  - `src/game/core/balance.ts`
  - `src/game/core/devScenarios.ts`
  - `src/game/scenes/GameScene.ts`
- No new dependencies.
