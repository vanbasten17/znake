## Context

This change adds a focused improvement contract for znake-route-risk-localization-contract-v1.

## Key Points (Codex-style)

- What is changing
  - Codify cue pairing contract.
- Why we are doing it
  - Preserve readability under translation.
- Impacted areas
  - routeRisk.ts + i18n labels.
- Risks / unknowns
  - Long labels wrapping.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
