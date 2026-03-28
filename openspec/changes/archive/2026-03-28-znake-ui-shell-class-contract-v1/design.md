## Context

This change adds a focused improvement contract for znake-ui-shell-class-contract-v1.

## Key Points (Codex-style)

- What is changing
  - Clarify class exclusivity contract.
- Why we are doing it
  - Avoid style collision.
- Impacted areas
  - domHud.ts conventions.
- Risks / unknowns
  - Third-party class collisions.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
