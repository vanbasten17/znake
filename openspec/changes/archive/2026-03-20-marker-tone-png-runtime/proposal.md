## Why

Artists and designers need to **swap any glossary marker** (`marker_<tone>.png`) and see the same icon in the **menu guide** and **in-game** without editing TypeScript. Previously only procedural canvas output was guaranteed at runtime; replacing PNGs under `assets/sprites/generated/` did not affect the live game for most tones, and Node tooling could not safely import Vite asset URLs.

## What Changes

- **Runtime:** Load every `assets/sprites/generated/marker_<tone>.png` (per `GLOSSARY_MARKER_TONES`) before registering hi-res Phaser textures and before drawing glossary canvases; **if** a PNG loads, rasterize it into the marker frame; **else** fall back to `drawMarkerSpriteProcedural`.
- **Separation of concerns:** `markerRenderer.ts` exports **procedural-only** drawing (safe for `pnpm generate:sprites` in Node); `markerBitmaps.ts` + `markerBitmapDraw.ts` handle browser URL loading and the wrapper.
- **Export:** `pnpm generate:sprites` — for each tone, if `marker_<tone>.png` **already exists**, re-rasterize from that file so hand edits are preserved; otherwise generate from procedural art.
- **Scene safety:** `GameScene` gates `update` until async `create()` finishes (avoids undefined marker `Image` objects when textures are still loading).
- **Docs:** `MANUAL_MARKER_PNG_REPLACEMENT.md` and `MARKER_PIXEL_PIPELINE.md` updated to describe all tones.

## Capabilities

### New Capabilities

- `marker-pipeline`: File naming, loading order, fallback to procedural, export preserve-if-exists, and relationship to `markerExportSpec` dimensions.

### Modified Capabilities

- `scenes`: Clarify that guide and gameplay marker visuals share the same pipeline **including** optional per-tone PNG substitution when files load successfully.

## Impact

- **Code:** `src/game/render/markerBitmaps.ts`, `markerBitmapDraw.ts`, `markerRenderer.ts` (`drawMarkerSpriteProcedural`), `markerHiRes.ts`, `MenuScene.ts`, `GameScene.ts`, `tools/generate-sprites.ts`.
- **Removed:** `markerCoreBitmap.ts` (superseded by `markerBitmaps.ts`).
- **Assets:** Same paths (`assets/sprites/generated/marker_<tone>.png`); bundler includes PNGs via `import.meta.glob`.
- **Tooling:** `pnpm generate:sprites` behavior when PNGs already exist (preserve per tone).
