## Context

This change adds a focused improvement contract for znake-dom-hud-pulse-timeout-contract-v1.

## Key Points (Codex-style)

- What is changing
  - Document timer clearing contract.
- Why we are doing it
  - Avoid stale pulse state.
- Impacted areas
  - domHud.ts.
- Risks / unknowns
  - Timeout race edge cases.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
