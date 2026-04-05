## Context

Input responsiveness is a primary game-feel pillar. A tiny deterministic grace window can capture intent while preserving fairness and replay consistency.

## Key Points (Codex-style)

- What is changing
  - Add a deterministic short grace buffer for turn inputs.
- Why we are doing it
  - Improve responsiveness and perceived control without reducing skill ceiling.
- Impacted areas
  - Input pipeline timing, movement validity checks, HUD feedback.
- Risks / unknowns
  - Oversized grace windows can trivialize precision constraints.

## Goals / Non-Goals

Goals:
- Buffer near-valid turn intent briefly and execute at first valid tick.
- Keep strict determinism under fixed inputs and seed.
- Provide lightweight feedback when a command is buffered.

Non-Goals:
- Auto-pathing or predictive movement.
- Altering core collision rules.

## Decisions

### Decision: Fixed tick-based grace window
- Grace window is measured in simulation ticks, not wall-clock time.
- Rationale: deterministic and replay-safe.

### Decision: Last-valid command wins within window
- When multiple valid directional updates exist, latest non-opposite command is retained.
- Rationale: aligns with player intent during rapid correction.

## Risks / Trade-offs

- Risk: Buffer semantics may conflict with legacy control expectations.
- Trade-off: Better responsiveness with small input-system complexity increase.
