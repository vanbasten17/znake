## Context

Overlays are central to run pacing and player comprehension. State transitions must remain deterministic and explicit so gameplay does not leak across UI boundaries.

## Key Points (Codex-style)

- What is changing
  - Define explicit overlay lifecycle state contracts with ownership handoff rules.
- Why we are doing it
  - Improve UI consistency, control clarity, and scene orchestration safety.
- Impacted areas
  - Scene overlays, input ownership, UI state transitions.
- Risks / unknowns
  - Added lifecycle states can increase orchestration complexity.

## Goals / Non-Goals

Goals:
- Formalize overlay state machine transitions and invalid transition handling.
- Make ownership handoff between gameplay and overlays explicit.
- Keep orchestrator logic slim by extracting transition guards.

Non-Goals:
- Visual redesign of overlay layouts.
- New UI framework adoption.

## Decisions

### Decision: Overlay state machine with guarded transitions
- Use a compact finite-state contract for overlay lifecycle.
- Rationale: prevents accidental cross-state behavior.

### Decision: Ownership token on transition boundaries
- Apply explicit ownership token transfer at enter/exit boundaries.
- Rationale: avoids input race conditions.

## Risks / Trade-offs

- Risk: Existing ad-hoc paths may break under strict guards.
- Trade-off: Better correctness and UX consistency with moderate migration effort.
