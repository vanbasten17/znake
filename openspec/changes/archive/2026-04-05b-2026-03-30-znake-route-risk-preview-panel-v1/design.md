## Context

Route choice is a core strategy moment. We need enough forward signal to support informed decisions without collapsing uncertainty.

## Key Points (Codex-style)

- What is changing
  - Add a compact route-risk preview panel before route lock-in.
- Why we are doing it
  - Improve fairness by making tradeoffs legible before commitment.
- Impacted areas
  - Run-map selection UX, risk forecast presentation, balance readability.
- Risks / unknowns
  - Exposing too much certainty can flatten strategic tension.

## Goals / Non-Goals

Goals:
- Provide low/medium/high risk bands with concise rationale tags.
- Keep preview deterministic from current run state.
- Avoid introducing spoiler-level data.

Non-Goals:
- Full probabilistic breakdown per room.
- Rework entire route map generation.

## Decisions

### Decision: Banded risk labels with reason tags
- Show one risk band and up to two reason tags (e.g., elite density, low heal windows).
- Rationale: readable, quick, and actionable.

### Decision: Information budget guardrail
- Hide exact spawn tables and hidden modifiers.
- Rationale: keeps exploration and mastery intact.

## Risks / Trade-offs

- Risk: Band calibration drift can mislead player trust.
- Trade-off: Better decision fairness in exchange for calibration maintenance.
