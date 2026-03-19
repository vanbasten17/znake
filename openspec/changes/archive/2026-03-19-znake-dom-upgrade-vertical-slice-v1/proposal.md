## Why

After successful DOM migration of `RelicDraft`, `Upgrade` is the next high-impact menu-like scene to migrate.

It shares the same interaction pattern (three cards, keyboard shortcuts, scene transition), making it a low-risk next slice.

## What Changes

- Migrate `UpgradeScene` visual content from Phaser graphics/text to DOM overlay.
- Style with CSS Module backed by shared design tokens.
- Preserve behavior parity:
  - same random 3 upgrades
  - same pointer and keyboard (1-3) selection
  - same telemetry and transition to `Game`

## Scope

- In scope: Upgrade scene UI migration only.
- Out of scope: Main Menu and Death scene migrations.

## Impacted Specs

- `scenes`
- `ui-foundation`
