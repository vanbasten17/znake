## Context

This change adds a focused improvement contract for znake-ui-action-button-target-token-v1.

## Key Points (Codex-style)

- What is changing
  - Use CSS token fallback for min target sizing.
- Why we are doing it
  - Consistency across overlays.
- Impacted areas
  - ActionButton.ts, tokens.css.
- Risks / unknowns
  - Token fallback mismatch.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
