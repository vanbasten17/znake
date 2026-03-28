## Why

Boss encounters currently use a single phase behavior profile, which can make repeated boss floors feel too similar. A deterministic phase-remix contract adds bounded variation while preserving fairness and reproducibility.

## Key Points (Codex-style)

- What is changing
  - Add centralized boss phase-remix profiles and deterministic floor-ordinal rotation.
  - Resolve rage threshold and support respawn cadence from remix profile.
  - Include remix context in boss telemetry events.
- Why we are doing it
  - Improve long-run variety and readable boss identity without scene-local randomness.
- Impacted areas
  - Balance config, boss floor setup in `GameScene`, boss telemetry payloads, depth-balance tests.
- Risks / unknowns
  - Remix tuning could create unfair spikes if thresholds are too aggressive.

## What Changes

- Add `standard`, `assault`, and `siege` phase-remix profiles in central boss config.
- Add `getBossPhaseRemixForFloor()` helper for deterministic rotation.
- Apply remix-derived rage threshold and support-pickup respawn interval in boss encounters.
- Emit `phaseRemixId` context in boss phase window/change and boss damage telemetry.

## Capabilities

### Modified Capabilities

- `balance-config`: Boss remix profile and rotation knobs are centralized.
- `gameplay`: Boss phase escalation and support cadence resolve from deterministic remix profile.
- `observability`: Boss encounter telemetry includes remix context.
- `boss-encounter-depth`: Boss identity contracts include remix context.

## Impact

- Affected code:
  - `src/game/core/balance.ts`
  - `src/game/scenes/GameScene.ts`
  - `tests/depth-balance-config.test.ts`
- No dependency changes.
