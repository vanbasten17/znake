## Context

This change adds a focused improvement contract for znake-scene-flow-transition-guardrails-v1.

## Key Points (Codex-style)

- What is changing
  - Codify transition call contract.
- Why we are doing it
  - Reduce inconsistent shell state.
- Impacted areas
  - sceneFlow.ts + scene callers.
- Risks / unknowns
  - Missed transition args.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
