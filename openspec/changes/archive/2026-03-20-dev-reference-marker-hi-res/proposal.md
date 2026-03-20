## Why

The **dev reference board** (debug scenario `referenceBoard`) is meant to preview glossary marker sprites **as they appear in-game**. It still drew icons with `drawMarkerSpritePhaser`, which is **procedural-only** and ignores hand-authored `marker_<tone>.png` and the shared hi-res canvas textures. That diverged from the guide and live gameplay after the marker-pipeline work.

## What Changes

- **GameScene:** Replace `Graphics` + `drawMarkerSpritePhaser` for the reference marker grid with **`Phaser.Image`** objects using `markerTextureKey(tone)` (same source as world pickups / glossary raster path).
- **Lifecycle:** Create images when the reference board is set up; hide them each frame unless reference mode is active; destroy on `resetLocalState` / teardown.

## Capabilities

### New Capabilities

- _(none — behavior is a refinement of existing marker rendering)_

### Modified Capabilities

- `scenes`: Dev reference board SHALL show marker icons at the same hi-res texture quality as gameplay (bitmap when loaded).

## Impact

- **Code:** `src/game/scenes/GameScene.ts` only (remove `drawMarkerSpritePhaser` usage for reference grid).
- **Docs:** Optional one-line in `MARKER_PIXEL_PIPELINE.md` (dev reference uses `Image` + `markerTextureKey`).
