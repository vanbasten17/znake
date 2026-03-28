## Context

This change adds a focused improvement contract for znake-refactor-accessibility-media-sync-guard-v1.

## Key Points (Codex-style)

- What is changing
  - Guard re-registration in setup.
- Why we are doing it
  - Avoid redundant listeners.
- Impacted areas
  - accessibility.ts.
- Risks / unknowns
  - Legacy browser listener branch.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
