## Why

We now have a concrete visual reference for the menu and can implement a faithful polish pass before extending the same language to relic and gameplay screens.

## What Changes

- Restyle `MenuScene` to match the provided screenshot:
  - Neon pixel-like `ZNAKE` hero with strong glow.
  - Compact top stat strip (`BEST SCORE`, `CURRENCY`) with icon-like prefixes.
  - Centered `TALENT SHOP` heading with stronger hierarchy.
  - High-contrast framed list rows with dual-outline neon treatment.
  - Goal section with compact centered text and highlighted numeric progress.
  - Large bottom CTA `START > RELIC DRAFT` in a bright framed button.
  - Dark blue sci-fi grid background with subtle atmospheric glow.
- Preserve existing behavior and data flow (talent unlock, goals, language toggle, start run).

## Scope

- In scope: visual redesign of main menu scene only.
- Out of scope: relic screen, gameplay screen, economy/rules logic.

## Impacted Specs

- `scenes`: menu presentation requirement updated to a reference-driven polished visual style.
