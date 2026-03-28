## Context

This change adds a focused improvement contract for znake-devtools-runtime-state-boundaries-v1.

## Key Points (Codex-style)

- What is changing
  - Clarify isolation boundaries.
- Why we are doing it
  - Prevent accidental gameplay mutation.
- Impacted areas
  - devtools/runtime.ts.
- Risks / unknowns
  - Debug hooks leakage.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
