## Why

`GameScene` currently hosts a very large amount of gameplay logic (spawn rules, grid generation, enemy behavior helpers, progression checks, random decisions, and some persistence coupling). This slows iteration, increases regression risk, and blocks deterministic debugging/replay tooling.

To keep shipping safely, we need an incremental architecture upgrade that preserves behavior while moving rules into pure modules and introducing deterministic primitives.

## What Changes

- Extract high-value gameplay logic into a pure simulation layer under `src/game/simulation/*` (starting with grid/layout + spawn logic).
- Introduce a seeded RNG abstraction and thread it through extracted systems, replacing direct `Math.random()` usage in those systems.
- Add invariant-focused automated tests for pure simulation modules.
- Add internal devtools/debug utilities (current seed, restart with same seed, slow motion toggle, low-risk debug hooks).
- Move selected gameplay content selection rules to data-driven config under `src/game/config/*`.
- Introduce explicit profile/save versioning and migration helpers with safe fallback behavior.

## Scope

- Incremental extraction only; `GameScene` remains orchestrator and still owns Phaser/DOM calls.
- Deterministic behavior for extracted pure systems.
- Minimal in-game behavior changes unless required for deterministic correctness.
- Small, reviewable phases that can be validated independently.

## Out of Scope

- Full rewrite of all gameplay rules in one pass.
- Replacing Phaser scene model or DOM systems.
- Network/cloud saves, account systems, or backend persistence.
- Broad balance retuning.

## Migration and Risk Notes

- Primary risk is accidental gameplay drift during extraction. Mitigation: extract in slices, keep old call sites until parity is validated, and add invariants tests.
- Seeded RNG rollout may expose latent ordering assumptions. Mitigation: localize RNG ownership and make state transitions explicit.
- Save/profile migrations can corrupt data if unsafe. Mitigation: explicit version map, defensive parsing, and backup fallback retention.

## Impact

- Affected specs:
  - `gameplay`
  - `game-core`
  - `tooling`
  - `balance-config`
  - `meta-progression`
- Affected runtime:
  - `GameScene` orchestration responsibilities
  - core simulation helpers and spawn/layout systems
  - profile persistence/migration path
  - internal debug iteration workflow
