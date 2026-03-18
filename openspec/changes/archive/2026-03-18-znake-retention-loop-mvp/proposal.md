## Why

Znake has a solid core loop, but retention will plateau without meaningful progression between runs. We need a minimal but high-impact meta layer that gives players a reason to start another run immediately.

## What Changes

- Add a lightweight meta-progression profile with one persistent currency.
- Add a run-start relic draft (choose 1 of 3 relics before gameplay starts).
- Add a short persistent talent tree with clear branches and capped power.
- Add end-of-run reward conversion (score/floor/kills to currency) and run summary.
- Keep scope intentionally small (MVP) to validate retention impact before expanding.

## Capabilities

### New Capabilities

- `meta-progression`: Persistent profile, currency economy, relic draft, and talent unlocks.

### Modified Capabilities

- `game-core`: Session state and persistent profile bootstrapping need to coexist.
- `scenes`: New run-start and run-end flows are required for relic selection and reward summary.
- `gameplay`: Base run configuration must include effects from selected relic and unlocked talents.

## Impact

- Affected code:
  - `src/game/core/*` (state, config, types, persistence)
  - `src/game/scenes/MenuScene.ts`
  - `src/game/scenes/GameScene.ts`
  - `src/game/scenes/DeathScene.ts`
  - Potential new scene for relic draft / meta summary
- Adds local persistence schema versioning requirements.
- No backend dependency required for MVP (local storage first).
