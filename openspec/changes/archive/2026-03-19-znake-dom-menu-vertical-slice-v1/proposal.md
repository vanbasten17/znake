## Why

Main Menu is the highest-frequency non-gameplay screen and currently the largest visual iteration bottleneck in canvas form.

Migrating it to DOM/CSS is the next logical step after Relic and Upgrade slices.

## What Changes

- Migrate `MenuScene` composition from Phaser graphics/text to DOM overlay.
- Keep behavior parity for:
  - start flow
  - talent unlock flow
  - goal claim flow
  - language toggle
  - keyboard shortcuts
- Style with a scene-scoped CSS Module backed by shared tokens.

## Scope

- In scope: Main Menu UI migration.
- Out of scope: gameplay mechanics and run-state rules.

## Impacted Specs

- `scenes`
- `ui-foundation`
