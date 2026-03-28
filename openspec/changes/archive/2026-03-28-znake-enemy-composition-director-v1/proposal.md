## Why

Depth-band role weights exist, but role composition still feels too static within a floor band. A deterministic composition director adds short role windows so encounters vary meaningfully while preserving fairness and reproducibility.

## Key Points (Codex-style)

- What is changing
  - Add deterministic role-composition windows per depth band.
  - Route normal enemy role picks through window-aware policy resolution.
  - Emit window context in encounter role-composition telemetry.
- Why we are doing it
  - Improve encounter variety/readability without non-deterministic spikes.
- Impacted areas
  - Depth balance config, enemy spawn orchestration, telemetry payload context, depth-balance tests.
- Risks / unknowns
  - Poorly tuned windows could over-cluster pressure roles; first pass keeps bounded multipliers and existing caps/guardrails.

## What Changes

- Add `roleCompositionDirectorById` config with deterministic spawn windows for early/mid/late depth bands.
- Add `getRoleSpawnPolicyWindowForFloor` helper to resolve active window id and adjusted role policy.
- Update GameScene normal enemy spawn to use window-aware policy.
- Extend `encounter_role_composition` telemetry payload with `roleWindowId`.
- Add deterministic tests for window rotation and late-band blocker-cap behavior.

## Capabilities

### New Capabilities

- `enemy-composition-director`: Deterministic role-composition window contracts layered on depth-band role policies.

### Modified Capabilities

- `gameplay`: Normal enemy role drafting now uses deterministic composition windows.
- `balance-config`: Role policy configuration now includes windowed director data.
- `observability`: Encounter role-composition telemetry includes active window identifier.

## Impact

- Affected code:
  - `src/game/core/balance.ts`
  - `src/game/scenes/GameScene.ts`
  - `tests/depth-balance-config.test.ts`
- No dependency changes.
