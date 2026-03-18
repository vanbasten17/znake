## Why

The core loop is stable but run variety can feel repetitive after a few floors. We need one additional elite behavior and one additional item interaction to increase retention without over-expanding scope.

## What Changes

- Add one extra elite enemy pattern (`ambusher`) with distinct movement pressure from `stalker`.
- Add one extra item interaction (`rift_battery`) that temporarily alters hazard pressure.
- Move elite/item spawn/event probabilities to explicit balance tables for data-driven tuning.
- Emit telemetry for new elite and item interactions to support later balancing.

## Capabilities

### Modified Capabilities

- `gameplay`: adds new elite behavior + item interaction in run loop.
- `balance-config`: centralizes spawn/event tuning knobs for the new content.
- `observability`: adds events for ambusher encounters and rift battery effects.

## Impact

- Affected areas:
  - `src/game/scenes/GameScene.ts`
  - `src/game/core/balance.ts`
  - `src/game/core/types.ts`
  - `src/game/systems/telemetry.ts`
