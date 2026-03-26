## Design

### Key Points

#### What is changing

- New pure simulation modules:
  - `simulation/enemy.ts`
  - `simulation/objectives.ts`
  - `simulation/replay.ts`
- `GameScene` delegates rule evaluation to these modules and keeps orchestration side effects.

#### Why it matters

- Shrinks rule-heavy code from scene class.
- Improves determinism and testability.
- Enables reproducible run debugging via seed + captured input stream.

#### Impacted areas

- Enemy step/update, enemy collision detection, objective progression checks, portal/core-pressure timers, and run input capture.

#### Risks / unknowns

- Some behavior currently depends on scene-local ordering; extraction must preserve ordering semantics.

### Enemy Simulation API

- `tickEnemy(enemy, context)`:
  - input: enemy state, player state, wall checker, rng, elite config.
  - output: next enemy state and optional events (`ateFoodCell`, `hatched`).
- `detectEnemyCollision(snakeHead, enemies)`:
  - output collision target + part (`head`/`body`) for scene damage handling.
- `resolveEnemyCollisionDamage(enemyKind, part, config)`:
  - pure damage calculation.

Scene keeps:
- spawn/despawn lists
- score/telemetry updates
- particles/feedback

### Objectives Simulation API

- `initPortalFlow(...)` and `tickPortalFlow(...)`:
  - manages countdown/grace/squeeze timers.
  - emits deterministic events (`spawn_portals`, `urgent_tick`, `squeeze_step`).
- `initCorePressure(...)` and `tickCorePressure(...)`:
  - manages pressure timing and coolant/decay outcomes.
- `shouldCompleteObjective(...)`:
  - pure completion check for score/kills objectives.

Scene keeps:
- concrete portal placement (safe-cell pick)
- actual snake segment decay and death handling
- UX/telemetry side effects

### Replay-ready Seed/Input Capture

- `simulation/replay.ts` owns run capture model:
  - run seed
  - ordered input events with relative ms
- `GameScene` records intents (`dir`, `turn`, `ability`, `pause`, keyboard action markers) when accepted.
- Devtools bridge exposes current capture snapshot for debug export.

### Determinism Policy

- Extracted modules receive `GameRng`.
- No `Math.random` in extracted logic.
- Scene visual-only jitter/particles may still be random but routed through seeded RNG in this pass for consistency.
