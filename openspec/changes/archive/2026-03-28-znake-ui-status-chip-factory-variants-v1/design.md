## Context

This change adds a focused improvement contract for znake-ui-status-chip-factory-variants-v1.

## Key Points (Codex-style)

- What is changing
  - Add optional tone variant class mapping.
- Why we are doing it
  - Reduce repetitive class joins.
- Impacted areas
  - StatusChip.ts, overlayController.ts.
- Risks / unknowns
  - Variant naming drift.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
