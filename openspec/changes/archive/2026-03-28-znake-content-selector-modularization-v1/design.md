## Context

Refactor is purely structural: isolate selector internals with stable interfaces.

## Key Points (Codex-style)

- What is changing
  - Extract powerup/special chance selector helper module.
- Why we are doing it
  - Improve replication and maintenance speed.
- Impacted areas
  - config selector logic and unit tests.
- Risks / unknowns
  - Behavior drift if helper semantics change.
