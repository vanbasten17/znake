---
name: znake-marker-pipeline
description: >-
  Procedural marker art for Znake — export PNGs, Phaser hi-res textures, glossary DOM, and crisp pixels
  (markerExportSpec, generate:sprites, validate:markers, NEAREST filter, integer display sizes).
license: MIT
metadata:
  author: znake
  version: "1.0"
---

When the user works on **glossary markers**, **sprite export**, **markerRenderer**, **markerHiRes**, **GameScene marker Images**, or **glossary canvas** in Znake, follow this pipeline so in-game and UI match **sharp pixel** output.

## Source of truth

- **`src/game/render/markerExportSpec.ts`** — Defines `MARKER_EXPORT_LOGICAL_FRAME`, `MARKER_EXPORT_INNER_SIZE`, `MARKER_EXPORT_SCALE_DEFAULT`, `GLOSSARY_MARKER_DISPLAY_PX`. **Change dimensions only here**, then regenerate and validate.

## After changing marker drawing or spec

1. Run **`pnpm generate:sprites`** — writes `assets/sprites/generated/` (`marker_<tone>.png`, `marker_atlas.png`, `manifest.json`).
2. Run **`pnpm validate:markers`** — checks `manifest.json` invariants vs `markerExportSpec.ts` and prints the checklist.

## Implementation rules (do not skip)

| Area | Requirement |
|------|----------------|
| **Export** | `tools/generate-sprites.ts` uses imports from `markerExportSpec.ts` (not hardcoded 20/18/8). |
| **Phaser** | `registerMarkerHiResTextures` in `markerHiRes.ts`: same logical/inner/scale as spec; **`setFilter(Phaser.Textures.FilterMode.NEAREST)`** after `addCanvas`. |
| **GameScene** | Marker `Image`s: **`Math.round`** on `setPosition` / `setDisplaySize` (avoid fractional sizes from pulse). |
| **Glossary** | `MenuScene` `createGlossaryMarkerCanvas`: backing store = `MARKER_EXPORT_FRAME_PX_DEFAULT`, transform = `MARKER_EXPORT_SCALE_DEFAULT`, draw center = `MARKER_EXPORT_LOGICAL_FRAME / 2`, inner = `MARKER_EXPORT_INNER_SIZE`. CSS display = `GLOSSARY_MARKER_DISPLAY_PX`. |
| **CSS** | `.glossaryMarkerCanvas` uses `image-rendering: pixelated` (and crisp-edges). |
| **Game config** | `src/game/phaser.ts`: `render.pixelArt: true`, `antialias: false`. |

## Human documentation

- Full checklist: **`docs/MARKER_PIXEL_PIPELINE.md`**
- Lore / prompts: **`docs/SPRITE_GENERATION_REFERENCE.md`**

## Cursor command

- **`.cursor/commands/znake-markers.md`** — short pointer to this skill and the two pnpm commands.
