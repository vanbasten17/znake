## Why

Accessibility controls currently expose voice toggles but visual preset controls remain effectively hidden. Expanding presets and visual toggles improves usability for players needing readability/comfort adjustments.

## Key Points (Codex-style)

- What is changing
  - Enable visual accessibility controls in menu.
  - Add deterministic preset cycling (`default`, `clarity`, `comfort`) plus `custom` detection.
  - Expose high-contrast, large-text, and reduced-effects toggles.
- Why we are doing it
  - Improve readability, comfort, and visibility options with minimal interaction cost.
- Impacted areas
  - Accessibility system preset logic, menu accessibility rows, localization keys.
- Risks / unknowns
  - Preset labels and toggles must remain concise on small screens.

## What Changes

- Add preset mapping and cycle helper in accessibility system.
- Derive active preset id from current visual settings (`custom` when mixed).
- Add menu row for preset cycling and visual toggle rows.
- Keep persistence in existing accessibility storage path.

## Capabilities

### Modified Capabilities

- `scenes`: Menu accessibility section supports visual presets and explicit visual toggles.
- `ui-foundation`: Accessibility states map to body classes for high-contrast/large-text/reduced-effects.

## Impact

- Affected code:
  - `src/game/systems/accessibility.ts`
  - `src/game/scenes/MenuScene.ts`
  - `src/game/systems/i18n.ts`
- No dependency changes.
