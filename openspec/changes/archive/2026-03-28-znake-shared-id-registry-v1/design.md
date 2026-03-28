## Context

This change adds a thin shared identifier registry to reduce magic strings without overengineering.

## Key Points (Codex-style)

- What is changing
  - Add reusable ID arrays and derived union types in a shared module.
  - Reuse these constants in tactical hot paths (`config/content`, `simulation/enemy`).
- Why we are doing it
  - Enable safer refactors and clearer extension points.
- Impacted areas
  - Shared typing and selected simulation/config modules.
- Risks / unknowns
  - If scope grows too large, migration churn could slow iteration.

## Decisions

- Start with high-traffic IDs (direction, enemy kind, powerup type).
- Keep migration incremental and backward-compatible.
- Avoid broad rewrites in one pass.
