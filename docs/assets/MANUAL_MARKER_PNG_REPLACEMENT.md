# Manual marker PNG replacement (and rebuilding the atlas)

The runtime game rendering of pickup markers does **not** use `assets/sprites/generated/*.png` (it draws procedural canvas textures at startup via `markerHiRes.ts`).  
However, the PNGs + `marker_atlas.png` are used as **export/reference outputs**.

## Expected PNG sizes (current spec)

The marker export spec is defined in `src/game/render/markerExportSpec.ts`:

- `MARKER_EXPORT_LOGICAL_FRAME = 20`
- `MARKER_EXPORT_SCALE_DEFAULT = 2`

So each `marker_<tone>.png` frame should be a **square**:

- **`20 × 2 = 40 × 40 px`**

There are `GLOSSARY_MARKER_TONES.length = 24` tones, so the expected atlas is:

- **`marker_atlas.png` = `40 × 24 = 960 × 40 px`**

The stitching script requires **all** `marker_<tone>.png` files (except `marker_atlas.png`) to have the **same dimensions**.

## When you replace PNGs manually

If you manually replace one or more `assets/sprites/generated/marker_<tone>.png` files (and you want `marker_atlas.png` to match your replacements), rebuild the atlas by stitching the tone PNGs:

```bash
node --import tsx tools/pack-marker-atlas-from-pngs.ts
```

This script will:

1. Read the marker frame order from `assets/sprites/generated/manifest.json` (or fall back to the `GLOSSARY_MARKER_TONES` order).
2. Load each `marker_<tone>.png` and stitch them into `marker_atlas.png` as a single horizontal strip.
3. Rewrite `manifest.json` with `frameWidth/frameHeight/exportScale` inferred from the PNGs you provided.

## Constraints / common pitfalls

- Keep all `marker_<tone>.png` frames **the same dimensions** (the script refuses to build the atlas if they differ).
- Do **not** edit `marker_atlas.png` manually; always rebuild it with the script.

