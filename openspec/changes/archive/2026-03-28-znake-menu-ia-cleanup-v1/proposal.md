## Why

Menu content currently mixes start controls, build planning, and learning/history surfaces in a single undifferentiated flow. Grouping these areas improves scanability and reduces decision friction.

## Key Points (Codex-style)

- What is changing
  - Add explicit section labels for run start, history/learning, and build planning.
  - Move start controls into a dedicated play section with standard/daily/weekly actions.
- Why we are doing it
  - Improve menu information architecture and intent clarity.
- Impacted areas
  - Menu scene DOM structure, menu localization keys, menu overlay styles.
- Risks / unknowns
  - Layout density may increase on small screens if button rows are not balanced.

## What Changes

- Add labeled `START RUN`, `HISTORY / LEARNING`, and `BUILD PLANNING` sections.
- Co-locate objective preview with run-start action group.
- Add daily/weekly start buttons to make challenge presets discoverable.
- Keep all behavior deterministic and existing start handlers unchanged.

## Capabilities

### Modified Capabilities

- `scenes`: Menu IA separates run start, planning, and learning surfaces.
- `ui-foundation`: Menu grouping uses explicit section labels and bounded action clusters.

## Impact

- Affected code:
  - `src/game/scenes/MenuScene.ts`
  - `src/game/systems/i18n.ts`
  - `src/styles/menuOverlay.module.css`
- No dependency changes.
