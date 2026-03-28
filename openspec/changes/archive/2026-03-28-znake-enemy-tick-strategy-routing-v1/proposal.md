## Why

Enemy ticking currently relies on a monolithic conditional chain in one file. Introducing explicit strategy routing improves extensibility for new enemy families and keeps the combat loop easier to maintain.

## Key Points (Codex-style)

- What is changing
  - Replace hardcoded special-kind branching with explicit strategy routing helpers.
  - Keep existing enemy behavior intact while improving extension seams.
- Why we are doing it
  - Reduce coupling and make adding new enemy mechanics safer.
- Impacted areas
  - `simulation/enemy.ts`.
- Risks / unknowns
  - Strategy ordering mistakes could subtly alter behavior if not validated.

## What Changes

- Add explicit special-kind strategy map.
- Keep normal chase fallback unchanged.
