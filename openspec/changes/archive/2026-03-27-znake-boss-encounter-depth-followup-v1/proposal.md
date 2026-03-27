## Why

Boss floors currently satisfy baseline fairness and deterministic encounter contracts, but they do not yet create enough run-defining identity, readable phase intent, or consistent counterplay pressure windows. We should deepen boss encounter texture now so players can learn and adapt around boss identity without sacrificing fairness/readability.

## Key Points (Codex-style)

- **What is changing**: Boss encounter contracts gain explicit identity signals, phase readability/counterplay windows, and deterministic anti-overlap safeguards that integrate with existing boss-floor + elite/miniboss systems.
- **Why we are doing it**: Bosses should feel like memorable, run-defining tests of movement mastery instead of just longer elite checks.
- **Impacted areas**: Boss encounter simulation/state, centralized balance tuning, scene readability surfaces, and encounter observability payloads.
- **Risks / unknowns**: Over-layering phase cues could create noise; stricter fairness guards may reduce intended challenge if thresholds are too permissive.

## What Changes

- Add explicit boss-identity encounter requirements so each boss presents stable, learnable pattern intent and deterministic counterplay windows.
- Add centralized balance knobs for boss phase cadence/readability and anti-cheap-hit fairness thresholds (spawn/reaction/pressure overlap).
- Add scene-level boss readability surfaces that consume simulation-owned encounter state while keeping `GameScene` presentation-only.
- Add boss encounter observability fields for phase window usage and bounded failure-reason attribution to support fairness tuning.
- Implement minimal focused code changes and deterministic tests to enforce contracts without broad content expansion.

## Capabilities

### New Capabilities

- `boss-encounter-depth`: Deterministic boss identity and counterplay contract for boss-floor encounters.

### Modified Capabilities

- `gameplay`: Boss encounter progression/readability/counterplay requirements are expanded while preserving simulation ownership.
- `balance-config`: Boss encounter phase/fairness tuning tables are extended and centralized.
- `scenes`: Boss readability presentation requirements are clarified under thin-scene orchestration boundaries.
- `observability`: Boss encounter telemetry context is extended for deterministic fairness analysis.

## Impact

- Affected systems: boss encounter simulation modules, boss pattern timing state, config-driven balance tables, scene HUD/overlay cue wiring, telemetry payload assembly.
- Affected files (expected): boss-related simulation/state and config modules in `src/game`, HUD/scene presentation connectors, and deterministic tests under `tests/`.
- No new dependencies expected.
