## Why

Gameplay tuning values are currently scattered across scene and meta logic, which slows balancing iterations and increases risk when adjusting difficulty or economy. We need centralized, data-driven balance definitions.

## What Changes

- Introduce a dedicated balance configuration module for gameplay and economy tuning.
- Move floor scaling formulas, spawn chances, and reward formula inputs into central config.
- Move talent costs to central balance data.
- Keep existing gameplay behavior functionally equivalent, with only small pacing adjustments where already intended.

## Capabilities

### New Capabilities

- `balance-config`: centralized source of truth for tunable gameplay and economy values.

### Modified Capabilities

- `gameplay`: floor progression and spawn probabilities read from balance config.
- `meta-progression`: talent costs and run reward calculations read from balance config.

## Impact

- Affected files:
  - `src/game/core/balance.ts` (new)
  - `src/game/scenes/GameScene.ts`
  - `src/game/core/meta.ts`
- No API/backend changes.
