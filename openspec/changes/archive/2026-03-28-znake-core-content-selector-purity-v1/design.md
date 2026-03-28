## Context

This change adds a focused improvement contract for znake-core-content-selector-purity-v1.

## Key Points (Codex-style)

- What is changing
  - Lock selector purity constraints.
- Why we are doing it
  - Protect deterministic draws.
- Impacted areas
  - contentSelectors.ts.
- Risks / unknowns
  - Hidden mutable state.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
