# Change: znake-neon-marker-consistency-v1

## Summary

Normalize Neon marker proposal sprites so they use a consistent visual footprint (maximizing readable area within 40x40 cells) and allow batch in-game preview through a query-param override.

## Why

- Previous Neon proposals had uneven scale and perceived weight between tones.
- Small centered glyphs reduced readability on mobile screens.
- Development iteration needs a low-friction way to preview all proposal sprites in-game without replacing production marker assets.

## Scope

- Rework `marker_*_neon.svg` files to enforce a consistent maximum footprint and balanced padding.
- Regenerate proposal PNG outputs from the updated SVG set.
- Add optional runtime override (`neonPreview=1`) to load proposal PNGs in batch for glossary/game marker rendering.

## Out of Scope

- Promoting proposal assets to production marker set by default.
- Gameplay behavior changes.

## Impacted Areas

- `assets/sprites/source/marker_neon_proposals/*`
- `src/game/render/markerBitmaps.ts`
- `marker-pipeline` spec (preview override behavior)
