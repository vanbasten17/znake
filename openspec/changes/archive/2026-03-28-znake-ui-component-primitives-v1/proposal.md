## Why

UI composition in scenes repeats low-level DOM assembly. Reusable UI primitives improve SOLID boundaries and reuse speed.

## Key Points (Codex-style)

- What is changing
  - Add isolated reusable UI components for action buttons, panel sections, and status chips.
- Why we are doing it
  - Reduce duplication and make in-game UI components easier to move/reuse.
- Impacted areas
  - `MenuScene`, `overlayController`, new `src/game/ui/components/*`.
- Risks / unknowns
  - Component APIs must stay small to avoid over-abstraction.
