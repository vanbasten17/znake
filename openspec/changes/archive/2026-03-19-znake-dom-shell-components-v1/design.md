## Context

The current app still boots from a large static HTML shell (`#hud`, `#game-area`, `#controls`, `#hint-bar`) while scene overlays are already migrated to DOM/CSS modules.

This creates a split source of truth:

- static shell contract in `index.html`
- runtime behavior in TypeScript systems (`input`, `domHud`, `i18n`, scene overlays)

The goal is to keep the same shell contract but move structure ownership to TypeScript runtime setup.

## Goals / Non-Goals

**Goals:**

- Mount the full shell DOM structure programmatically at boot.
- Preserve existing selectors/IDs to avoid broad CSS and gameplay regressions.
- Ensure boot ordering so i18n + input bindings always find expected elements.
- Remove import-time fragility in HUD helpers.

**Non-Goals:**

- Redesign of controls or HUD visuals.
- Gameplay scene mechanic changes.
- Migrating gameplay canvas rendering into DOM.

## Decisions

1. Introduce a single runtime shell mount function.
- Add a dedicated `src/ui/mountShell.ts` module.
- It creates the exact shell DOM contract currently expected by styles and systems.

Alternatives considered:
- Keep static HTML forever: lower immediate effort, but slows future iteration and increases duplication.
- Build shell per scene: too fragmented for shared controls/HUD contract.

2. Keep existing IDs/classes as the compatibility layer.
- Preserve `#hud`, `#game-area`, `#phaser-container`, `#controls`, `#hint-bar`, button IDs, and stat IDs.

Alternatives considered:
- Rename to a new contract: cleaner long-term, but causes unnecessary migration risk now.

3. Make `domHud` lazy-resolve required elements.
- Replace import-time `byId(...)` calls with cached runtime resolution.
- This prevents crashes if a consumer imports `domHud` before shell mount.

Alternatives considered:
- Rely only on main boot order: works now, but fragile for future imports/tests.

## Risks / Trade-offs

- [Risk] Runtime shell accidentally diverges from previous static markup.
  - Mitigation: reuse the same IDs/classes and minimal structural changes.
- [Risk] Input or i18n bindings execute before mount.
  - Mitigation: call `mountShell()` first in `main.ts` before setup/init.
- [Risk] Hidden dependency from other modules on static HTML timing.
  - Mitigation: lazy node resolution in `domHud`.
