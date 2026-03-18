## Why

Progression pacing is still too flat between early runs, and cost/reward cadence can create dead moments in the menu.
We need a focused economy/progression pass driven by telemetry and explicit goals.

## What Changes

- Re-tune reward pacing coefficients and early talent cost cadence via centralized balance config.
- Re-tune early floor pacing by using snake-length targets for non-boss progression.
- Add two mid-term progression goals (one-time rewards) to increase cross-run motivation.
- Add telemetry events for reward composition and goal progress/claims.
- Surface goal progress in menu to make progression visible.

## Capabilities

### Modified Capabilities

- `balance-config`: economy and talent tuning knobs updated.
- `meta-progression`: goal progress and one-time claims persisted in profile.
- `observability`: economy/progression telemetry coverage expanded.
- `scenes`: menu shows goal status/progress.

## Impact

- Affected areas:
  - `src/game/core/balance.ts`
  - `src/game/core/meta.ts` / profile schema
  - `src/game/scenes/MenuScene.ts` and run-end progression hooks
  - `src/game/systems/telemetry.ts`
