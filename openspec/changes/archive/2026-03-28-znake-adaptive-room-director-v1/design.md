## Context

Adaptive Room Director is proposed as a focused change in the gameplay track. The goal is to keep gameplay clarity and architecture quality aligned while enabling fast iteration.

## Key Points (Codex-style)

- What is changing
  - Introduce a director that adjusts room pressure using run state, health trend, and recent mistakes.
- Why we are doing it
  - Improves fairness and keeps tension curves readable instead of random spikes.
- Impacted areas
  - Simulation pacing, room generation, balance tables, telemetry.
- Risks / unknowns
  - Director overfitting may reduce variety if constraints are too tight.

## Goals / Non-Goals

Goals:
- Capture implementation-ready requirements and bounded tasks.
- Preserve deterministic simulation boundaries.
- Keep the change independently archivable.

Non-Goals:
- Cross-cutting rewrite of unrelated systems.
- New dependencies unless implementation later proves mandatory.

## Decisions

### Decision: OpenSpec-first staged rollout
- Start with proposal/design/spec deltas and execute apply in later loops.
- Rationale: keeps scope explicit and reviewable before behavior changes.

### Decision: Single capability anchor
- Anchor this change to progression-director to simplify archive lineage.
- Rationale: reduces archive ambiguity and keeps requirement mapping clear.

## Risks / Trade-offs

- Risk: Director overfitting may reduce variety if constraints are too tight.
- Trade-off: More granular changes increase coordination overhead but improve rollback safety.

## Migration Plan

1. Finalize spec deltas and tasks for Adaptive Room Director.
2. Execute implementation tasks in strict apply loops.
3. Validate with pnpm check and pnpm build when behavior/architecture changes.
4. Archive when all tasks are complete and gates are green.

Rollback strategy:
- Revert change directory and any implementation patches if validation fails.
