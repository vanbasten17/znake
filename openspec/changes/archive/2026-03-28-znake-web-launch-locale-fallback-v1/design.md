## Context

This change adds a focused improvement contract for znake-web-launch-locale-fallback-v1.

## Key Points (Codex-style)

- What is changing
  - Harden locale normalization path.
- Why we are doing it
  - Prevent unsupported locale copy breaks.
- Impacted areas
  - launch/main.ts.
- Risks / unknowns
  - Locale edge cases.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
