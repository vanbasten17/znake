## Why

With full-height mobile gameplay, absolute tap targeting can feel inconsistent for side turns.

Absolute swipe direction (`left`/`right`/`up`/`down`) matches player intent and avoids directional ambiguity on tall screens.

## What Changes

- Replace touch tap targeting with relative swipe turning.
- Capture swipe intent from gameplay area:
  - horizontal => absolute direction (`left` / `right`)
  - vertical => absolute direction (`up` / `down`)
- In GameScene, convert relative turn into next cardinal direction from current heading.
- Ignore short swipes.
- Keep reverse-direction protection and keyboard controls unchanged.

## Capabilities

### Modified Capabilities

- `input-hud`: touch movement is now relative-swipe turning.
- `gameplay`: GameScene consumes relative turn input and converts it into queued cardinal movement.

## Impact

- Affected code:
  - `src/game/core/types.ts`
  - `src/game/systems/input.ts`
  - `src/game/scenes/GameScene.ts`
  - `src/game/systems/i18n.ts`
- No new dependencies.
