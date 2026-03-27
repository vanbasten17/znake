## Why

Enemy pressure is currently readable in isolated moments, but room-level threat mixes still blur tactical priorities. A first-pass enemy role taxonomy gives players faster "what to solve first" decisions while preserving deterministic simulation behavior and existing orchestration boundaries.

## Key Points (Codex-style)

- **What is changing**
  - Introduce explicit role contracts for `sniper`, `blocker`, `summoner`, `charger`, and `leech`, including role intent, telegraph shape, and counterplay windows.
  - Define fairness guardrails for each role so threats remain legible and avoid unavoidable damage spikes.
  - Keep role tuning and spawn cadence in centralized balance configuration.
- **Why we are doing it**
  - To improve tactical readability and room-level decision quality so players can quickly classify danger, pick priorities, and understand loss causes.
- **Impacted areas**
  - Enemy simulation contracts, spawn composition rules, combat readability cues surfaced to scene presentation, telemetry for role-pressure outcomes, and balance data tables.
- **Risks / unknowns**
  - Role overlap could reduce clarity if signatures are too similar.
  - Overtuned cadence could create unfair stacked pressure in dense rooms.
  - Guardrails that are too strict may collapse encounter variety.

## What Changes

- Define first-pass contracts for five enemy roles:
  - `sniper`: lane-threat specialist with clear aim telegraph and punishable commitment.
  - `blocker`: space-denial specialist that shapes routing but preserves escape options.
  - `summoner`: board-scaling specialist with manageable escalation windows.
  - `charger`: burst-lane specialist with explicit windup and high-commit recovery.
  - `leech`: economy-pressure specialist that threatens pickups/resources unless answered.
- Add role-level fairness standards for telegraph minimums, reaction windows, and anti-stack constraints.
- Introduce data-driven role knobs (timings, cooldowns, cadence weights, spawn caps, role-mix constraints) in central balance config.
- Preserve deterministic simulation by deriving role behavior and cadence outcomes from seeded/stateful simulation inputs only.
- Keep `GameScene` as orchestrator: scene consumes role state for feedback/readability, while role logic and resolution remain in simulation/config layers.
- Add role-focused observability events to evaluate readability and fairness outcomes during tuning.

## Capabilities

### New Capabilities

- `enemy-role-taxonomy`: Defines role contracts, readability signals, and fairness/counterplay guardrails for tactical enemy composition.

### Modified Capabilities

- `gameplay`: Enemy behavior expectations expand from per-enemy telegraph rules to explicit role contracts and room-level role counterplay/fairness requirements.
- `balance-config`: Central balance tables expand to include role knobs, cadence policies, and anti-stack constraints for deterministic encounter tuning.
- `scenes`: Game-scene orchestration requirements expand to include role-state readability surfacing while preserving simulation ownership boundaries.
- `observability`: Telemetry requirements expand to capture role composition and role-caused pressure outcomes for fairness/readability analysis.

## Impact

- Affected specs:
  - `openspec/specs/gameplay/spec.md`
  - `openspec/specs/balance-config/spec.md`
  - `openspec/specs/scenes/spec.md`
  - `openspec/specs/observability/spec.md`
  - `openspec/specs/enemy-role-taxonomy/spec.md` (new)
- Affected systems (planned):
  - Enemy simulation role contracts and role-state outputs
  - Spawn/cadence composition policy
  - `GameScene` role readability orchestration hooks
  - Central balance config modules
  - Telemetry emission for role taxonomy outcomes
- No new third-party dependencies are required.
