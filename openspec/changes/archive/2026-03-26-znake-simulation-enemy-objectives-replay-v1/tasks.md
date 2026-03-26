## 1. Spec

- [x] 1.1 Add gameplay delta for enemy and objective simulation extraction.
- [x] 1.2 Add game-core delta for replay-ready seed/input capture.
- [x] 1.3 Add tooling delta for deterministic tests covering enemy/objectives/replay.

## 2. Implementation — Enemy simulation extraction

- [x] 2.1 Add `src/game/simulation/enemy.ts` pure rule helpers.
- [x] 2.2 Route `GameScene` enemy movement/collision rule decisions through simulation helpers.
- [x] 2.3 Keep scene-side side effects unchanged (feedback, telemetry, scoring, transitions).

## 3. Implementation — Objectives simulation extraction

- [x] 3.1 Add `src/game/simulation/objectives.ts` for portal/core-pressure/objective completion state transitions.
- [x] 3.2 Integrate state machine outputs into `GameScene` orchestration.
- [x] 3.3 Preserve existing objective behavior and ordering.

## 4. Implementation — RNG rollout and replay capture

- [x] 4.1 Remove remaining direct `Math.random()` usage in gameplay systems touched by this refactor.
- [x] 4.2 Add `src/game/simulation/replay.ts` and wire run seed + input intent capture in `GameScene`.
- [x] 4.3 Expose replay capture snapshot through devtools runtime.

## 5. Tests

- [x] 5.1 Add pure tests for enemy simulation decisions/collision invariants.
- [x] 5.2 Add pure tests for objective state machine transitions.
- [x] 5.3 Add pure tests for replay capture ordering and seed binding.

## 6. Validation

- [x] 6.1 `openspec validate znake-simulation-enemy-objectives-replay-v1`
- [x] 6.2 `pnpm test`
- [x] 6.3 `pnpm check`
- [x] 6.4 `pnpm build`
