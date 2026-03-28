## Context

Boss cadence currently uses `BALANCE.biome.boss.floorInterval = 3`, which makes boss milestones arrive at floor 3 and compresses the intended onboarding runway. Cadence is already data-driven, so a focused config update plus deterministic tests is the safest path.

## Key Points (Codex-style)

- What is changing
  - Central boss cadence interval is updated to 10 with tests aligned to floor-10 milestones.
- Why we are doing it
  - Deliver intended floor pacing (1-9 regular, 10 boss) and reduce abrupt early spikes.
- Impacted areas
  - Balance config and deterministic cadence tests.
- Risks / unknowns
  - Extended runway could shift overall difficulty curve and may need follow-up tuning.

## Goals / Non-Goals

**Goals:**
- Enforce deterministic floor-10 boss cadence.
- Keep progression behavior data-driven and scene-thin.
- Add regression checks for boss remix/cadence resolution.

**Non-Goals:**
- No broad enemy, economy, or relic rebalance.
- No structural progression-director refactor.
- No visual or UX overhaul.

## Decisions

1. Update only centralized cadence knob (`BALANCE.biome.boss.floorInterval`) from 3 to 10.
- Rationale: minimal deterministic change with maximal behavior impact.
- Alternative considered: custom cadence logic. Rejected as unnecessary complexity.

2. Update deterministic tests to lock floor-10 cadence semantics.
- Rationale: prevents silent regression.
- Alternative considered: relying on manual playtest only. Rejected for low repeatability.

## Risks / Trade-offs

- [Difficulty drift] More regular floors before first boss may lower early spike pressure.
  - Mitigation: preserve existing non-boss pressure tables and validate with existing checks.
- [Future cadence variants] Single global interval may be too rigid for multi-biome evolution.
  - Mitigation: keep this as first-pass baseline and iterate via future scoped change.
