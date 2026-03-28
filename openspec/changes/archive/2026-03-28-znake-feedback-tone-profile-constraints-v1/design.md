## Context

This change adds a focused improvement contract for znake-feedback-tone-profile-constraints-v1.

## Key Points (Codex-style)

- What is changing
  - Document profile safety bounds.
- Why we are doing it
  - Protect comfort/readability.
- Impacted areas
  - feedback.ts.
- Risks / unknowns
  - Perceived volume variance.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
