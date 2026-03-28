## Context

This change adds a focused improvement contract for znake-ui-panel-section-content-slot-v1.

## Key Points (Codex-style)

- What is changing
  - Allow content class injection in panel primitive.
- Why we are doing it
  - Improve composition reuse.
- Impacted areas
  - PanelSection.ts, overlayController.ts.
- Risks / unknowns
  - ClassName misuse.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
