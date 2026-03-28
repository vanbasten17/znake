## Context

This change adds a focused improvement contract for znake-i18n-static-dom-map-contract-v1.

## Key Points (Codex-style)

- What is changing
  - Document adapter mapping contract.
- Why we are doing it
  - Avoid silent copy gaps.
- Impacted areas
  - i18nDomAdapter.ts.
- Risks / unknowns
  - Forgotten IDs.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
