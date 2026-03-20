# Marker pixel pipeline (crisp in-game + glossary + export)

This document is the **operational checklist** for procedural glossary markers: same sharp pixels as `pnpm generate:sprites`, in Phaser, and in the DOM glossary.

## Single source of truth

| File | Role |
|------|------|
| `src/game/render/markerExportSpec.ts` | **Only place** for `MARKER_EXPORT_LOGICAL_FRAME`, `MARKER_EXPORT_INNER_SIZE`, `MARKER_EXPORT_SCALE_DEFAULT`, `GLOSSARY_MARKER_DISPLAY_PX` |
| `src/game/render/markerVectorArt.ts` | **Premium art standard** (same language as the apple): glow + volumetric body + specular/shadow + vector icons — no 5×5 bitmap grid |
| `src/game/render/markerRenderer.ts` | Entry: `core` = apple; all other tones delegate to `markerVectorArt` |
| `src/game/render/markerHiRes.ts` | Builds **in-game** canvas textures (same raster as export) + `FilterMode.NEAREST` |
| `src/game/scenes/GameScene.ts` | **Hi-res marker `Image`s** for world entities (see below); `Graphics` only for glows/rings — not for the icon interior |
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

## In-game (Phaser) — same resolution as `core` and as `pnpm generate:sprites`

World pickups and objectives must use **canvas textures** registered by `registerMarkerHiResTextures(scene)` (`markerHiRes.ts`), which call `drawMarkerSpriteCanvas` at **`MARKER_EXPORT_*`** — identical pipeline to PNG export. Do **not** draw the marker *interior* with `Graphics` + `drawMarkerSpritePhaser` for these entities; that was the old low-res path.

| Step | Requirement |
|------|-------------|
| **Once per scene** | `registerMarkerHiResTextures(this)` in `GameScene.create()` (textures keyed `marker_hi_<tone>`). |
| **Rendering** | `Phaser.GameObjects.Image` per slot (or pooled): `setTexture(markerTextureKey(tone))`, `setDisplaySize` (integer), `setPosition` (integer), depth **above** underlay `Graphics`. |
| **Filter** | `canvasTexture.setFilter(Phaser.Textures.FilterMode.NEAREST)` is applied inside `registerMarkerHiResTextures`. |
| **Underlay** | Keep rings / glow / pulse on `Graphics`; the **icon** is always the `Image`. |
| **Hide** | At start of each frame, hide all marker images; show only those for active entities. |

**Entities covered (as of `GameScene`):** food (`core`), portals (`portal` / `beacon`), rift (`rift`), powerups (`shield` \| `slow` \| `ghost` \| `score` \| `venom`), biome pickups (`beacon` \| `battery` \| `biomeCore`).

**Adding a new world element with a glossary tone:** register is global (all tones pre-rasterized). Add an `Image`, wire `markerTextureKey('<tone>')`, and follow the same hide/show/position/size pattern as existing markers.

## Rules (why it looked blurry before)

1. **One spec** — Do not duplicate `20` / `18` / `8` in multiple files; import from `markerExportSpec.ts` or the aliases in `markerHiRes.ts`.
2. **Integer rasterization** — Draw in logical space, then `ctx.setTransform(scale, …)` with **integer** `scale` and `imageSmoothingEnabled = false`.
3. **Phaser WebGL** — After `textures.addCanvas`, call `texture.setFilter(Phaser.Textures.FilterMode.NEAREST)` on canvas-backed textures.
4. **No fractional display sizes** — `setDisplaySize(Math.round(...))` on marker `Image` objects; round positions to whole pixels.
5. **Glossary DOM** — Backing store = full export resolution; **CSS display** = integer px that fits the frame (`GLOSSARY_MARKER_DISPLAY_PX`); never draw the glyph at a fractional “marker size” in CSS pixels.
6. **Game scale** — Browser scales the Phaser canvas (FIT); crisp canvas + NEAREST keeps sprites sharp; sub-pixel sprite positions still hurt—use `roundPixels` / integer coords.

## Semantic colors & roles

Glyphs and fills follow **`src/game/render/markerSemantics.ts`** (`MarkerSemanticRole`):

| Role | Meaning | Typical hues |
|------|---------|----------------|
| **benefit** | Menja, powerups, portal, talents — ajuden el jugador | Cian, verd, or, rosa suau (slow/ghost), vermell poma (core) |
| **hazard** | Foscor, compressió, rift — dany o pressió | Porpra fosc, magenta rift (≠ portal cian), àmbar (squeeze) |
| **terrain** | Gel / arena — dificulten moviment | Blau fred, ocre |
| **enemy** | Enemics — amenaça | Taronja, magenta, porpra, blau hostil, or (boss) |

Icon art lives in **`markerVectorArt.ts`** (vector icons on premium tokens), invoked via `markerRenderer.ts` → `drawMarkerSpriteCanvas`.

## Related docs

- [SPRITE_GENERATION_REFERENCE.md](./SPRITE_GENERATION_REFERENCE.md) — lore, prompts, asset layout
- [`assets/sprites/generated/README.md`](../../assets/sprites/generated/README.md) — output files
- Cursor: `.cursor/skills/znake-marker-pipeline/SKILL.md` — agent workflow
