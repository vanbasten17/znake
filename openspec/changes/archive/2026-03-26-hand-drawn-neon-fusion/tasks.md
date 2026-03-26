## 1. Hand-Drawn Rendering Logic

- [x] 1.1 In `markerVectorArt.ts`, create a `drawJitteredRoundedRect` utility that draws multiple line segments per side with small, random offsets.
- [x] 1.2 In `markerVectorArt.ts`, create a `drawHatchPattern` utility that draws diagonal parallel lines inside a given rectangle.
- [x] 1.3 Refactor `drawPremiumSegmentPhaser` to replace clean rounded-rects with jittered versions and add hatching to the core.
- [x] 1.4 Refactor `drawPremiumSegmentCanvas` to apply the same hand-drawn style to hi-res markers and food tokens.

## 2. Cell-Shaded FX Pipeline

- [x] 2.1 Update `POST_FX_FRAG` in `shaders.ts` to include a `quantize` function for the bloom luminance pass (posterization).
- [x] 2.2 Implement a simple "Sobel-like" edge detection step in the fragment shader for high-contrast "ink" outlines.
- [x] 2.3 Expose new uniforms (`uSteps`, `uInkThickness`) in the `ArcadeEffectsPipeline` class.

## 3. Artistic Polish

- [x] 3.1 Link the `jitter` factor in `GameScene.ts` to the snake's velocity and camera shake for dynamic feedback.
- [x] 3.2 Implement "Sketchy" versions of the Portal and Rift markers using procedurally wobbly lines.
- [x] 3.3 Add "Ink-Splat" particles (dark, high-velocity bits) that trigger alongside neon sparks on collisions.
