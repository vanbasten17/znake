## Context

This change adds a focused improvement contract for znake-web-launch-link-safety-v1.

## Key Points (Codex-style)

- What is changing
  - Normalize outbound link attrs through helper.
- Why we are doing it
  - Reduce web security footguns.
- Impacted areas
  - launch/main.ts.
- Risks / unknowns
  - May alter manual link rendering.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
