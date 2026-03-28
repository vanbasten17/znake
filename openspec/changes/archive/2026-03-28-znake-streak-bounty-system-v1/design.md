## Context

Streak Bounty System is proposed as a focused change in the gameplay track. The goal is to keep gameplay clarity and architecture quality aligned while enabling fast iteration.

## Key Points (Codex-style)

- What is changing
  - Add clean-play streak bounties that reward no-hit or objective streaks.
- Why we are doing it
  - Reinforces skill expression and motivational mini-goals during runs.
- Impacted areas
  - Reward economy, objective loop, end-of-room feedback.
- Risks / unknowns
  - Could push passive play if bounty conditions are too strict.

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
- Anchor this change to objective-reward-loop to simplify archive lineage.
- Rationale: reduces archive ambiguity and keeps requirement mapping clear.

## Risks / Trade-offs

- Risk: Could push passive play if bounty conditions are too strict.
- Trade-off: More granular changes increase coordination overhead but improve rollback safety.

## Migration Plan

1. Finalize spec deltas and tasks for Streak Bounty System.
2. Execute implementation tasks in strict apply loops.
3. Validate with pnpm check and pnpm build when behavior/architecture changes.
4. Archive when all tasks are complete and gates are green.

Rollback strategy:
- Revert change directory and any implementation patches if validation fails.
