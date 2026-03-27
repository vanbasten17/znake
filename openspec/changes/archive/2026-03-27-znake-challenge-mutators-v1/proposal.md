## Why

Znake's objective/reward loop now establishes short-term purpose, but run-to-run variation after that loop stabilizes remains shallow. We need deterministic challenge mutators to increase replayability while preserving fairness, readability, and composability with existing systems.

## Key Points (Codex-style)

- **What is changing**
  - A first-pass deterministic challenge mutator layer is introduced with taxonomy, activation rules, and guardrails.
- **Why we are doing it**
  - To increase replayability and build variety without relying on permanent stat inflation.
- **Impacted areas**
  - Gameplay runtime orchestration, centralized balance config, lightweight meta unlock/gating hooks, scene readability surfaces, and telemetry.
- **Risks / unknowns**
  - Overlapping mutators can reduce fairness/readability if composition rules are weak; rollout needs strict anti-frustration constraints and observability.

## What Changes

- Define a first-pass mutator taxonomy (pressure, constraint, economy, routing) with explicit compatibility tags.
- Add seed-driven activation and deterministic draft rules so the same seed yields the same mutator set.
- Centralize mutator definitions, weights, eligibility, conflict rules, and safety ceilings in balance config.
- Add composition contracts with objective flow, run-map node routing intent, body-economy sinks, and event-choice outcomes.
- Introduce readability and anti-frustration guardrails (stack limits, protected windows, blocked combinations, minimum recovery guarantees).
- Add mutator visibility and telemetry contracts so mutator influence is inspectable and debuggable.

## Capabilities

### New Capabilities

- `challenge-mutators`: Deterministic mutator taxonomy, activation pipeline, and composition/safety constraints for run variance.

### Modified Capabilities

- `gameplay`: Add mutator activation timing, simulation-side application boundaries, and fairness guardrails during run resolution.
- `balance-config`: Add centralized mutator catalog, eligibility, conflict, and safety tuning tables.
- `meta-progression`: Add lightweight unlock/gating contract for mutator availability without permanent stat inflation.
- `observability`: Add mutator lifecycle and impact telemetry contract for tuning and regression detection.
- `scenes`: Add readability contract for mutator previews and active mutator status surfaces.

## Impact

- Affected systems: run bootstrap/config assembly, objective/reward/event resolution hooks, run-map route intent hooks, body spend validation hooks, HUD overlays, and telemetry emission points.
- Affected files (anticipated): gameplay simulation helpers, balance schema/config modules, profile/meta selectors, scene orchestration adapters, and telemetry payload typing.
- APIs/contracts: Introduces a stable mutator payload contract consumed across simulation and presentation boundaries.
- Dependencies: No new external runtime dependency required.
