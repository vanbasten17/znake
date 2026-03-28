## Context

Risk Reward Shrine Events is proposed as a focused change in the gameplay track. The goal is to keep gameplay clarity and architecture quality aligned while enabling fast iteration.

## Key Points (Codex-style)

- What is changing
  - Add optional shrine choices that trade immediate pain for long-term power.
- Why we are doing it
  - Creates meaningful decisions and run identity with transparent tradeoffs.
- Impacted areas
  - Event choices, economy tuning, run history summaries.
- Risks / unknowns
  - Snowball risk if reward multipliers stack without caps.

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
- Anchor this change to event-choices to simplify archive lineage.
- Rationale: reduces archive ambiguity and keeps requirement mapping clear.

## Risks / Trade-offs

- Risk: Snowball risk if reward multipliers stack without caps.
- Trade-off: More granular changes increase coordination overhead but improve rollback safety.

## Migration Plan

1. Finalize spec deltas and tasks for Risk Reward Shrine Events.
2. Execute implementation tasks in strict apply loops.
3. Validate with pnpm check and pnpm build when behavior/architecture changes.
4. Archive when all tasks are complete and gates are green.

Rollback strategy:
- Revert change directory and any implementation patches if validation fails.
