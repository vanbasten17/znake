## Context

This change adds a focused improvement contract for znake-simulation-replay-version-tag-contract-v1.

## Key Points (Codex-style)

- What is changing
  - Codify version tag expectation.
- Why we are doing it
  - Supports forward-compatible replay parsing.
- Impacted areas
  - replay.ts + store.
- Risks / unknowns
  - Version bump overhead.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
