## 1. Shader Pipeline (Post-Processing)

- [x] 1.1 Create `src/game/render/shaders.ts` with Bloom and CRT fragment shader strings.
- [x] 1.2 Implement the `ArcadeEffectsPipeline` (extending `Phaser.Renderer.WebGL.Pipelines.PostFXPipeline`).
- [x] 1.3 Register the pipeline in the main game configuration and enable it in `GameScene.ts`.

## 2. Premium Squared Rendering

- [x] 2.1 Refactor `markerVectorArt.ts` to include a `drawPremiumSegment` utility (rounded-rects, internal glows, and rims).
- [x] 2.2 Update snake rendering in `GameScene.ts` (head and body) to use the new "Premium Squared" utility.
- [x] 2.3 Update enemy rendering (boss, stalker, etc.) to use the "Premium Squared" utility for body segments.
- [x] 2.4 Refine "Icon Printing" logic for interactive tokens (portals, powerups) to ensure they feel like physical neon objects.

## 3. Dynamic Environment

- [x] 3.1 Update `drawBackground` to implement a two-layer parallax grid system.
- [x] 3.2 Implement a time-based "Pulse/Ripple" effect for grid intersections.
- [x] 3.3 Replace static background circles with animated, soft-glowing "Nebula" gradients.

## 4. Particles & Polish

- [x] 4.1 Refactor `spawnParticles` to support "Photon Shard" particles with additive blending and varying lifetimes.
- [x] 4.2 Implement "Turn Spark" logic that triggers a small burst when the player changes direction.
- [x] 4.3 Add a subtle "Trail" effect for the snake's tail segments using fading alpha squares.
