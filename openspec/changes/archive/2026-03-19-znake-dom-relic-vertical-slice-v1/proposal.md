## Why

We need a practical first migration step from canvas-rendered menus to DOM/CSS-driven UI.

`RelicDraft` is a good vertical slice because it is self-contained, interaction-heavy, and appears before gameplay.

## What Changes

- Migrate `RelicDraft` content rendering from Phaser graphics/text to DOM overlay.
- Style the overlay with CSS Modules using shared tokens.
- Preserve behavior parity:
  - same 3 choices
  - same pointer and keyboard (1-3) selection
  - same telemetry and scene transition to `Game`

## Scope

- In scope: RelicDraft visual/content migration to DOM.
- Out of scope: Main Menu, Upgrade, Death DOM migration.

## Impacted Specs

- `scenes`
- `ui-foundation`
