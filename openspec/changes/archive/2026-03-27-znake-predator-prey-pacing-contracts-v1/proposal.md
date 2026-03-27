## Why

Predator-prey encounters currently mix hunt and escape pressure without an explicit deterministic pacing contract, which can make threat rhythm feel noisy even when individual enemies are fair. Defining clear pacing windows now improves fairness readability and gives balancing/telemetry a stable vocabulary before expanding content breadth.

## Key Points (Codex-style)

- **What is changing**
  - Add deterministic room pacing phases for hunt/escape rhythm, plus deterministic phase transitions.
  - Add anti-overlap pressure guardrails so stacked burst windows remain threatening but avoid low-agency spikes.
  - Add lightweight pacing readability and telemetry hooks for tuning and player-facing clarity.
- **Why we are doing it**
  - To make encounters feel intentionally tense instead of chaotic, while preserving determinism and strong counterplay fairness.
- **Impacted areas**
  - Gameplay encounter sequencing, central balance pacing knobs, `GameScene` readability orchestration, and observability payloads.
- **Risks / unknowns**
  - Over-constrained pacing may flatten encounter variety.
  - Poorly tuned windows may over-soften challenge or create downtime.
  - Readability hooks can clutter HUD if not bounded.

## What Changes

- Define deterministic pacing phases (`hunt`, `escape`, `reset`) and transition triggers that are resolved from run state plus seeded simulation inputs.
- Add anti-overlap guardrails for high-pressure actions so dangerous windows do not chain into unavoidable near-instant damage when alternatives exist.
- Move pacing window knobs and guardrail thresholds into centralized balance configuration.
- Expose bounded pacing-phase readability state to scene presentation while keeping `GameScene` as orchestrator only.
- Emit stable pacing telemetry events/reason codes for transition analysis, fairness diagnostics, and regression detection.

## Capabilities

### New Capabilities

- `predator-prey-pacing`: Defines deterministic encounter pacing windows and fairness guardrails for hunt/escape rhythm.

### Modified Capabilities

- `gameplay`: Encounter fairness/readability requirements expand to include deterministic pacing phases and anti-overlap pressure sequencing.
- `balance-config`: Central balance requirements expand with pacing-window and overlap-guardrail tuning tables.
- `scenes`: Game-scene orchestration expands to surface concise pacing readability cues from simulation-owned state.
- `observability`: Telemetry requirements expand with pacing lifecycle and anti-overlap intervention context.

## Impact

- Affected specs:
  - `openspec/specs/gameplay/spec.md`
  - `openspec/specs/balance-config/spec.md`
  - `openspec/specs/scenes/spec.md`
  - `openspec/specs/observability/spec.md`
  - `openspec/specs/predator-prey-pacing/spec.md` (new)
- Affected systems (planned):
  - Enemy/encounter simulation pacing policy
  - Central balance tables for pacing and fairness
  - `GameScene` pacing-readability surfacing
  - Telemetry events and run-end pacing summaries
- No new third-party dependencies are required.
