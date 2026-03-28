## Context

This change adds a focused improvement contract for znake-refactor-dom-factory-attrs-helper-v1.

## Key Points (Codex-style)

- What is changing
  - Add applyElementAttrs utility.
- Why we are doing it
  - Reduce ad-hoc attribute sets.
- Impacted areas
  - domFactory.ts, launch/main.ts.
- Risks / unknowns
  - Overgeneralized attrs.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
