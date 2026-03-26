## Design

### Key Points

#### What is changing

- We split gameplay responsibilities into:
  - Simulation layer (`src/game/simulation/*`): pure logic, deterministic, no Phaser/DOM.
  - Presentation layer (`src/game/scenes/*`, `src/game/render/*`): Phaser draw/update only.
  - Adapters (`src/game/systems/*`, persistence, telemetry): input/HUD/voice/audio/storage bridges.
- `GameScene` is kept as an orchestrator: reads inputs, advances simulation helpers, applies presentation side effects.

#### Why it matters

- Deterministic, testable logic enables safer iteration and faster bug reproduction.
- Reduced scene complexity lowers regression risk.
- Seeded RNG + migration helpers create a stable base for future replay/progression work.

#### Impacted areas

- `GameScene` call sites for floor generation/spawn/random decisions.
- New simulation modules and tests.
- Debug controls and save/profile loading path.

#### Risks / unknowns

- Partial extraction may leave mixed ownership temporarily.
- RNG threading order can subtly change outputs if not applied consistently.
- Migration pipeline must remain strict about malformed payload fallback.

### Target Architecture

1. Simulation layer (pure, deterministic)

- Folder: `src/game/simulation/*`
- Contains:
  - RNG abstraction + seeded generator
  - grid/layout generation and connectivity checks
  - spawn candidate selection and weighted picks
  - invariant helpers (safe cell, occupancy checks)
- Constraints:
  - no Phaser imports
  - no DOM/localStorage/window usage
  - explicit input/output state

2. Presentation layer (Phaser only)

- Folder: `src/game/scenes/*`, `src/game/render/*`
- Responsibilities:
  - drawing markers/entities/effects
  - camera and animation control
  - scene transitions
- No core gameplay rule ownership.

3. Adapter layer

- Input adapter: virtual/keyboard/voice input -> direction/ability intents.
- HUD adapter: simulation status -> localized HUD/status strings.
- Persistence adapter: profile save/load + migrations.
- Telemetry adapter: structured events from orchestrator and outcomes.

### Incremental Rollout Plan

Phase A: extract spawn/grid logic into simulation helpers and keep behavior parity.
Phase B: seeded RNG wiring through extracted systems and floor seed ownership in `GameScene`.
Phase C: add invariants tests for pure modules.
Phase D: add devtools for seed visibility/restart + slow motion.
Phase E: move selected content rules to `src/game/config/*`.
Phase F: implement save/profile migration pipeline with explicit versioning helpers.

### Determinism Strategy

- Introduce `GameRng` interface (`nextFloat`, `nextInt`, `pick`, optional `weightedPick`) and a seeded implementation.
- Scene owns a run-seed and passes RNG instance to simulation functions.
- Extracted logic must never call `Math.random` directly.

### Testing Strategy

- Pure tests only (Node test runner + tsx), no Phaser render assertions.
- Invariants focus:
  - generated layouts are connected/valid
  - spawn picks avoid blocked cells
  - same seed + same input => same outputs
  - profile migration behavior for version transitions and malformed payloads

### Devtools Surface (internal)

- Global dev bridge (low risk) exposing:
  - current run seed
  - restart with same seed
  - slow motion toggle factor
- Optional on-screen debug overlay hooks behind dev flag.

### Data-driven Content Scope

- Extract practical, high-change gameplay tables from scene logic to config modules:
  - powerup pools by objective/floor mode
  - elite/special enemy selection policies (where scene currently hardcodes arrays/weights)
- Keep existing `BALANCE` as central tuning source; config modules compose from it.

### Save/Profile Versioning

- Introduce migration chain:
  - parse raw profile -> detect version -> apply ordered migrations -> validate -> persist current version
- Keep backup key fallback behavior.
- Preserve existing player data semantics.
