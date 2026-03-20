# Marker pixel pipeline (crisp in-game + glossary + export)

This document is the **operational checklist** for procedural glossary markers: same sharp pixels as `pnpm generate:sprites`, in Phaser, and in the DOM glossary.

## Single source of truth

| File | Role |
|------|------|
| `src/game/render/markerExportSpec.ts` | **Only place** for `MARKER_EXPORT_LOGICAL_FRAME`, `MARKER_EXPORT_INNER_SIZE`, `MARKER_EXPORT_SCALE_DEFAULT`, `GLOSSARY_MARKER_DISPLAY_PX` |
| `src/game/render/markerRenderer.ts` | Vector drawing (`drawMarkerSpriteCanvas` / Phaser path) |
| `src/game/render/markerHiRes.ts` | Phaser: runtime canvas textures + `FilterMode.NEAREST` |
| `src/game/scenes/GameScene.ts` | `Image` markers: `Math.round` on position and display size |
| `src/game/scenes/MenuScene.ts` | Glossary: same transform as export; display size from spec |
| `src/styles/menuOverlay.module.css` | `.glossaryMarkerCanvas { image-rendering: pixelated }` |
| `src/game/phaser.ts` | `render.pixelArt: true`, `antialias: false` |

## Commands

```bash
# Regenerate PNGs + manifest after changing the renderer or spec
pnpm generate:sprites

# Verify manifest matches spec and print checklist
pnpm validate:markers
```

Optional lower-res PNGs only (previews): `SPRITE_EXPORT_SCALE=4 pnpm generate:sprites` — **warning:** default in-game textures still use `MARKER_EXPORT_SCALE_DEFAULT` from `markerExportSpec.ts`; PNGs will not match pixel size until you use the default scale again.

## Rules (why it looked blurry before)

1. **One spec** — Do not duplicate `20` / `18` / `8` in multiple files; import from `markerExportSpec.ts` or the aliases in `markerHiRes.ts`.
2. **Integer rasterization** — Draw in logical space, then `ctx.setTransform(scale, …)` with **integer** `scale` and `imageSmoothingEnabled = false`.
3. **Phaser WebGL** — After `textures.addCanvas`, call `texture.setFilter(Phaser.Textures.FilterMode.NEAREST)` on canvas-backed textures.
4. **No fractional display sizes** — `setDisplaySize(Math.round(...))` on marker `Image` objects; round positions to whole pixels.
5. **Glossary DOM** — Backing store = full export resolution; **CSS display** = integer px that fits the frame (`GLOSSARY_MARKER_DISPLAY_PX`); never draw the glyph at a fractional “marker size” in CSS pixels.
6. **Game scale** — Browser scales the Phaser canvas (FIT); crisp canvas + NEAREST keeps sprites sharp; sub-pixel sprite positions still hurt—use `roundPixels` / integer coords.

## Related docs

- [SPRITE_GENERATION_REFERENCE.md](./SPRITE_GENERATION_REFERENCE.md) — lore, prompts, asset layout
- `assets/sprites/generated/README.md` — output files
- Cursor: `.cursor/skills/znake-marker-pipeline/SKILL.md` — agent workflow
