## Context

This change adds a focused improvement contract for znake-refactor-control-scheme-query-reuse-v1.

## Key Points (Codex-style)

- What is changing
  - Reuse media query objects.
- Why we are doing it
  - Reduce duplicated query setup.
- Impacted areas
  - controlScheme.ts.
- Risks / unknowns
  - Listener lifecycle handling.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
