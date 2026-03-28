## Context

This change adds a focused improvement contract for znake-web-launch-aria-regions-v1.

## Key Points (Codex-style)

- What is changing
  - Add ARIA labels for launch sections.
- Why we are doing it
  - Improve screen-reader navigation.
- Impacted areas
  - launch/main.ts, launchPage.css.
- Risks / unknowns
  - Low risk semantic attr drift.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
