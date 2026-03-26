## Why

After the previous simulation extraction pass, `GameScene` still owns complex enemy behavior and objective timing state machines. This keeps critical rules tightly coupled to Phaser scene code and slows deterministic debugging.

We also still miss replay-ready input capture tied to run seed, which limits fast reproducibility for gameplay bugs.

## What Changes

- Extract enemy movement/collision rule logic into `src/game/simulation/enemy.ts` (pure logic, no Phaser/DOM).
- Extract objective/portal/core-pressure timing state transitions into `src/game/simulation/objectives.ts`.
- Finish RNG rollout for gameplay systems touched in this pass, avoiding direct `Math.random()` usage there.
- Add replay-ready seed/input capture primitives and wire them through `GameScene` orchestration.
- Keep side effects (telemetry, HUD, feedback, scene transitions, particles) in `GameScene`.

## Scope

- Incremental refactor of enemy and objective rule layers only.
- Deterministic state transitions for extracted modules.
- Replay capture model that records run seed + ordered input intents.

## Out of Scope

- Full replay playback implementation.
- Rendering/audio pipeline refactors.
- Large balancing changes.

## Migration and Risk Notes

- Risk: behavior drift in enemy AI/objective timing.
  - Mitigation: extract with parity-focused signatures and add deterministic tests.
- Risk: replay capture overhead in hot path.
  - Mitigation: compact event payloads and append-only arrays.

## Impact

- Affected specs:
  - `gameplay`
  - `game-core`
  - `tooling`
- Affected runtime:
  - `GameScene` orchestration around enemy tick and objective timers
  - simulation layer module coverage
  - devtools/replay debug surface
