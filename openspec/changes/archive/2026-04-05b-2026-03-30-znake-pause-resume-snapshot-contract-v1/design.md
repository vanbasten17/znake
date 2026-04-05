## Context

Session interruptions are common on desktop and mobile-like workflows. Resume must re-enter with identical simulation state and predictable UI control ownership.

## Key Points (Codex-style)

- What is changing
  - Add explicit pause/resume state snapshot contracts for gameplay-critical systems.
- Why we are doing it
  - Ensure fairness and reproducibility when sessions are interrupted.
- Impacted areas
  - Scene lifecycle, simulation tick integrity, overlay coordination.
- Risks / unknowns
  - Snapshot boundaries may miss transient VFX-only state.

## Goals / Non-Goals

Goals:
- Preserve deterministic simulation state across pause/resume.
- Ensure overlays and input ownership restore in deterministic order.
- Keep GameScene orchestration slim via extracted snapshot helper.

Non-Goals:
- Build save/load across app restarts.
- Persist replay artifacts at pause time.

## Decisions

### Decision: Simulation-first restore order
- Restore simulation snapshot first, then rebind UI/overlay state.
- Rationale: simulation remains source of truth.

### Decision: Explicit transient-state exclusion list
- Exclude non-authoritative render-only transients from snapshot payload.
- Rationale: minimizes snapshot complexity and drift.

## Risks / Trade-offs

- Risk: Missing ownership handoff edge cases with stacked overlays.
- Trade-off: Strong determinism contract with slightly more lifecycle plumbing.
