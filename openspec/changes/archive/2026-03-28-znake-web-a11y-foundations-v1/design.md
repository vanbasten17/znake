## Context

This change applies documented web accessibility guidance to Znake's UI and route-choice readability.

## Key Points (Codex-style)

- What is changing
  - Accessibility-aware runtime + CSS and risk cue text enrichment.
- Why we are doing it
  - Better comfort and faster comprehension.
- Impacted areas
  - `accessibility.ts`, UI styles, route risk formatting.
- Risks / unknowns
  - Extra cue tokens may be verbose.

## Decisions

- Prefer additive cues over replacing existing text.
- Keep deterministic gameplay unchanged.
