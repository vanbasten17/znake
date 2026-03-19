## Why

Death summary is a high-visibility post-run screen and still uses canvas-rendered UI.

Migrating it to DOM/CSS completes another major non-gameplay flow and improves readability/iteration speed.

## What Changes

- Migrate `DeathScene` composition from Phaser graphics/text to DOM overlay.
- Keep behavior parity for:
  - rewards summary
  - upgrades earned list
  - next run / main menu actions
  - keyboard shortcuts and touch start behavior
- Style with scene-scoped CSS Module powered by shared tokens.

## Scope

- In scope: Death scene UI migration only.
- Out of scope: reward formulas or gameplay logic changes.

## Impacted Specs

- `scenes`
- `ui-foundation`
