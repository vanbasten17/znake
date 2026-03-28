## Why

Early-run survivability and route expression are currently constrained by a baseline start length that is one segment longer than intended for the current pacing targets. We need to align the baseline to `head + 2` while preserving all existing talent/relic/reward bonus stacking behavior.

## What Changes

- Reduce default run-start baseline length from `4` to `3` (`head + 2`) in centralized balance config.
- Define explicit run-start composition behavior as `baseSnakeLength + bonusStartLength` so progression bonuses remain additive and deterministic.
- Add deterministic regression checks around run-start composition to prevent accidental rewrites of baseline/bonus stacking behavior.

## Key Points (Codex-style)

- What is changing
  - Run-start baseline length becomes `3`, while bonus sources continue stacking via `bonusStartLength`.
- Why we are doing it
  - Improve early-floor readability/fairness without rewriting progression systems.
- Impacted areas
  - `src/game/core/balance.ts`, run-start spawn composition path, deterministic tests.
- Risks / unknowns
  - Minor early-run difficulty shift; risk of accidentally changing bonus composition semantics if tests are incomplete.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `gameplay`: codify run-start composition behavior and deterministic additive stacking semantics.
- `balance-config`: codify centralized baseline start-length tuning and additive bonus composition policy.

## Impact

- Affected code: run config defaults and run-start spawn composition consumers.
- No new dependencies.
- No API changes.
