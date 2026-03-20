# Generated marker sprites

PNG exports of the **current procedural** marker art (`src/game/render/markerRenderer.ts`). Dimensions come from **`src/game/render/markerExportSpec.ts`** (same as Phaser `markerHiRes` and glossary). Operational checklist: [docs/assets/MARKER_PIXEL_PIPELINE.md](../../../docs/assets/MARKER_PIXEL_PIPELINE.md); **scaling / FPS / render perf:** [docs/assets/GAME_RENDER_SCALING_AND_PERFORMANCE.md](../../../docs/assets/GAME_RENDER_SCALING_AND_PERFORMANCE.md); lore/prompts: [docs/assets/SPRITE_GENERATION_REFERENCE.md](../../../docs/assets/SPRITE_GENERATION_REFERENCE.md).

- **Per-tone files:** `marker_<tone>.png`
- **Atlas:** `marker_atlas.png` — horizontal strip, one frame per tone (left-to-right order in `manifest.json`)
- **Manifest:** `manifest.json` — `logicalFrame` (20), `exportScale`, output `frameWidth` / `frameHeight`

Default export uses **16×** integer scale → **320×320 px** per frame (logical game art is still 20×20 units; **`core`** = apple, **`biomeCore`** = cyan + diamond glyph).

Regenerate after changing the shared renderer or `markerExportSpec.ts`:

```bash
pnpm generate:sprites
pnpm validate:markers
```

Lower resolution (e.g. 80×80 per frame at 4×):

```bash
SPRITE_EXPORT_SCALE=4 pnpm generate:sprites
```

These assets are for reference, previews, and future migration to authored sprite sheets; the game still draws markers procedurally at runtime.
