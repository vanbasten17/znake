## Why

The current graphics of `znake` are functional but lack the "premium" feel expected of a modern arcade game. The visual language is somewhat inconsistent between the procedural markers and the player/enemy assets. Introducing a unified, high-fidelity neon aesthetic will improve player immersion and professionalize the game's overall presentation.

## What Changes

- **Core Rendering Architecture**: Integration of a post-processing pipeline for bloom, scanlines, and CRT effects.
- **Visual Assets**: Upgrading the snake, enemies, and interactive tokens to a "Squared Neon" style with internal glowing details.
- **Background & HUD**: Implementing a dynamic, pulsing grid and refined retro-futuristic HUD styling.
- **Particle System**: Transitioning from blocky squares to high-velocity "photon shard" particles.

## Capabilities

### New Capabilities
- `post-process-fx`: A shader-driven pipeline for bloom, scanlines, and CRT curvature.
- `premium-neon-visuals`: A unified set of procedural drawing routines for "Circuit-Core" snake segments, enemies, and tokens.
- `dynamic-grid-background`: An interactive, parallax background system that reacts to game events.

### Modified Capabilities
- None.

## Impact

- **`src/game/scenes/GameScene.ts`**: Significant updates to drawing methods and the update loop for effect handling.
- **`src/game/render/`**: New shaders and updated procedural rendering logic.
- **Performance**: Addition of a post-processing pass may have a minor impact on low-end devices; must be toggleable via accessibility settings (already handled by `isReducedEffectsEnabled`).
