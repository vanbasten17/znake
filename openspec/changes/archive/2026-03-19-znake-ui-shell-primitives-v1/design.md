## Design Summary

Create a reusable shell layer with two core modes:

- `menu`: portrait split shell with hidden HUD row footprint preserved
- `run`: portrait split shell for gameplay/selection overlays

Both use common sizing primitives and can be tuned through CSS custom properties.

## Technical Design

- Add `src/styles/shell.css` for shell-level layout and mode selectors.
- Extend HUD/system API with:
  - `setUiShell(mode)`
  - `setUiShellSplit(contentFr, controlsFr)`
  - `resetUiShellSplit()`
- Keep `setSceneChrome(mode)` as compatibility wrapper.

## Compatibility

- Existing scene calls remain valid.
- Visual behavior should remain equivalent to current baseline.
