## Why

Runs need a clearer passive feeding pressure loop to increase tension between objectives and make food/core-item decisions more meaningful.

## What Changes

- Add biome core pressure system on eligible non-boss floors:
  - countdown timer that resets on food
  - timeout applies tail degradation
  - coolant-style counter charges can absorb timeout ticks
- Reuse existing `core` biome item as coolant source (plus current score/growth effect).
- Surface pressure state in localized run status text.
- Keep this slice configurable through centralized balance knobs.

## Impact

- Affected specs:
  - `gameplay`
  - `balance-config`
- Affected runtime:
  - `GameScene` pressure loop
  - `BALANCE.biome` config
  - i18n copy for pressure status
