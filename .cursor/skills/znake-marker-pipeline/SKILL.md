---
name: znake-marker-pipeline
description: >-
  Procedural marker art for Znake — export PNGs, in-game Phaser hi-res Images (same as core/export),
  glossary DOM, and crisp pixels (markerExportSpec, markerHiRes, generate:sprites, validate:markers).
license: MIT
metadata:
  author: znake
  version: "1.0"
---

When the user works on **glossary markers**, **sprite export**, **markerRenderer**, **markerHiRes**, **GameScene marker Images**, or **glossary canvas** in Znake, follow this pipeline so in-game and UI stay **sharp** (pixel-aligned).

## Source of truth

- **`src/game/render/markerExportSpec.ts`** — Defines `MARKER_EXPORT_LOGICAL_FRAME`, `MARKER_EXPORT_INNER_SIZE`, `MARKER_EXPORT_SCALE_DEFAULT`, `GLOSSARY_MARKER_DISPLAY_PX`. **Change dimensions only here**, then regenerate and validate.
- **`src/game/render/markerSemantics.ts`** — `MARKER_SEMANTIC_ROLE` per tone (benefit / hazard / terrain / enemy); color language for helpful vs harmful vs hostile.
- **`src/game/render/markerVectorArt.ts`** — **Premium marker standard** (same bar as the `core` apple): outer halo, volumetric body, specular + contact shadow, per-tone vector icon art.
- **`src/game/render/markerRenderer.ts`** — Entry points `drawMarkerSpriteCanvas` / Phaser: **`core`** is the hand-drawn apple; **all other tones** delegate to **`markerVectorArt`**; re-exports **`MARKER_SEMANTIC_ROLE`**.
- **`src/game/render/markerHiRes.ts`** + **`GameScene`** — **In-game hi-res rule:** `registerMarkerHiResTextures` builds textures from `drawMarkerSpriteCanvas` (same as export). World markers use **`Image` + `markerTextureKey(tone)`** with integer position/size and depth above glow `Graphics`. Do **not** use `Graphics`-only `drawMarkerSpritePhaser` for pickup/objective interiors.

## After changing marker drawing or spec

1. Run **`pnpm generate:sprites`** — writes `assets/sprites/generated/` (`marker_<tone>.png`, `marker_atlas.png`, `manifest.json`).
2. Run **`pnpm validate:markers`** — checks `manifest.json` invariants against `markerExportSpec.ts` and prints the checklist.

## Implementation rules (do not skip)

| Area | Requirement |
|------|----------------|
| **Export** | `tools/generate-sprites.ts` imports from `markerExportSpec.ts` (no hardcoded 20/18/8). |
| **Phaser** | `registerMarkerHiResTextures` in `markerHiRes.ts`: rasterize every tone with `drawMarkerSpriteCanvas` at spec resolution; **`setFilter(Phaser.Textures.FilterMode.NEAREST)`** after `addCanvas`. |
| **GameScene** | **Hi-res `Image` markers** for food, portals, rift, powerups, biome items — `markerTextureKey` / `setTexture` each frame as needed; **`Math.round`** on `setPosition` / `setDisplaySize`; `Graphics` only for underlay glows, **not** for the icon body. |
| **Glossary** | `MenuScene` `createGlossaryMarkerCanvas`: backing store = `MARKER_EXPORT_FRAME_PX_DEFAULT`, transform = `MARKER_EXPORT_SCALE_DEFAULT`, draw center = `MARKER_EXPORT_LOGICAL_FRAME / 2`, inner = `MARKER_EXPORT_INNER_SIZE`. CSS display = `GLOSSARY_MARKER_DISPLAY_PX`. |
| **CSS** | `.glossaryMarkerCanvas` uses `image-rendering: pixelated` (and crisp-edges). |
| **Game config** | `src/game/phaser.ts`: `render.pixelArt: true`, `antialias: false`. |

## Human documentation

- Full checklist: **`docs/assets/MARKER_PIXEL_PIPELINE.md`**
- Lore / prompts: **`docs/assets/SPRITE_GENERATION_REFERENCE.md`**

## Cursor command

- **`.cursor/commands/znake-markers.md`** — Short pointer to this skill and the two pnpm commands.
