## Why

Current gameplay readability can still improve (especially under pressure on mobile): some entities are visually close in size/value and can be misread.

Before adding more mechanics, we should improve visual differentiation for snake, obstacles, pickups, and hazards.

## Technical Note (DOM vs Canvas)

Using Phaser DOM Elements for moving snake segments and obstacles is technically possible, but not recommended for this game loop:

- high update frequency with many nodes,
- layout/reflow cost on mobile,
- weaker visual-sync guarantees with gameplay collision grid.

For gameplay entities, we should keep Phaser canvas rendering and move toward clearer sprite/material signatures (still driven by design tokens).

## What Changes

- Introduce a readability pass for core gameplay entities:
  - snake head/body hierarchy,
  - walls/obstacles silhouette clarity,
  - pickups (food/powerups/biome item) unique shape cues,
  - hazard/portal visual distinction.
- Add configurable readability profile values in balance/config where useful.
- Keep mechanics unchanged; visual-only iteration.

## Capabilities

### Modified Capabilities

- `gameplay`: stronger per-entity visual readability under movement pressure.
- `ui-foundation`: tokenized colors/contrast used consistently by gameplay visuals.

## Impact

- Affected code (planned):
  - `src/game/scenes/GameScene.ts`
  - `src/game/core/constants.ts`
  - `src/game/core/balance.ts` (if readability knobs are added)
  - `src/styles/tokens.css` (token refinements only)
