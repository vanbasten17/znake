## Context

This change adds a focused improvement contract for znake-refactor-launch-link-renderer-safety-v1.

## Key Points (Codex-style)

- What is changing
  - Escape text used in launch links.
- Why we are doing it
  - Avoid accidental HTML injection.
- Impacted areas
  - launch/main.ts.
- Risks / unknowns
  - Escaping may alter text output.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
