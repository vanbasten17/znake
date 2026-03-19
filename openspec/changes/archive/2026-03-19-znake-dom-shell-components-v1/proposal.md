## Why

Our non-gameplay shell (HUD, gameplay container, controls, hint bar) still depends on static HTML in `index.html`, which slows iteration and creates coupling between document markup and scene/UI systems.

Moving shell composition into a runtime DOM builder gives us one reusable entrypoint for layout structure and makes future menu/shell work safer without touching gameplay logic.

## What Changes

- Add a runtime shell builder that mounts HUD, game area, controls, and hint bar DOM nodes at boot.
- Keep existing IDs/class hooks so input, i18n, HUD updates, and styles behave exactly as before.
- Make HUD DOM references resilient to runtime mounting order (no import-time hard dependency on pre-existing static markup).
- Reduce `index.html` to a minimal boot container + module script.

## Capabilities

### New Capabilities

- `ui-shell-runtime`: Runtime creation of the shared shell DOM contract used by non-gameplay UI and gameplay wrappers.

### Modified Capabilities

- `ui-foundation`: Shell primitives now include runtime mounting behavior in addition to CSS/token primitives.
- `input-hud`: Input/HUD systems require stable runtime shell IDs prior to binding and localization updates.

## Impact

- Affected code:
  - `index.html`
  - `src/main.ts`
  - `src/game/systems/domHud.ts`
  - `src/game/systems/input.ts` (indirectly through runtime-mounted IDs)
  - new runtime shell module under `src/ui/`
- No gameplay-mechanics changes.
- No new runtime dependencies.
