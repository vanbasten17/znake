## Context

This change adds a focused improvement contract for znake-run-history-entry-shape-contract-v1.

## Key Points (Codex-style)

- What is changing
  - Document required persisted fields.
- Why we are doing it
  - Safer migrations.
- Impacted areas
  - runHistory.ts.
- Risks / unknowns
  - Schema evolution friction.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
