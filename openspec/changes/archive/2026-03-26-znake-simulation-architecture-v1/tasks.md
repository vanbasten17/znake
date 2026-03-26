## 1. Spec

- [x] 1.1 Add `gameplay` deltas for simulation extraction boundaries and orchestrator responsibilities.
- [x] 1.2 Add `game-core` deltas for seeded RNG and deterministic simulation contracts.
- [x] 1.3 Add `tooling` deltas for simulation invariant tests and internal dev debug controls.
- [x] 1.4 Add `balance-config` delta for data-driven content policy.
- [x] 1.5 Add `meta-progression` delta for explicit profile migration chain.

## 2. Phase A — Simulation extraction (spawn/grid first)

- [x] 2.1 Create `src/game/simulation/grid.ts` with pure helpers (cell keys, bounds, occupancy, safe-cell checks).
- [x] 2.2 Create `src/game/simulation/layout.ts` for classic/rooms floor generation and connectivity validation.
- [x] 2.3 Create `src/game/simulation/spawn.ts` for open-cell pick and spawn candidate resolution.
- [x] 2.4 Integrate these modules into `GameScene` while preserving behavior.

## 3. Phase B — Seeded RNG

- [x] 3.1 Add `src/game/simulation/rng.ts` with seeded generator and utility picks.
- [x] 3.2 Thread RNG through extracted simulation modules.
- [x] 3.3 Remove direct `Math.random` from extracted gameplay systems and scene call sites touched in this change.

## 4. Phase C — Invariant tests

- [x] 4.1 Add test command and minimal test runner usage for pure TS modules.
- [x] 4.2 Add deterministic tests for layout connectivity and spawn safety.
- [x] 4.3 Add deterministic tests for RNG repeatability and weighted pick invariants.
- [x] 4.4 Add migration tests for profile version transitions/fallback.

## 5. Phase D — Devtools/debug utilities

- [x] 5.1 Add `src/game/devtools/*` with internal bridge for seed visibility and restart-with-same-seed.
- [x] 5.2 Add slow-motion toggle support (scene orchestrator scalar, dev-only control surface).
- [x] 5.3 Add low-risk optional debug overlay/hook for current seed and sim speed.

## 6. Phase E — Data-driven content

- [x] 6.1 Add `src/game/config/content.ts` for spawn pools/selection policy currently hardcoded in scene.
- [x] 6.2 Route scene selection logic through config-driven functions.
- [x] 6.3 Preserve existing balance semantics and probabilities.

## 7. Phase F — Save/profile versioning

- [x] 7.1 Extract profile parsing/migration into dedicated persistence/versioning helpers.
- [x] 7.2 Introduce explicit migration registry (`v1 -> v2 -> ... -> current`).
- [x] 7.3 Keep backup fallback behavior and safe defaults on invalid data.

## 8. Validation

- [x] 8.1 Run `openspec validate znake-simulation-architecture-v1`.
- [x] 8.2 Run `pnpm check`.
- [x] 8.3 Run `pnpm build`.
- [x] 8.4 Run tests.

## 9. Guide

- [x] 9.1 Confirm no new gameplay entities were introduced; guide entries unchanged.
