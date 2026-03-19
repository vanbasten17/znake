## Why

DOM menu screens are already structurally solid, but readability can still degrade on some devices due to tight typography, low-contrast secondary copy, and inconsistent line-height density.

A focused readability polish increases perceived quality and reduces cognitive load without changing behavior.

## What Changes

- Tune shared UI tokens for clearer text hierarchy and consistent readability colors.
- Improve typography spacing, contrast, and line-height in menu/relic/upgrade/death overlays.
- Keep existing layout structure and interaction behavior unchanged.

## Capabilities

### New Capabilities

- `dom-readability-polish`: Readability-focused typography and contrast polish across DOM overlays.

### Modified Capabilities

- `ui-foundation`: Shared tokens and shell typography defaults are refined for better legibility.
- `scenes`: DOM overlay compositions maintain behavior while improving text clarity and hierarchy.

## Impact

- Affected code:
  - `src/styles/tokens.css`
  - `src/styles/app.css`
  - `src/styles/menuOverlay.module.css`
  - `src/styles/relicDraftOverlay.module.css`
  - `src/styles/upgradeOverlay.module.css`
  - `src/styles/deathOverlay.module.css`
- No gameplay logic changes.
- No new dependencies.
