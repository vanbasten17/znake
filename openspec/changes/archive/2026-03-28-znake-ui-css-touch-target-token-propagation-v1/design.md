## Context

This change adds a focused improvement contract for znake-ui-css-touch-target-token-propagation-v1.

## Key Points (Codex-style)

- What is changing
  - Propagate token usage across launch and overlays.
- Why we are doing it
  - Consistent pointer ergonomics.
- Impacted areas
  - tokens.css + styles.
- Risks / unknowns
  - Legacy class misses.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
