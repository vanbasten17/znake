## Why

After readability improvements, the next high-ROI gameplay depth step is adding one floor modifier with controlled difficulty impact.

`Darkness` is the best first modifier because it adds tension without introducing new collision rules.

## What Changes

- Add a data-driven darkness modifier in floor setup.
- Activate darkness only on configured non-boss floors/cadence.
- Limit visibility around snake head with a configurable radius.
- Keep all gameplay rules unchanged (movement, collision, objectives).

## Capabilities

### Modified Capabilities

- `gameplay`: selected floors apply reduced-visibility pressure.
- `balance-config`: darkness cadence/radius is controlled from centralized balance knobs.

## Impact

- Affected code:
  - `src/game/core/balance.ts`
  - `src/game/scenes/GameScene.ts`
  - `src/game/systems/i18n.ts`
