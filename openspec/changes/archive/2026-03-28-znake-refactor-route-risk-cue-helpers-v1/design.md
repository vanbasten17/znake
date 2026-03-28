## Context

This change adds a focused improvement contract for znake-refactor-route-risk-cue-helpers-v1.

## Key Points (Codex-style)

- What is changing
  - Extract symbol lookup helper.
- Why we are doing it
  - Improve formatter testability.
- Impacted areas
  - routeRisk.ts.
- Risks / unknowns
  - No behavior change expected.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
