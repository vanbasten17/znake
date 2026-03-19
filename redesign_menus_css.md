# Redesign Menus with CSS (DOM-first)

## Goal

Migrate non-gameplay UI to DOM + CSS Modules + design tokens, while keeping gameplay fully in Phaser canvas.

## Scope Split

- Keep in Phaser canvas:
  - Snake gameplay loop
  - Enemies, collisions, pickups, VFX, camera shake
  - In-run rendering and movement systems
- Migrate to DOM/CSS:
  - Main Menu
  - Relic Selection
  - Upgrade Selection
  - Death / End Run
  - Meta shop/goals panels

## Why this architecture

- Faster visual iteration and easier 1:1 alignment with Stitch
- Better maintainability for non-gameplay layouts
- Cleaner separation between gameplay systems and product UI
- Lower risk of layout overlap bugs in menu screens

## Execution Plan (OpenSpec, one step at a time)

1. Define design tokens foundation
- Create token set for colors, typography, spacing, radius, glow, borders, z-index, motion.
- Store as shared CSS variables with clear naming convention.

2. Create UI shell primitives
- Build reusable DOM shell for portrait/mobile-first layouts.
- Keep current 2/3 content + 1/3 controls contract where applicable.

3. Vertical slice migration (single screen)
- Migrate one screen first (recommended: Relic Selection).
- Validate behavior parity, responsiveness, and i18n.

4. Migrate remaining menu screens incrementally
- Move Main Menu, Upgrade, Death, and meta panels one by one.
- Reuse shared components/tokens to avoid style drift.

5. Integration hardening
- Ensure transitions between DOM menus and Phaser gameplay are stable.
- Confirm no layout jumps, input conflicts, or focus/accessibility regressions.

6. Final polish and cleanup
- Remove obsolete scene-specific drawing code for migrated menus.
- Keep gameplay-only canvas code isolated and documented.

## Working rules

- Always use OpenSpec loop per step: propose -> apply -> test -> iterate -> archive.
- Avoid big-bang migration; each step must remain shippable.
- Prioritize behavior parity before visual embellishments.
