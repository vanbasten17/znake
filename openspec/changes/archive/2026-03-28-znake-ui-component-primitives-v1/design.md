## Context

The game currently uses ad-hoc element creation in multiple scenes. This change introduces tiny composable primitives.

## Key Points (Codex-style)

- What is changing
  - Introduce SOLID-style UI primitives with clear single responsibilities.
- Why we are doing it
  - Improve modularity and make future UI slices faster.
- Impacted areas
  - scene DOM setup paths.
- Risks / unknowns
  - Overuse of wrappers for trivial nodes.
