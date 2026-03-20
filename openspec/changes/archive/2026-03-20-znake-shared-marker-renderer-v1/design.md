## Design

### Shared renderer module

Create `src/game/render/markerRenderer.ts` with:

- `drawMarkerSpriteCanvas(ctx, tone, cx, cy, size)` for DOM/canvas usage.
- `drawMarkerSpritePhaser(graphics, tone, cx, cy, size, alpha?)` for Phaser graphics usage.

Both functions use the same tone-to-shape/glyph mapping.

### Scene integration

- `MenuScene` glossary markers call `drawMarkerSpriteCanvas`.
- `GameScene` icon interiors for food, portals/rift, powerups, and biome items call `drawMarkerSpritePhaser` to reuse the same marker primitives while preserving existing glow/animation layers.

### Non-goals

- No gameplay balance changes.
- No full migration of every enemy/talent body render to marker renderer.
- No PNG asset pipeline changes in this step.
