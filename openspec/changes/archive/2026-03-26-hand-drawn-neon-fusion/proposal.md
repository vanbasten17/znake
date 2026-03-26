## Why

The current visual style is "Premium Neon," which looks professional but can feel a bit sterile or "too perfect." By mixing in **Hand-Drawn / Cell-Shading** aesthetics, we create a "Neon Sketchbook" fusion that feels organic, artistic, and distinct. It adds character to the snake and enemies, making them feel like they were sketched with a luminescent marker on a cosmic void.

## What Changes

We will modify the procedural drawing logic in `markerVectorArt.ts` to introduce line jitter, wobbly paths, and cross-hatch shading. The `ArcadeEffectsPipeline` will be updated to include a "Posterization" pass that quantizes the neon glow into distinct bands, reinforcing the cell-shaded look.

## Capabilities

### New Capabilities
- `hand-drawn-aesthetics`: Procedural "jitter" logic for all line drawing to simulate a shaky hand.
- `hatch-shading`: Implementation of diagonal cross-hatching to replace smooth gradients in segment cores.
- `cell-shaded-fx`: Update to the PostFX pipeline to add color quantization and thick ink outlines.

## Impact

- `src/game/render/markerVectorArt.ts`: Major updates to `drawPremiumSegment` and tile rendering.
- `src/game/render/shaders.ts`: Update to `POST_FX_FRAG` for posterization.
- `src/game/scenes/GameScene.ts`: Minor logic for "Sketch" particles.
