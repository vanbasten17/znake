## Context

This change adds a focused improvement contract for znake-tooling-loop-telemetry-schema-v1.

## Key Points (Codex-style)

- What is changing
  - Codify telemetry fields.
- Why we are doing it
  - Improves run diagnostics.
- Impacted areas
  - autoloop workflows.
- Risks / unknowns
  - Schema drift.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
