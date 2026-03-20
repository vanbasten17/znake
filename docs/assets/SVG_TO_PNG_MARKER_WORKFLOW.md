# SVG → PNG marker workflow (internal devtool)

Use this when you want to author original marker art in SVG and quickly test it in-game as PNG replacements.

## 1. Convert SVGs to PNGs

Default command (pipeline-aligned size):

```bash
pnpm sprites:svg2png
```

Options:

```bash
pnpm sprites:svg2png -- --in assets/sprites/source --out assets/sprites/source/png --size 320
```

- `--in`: source SVG folder (default: `assets/sprites/source`)
- `--out`: output PNG folder (default: `assets/sprites/source/png`)
- `--size`: square output size in px (default: `320`)

For lightweight previews, you can export small files:

```bash
pnpm sprites:svg2png -- --size 40
```

## 2. Replace runtime marker PNGs

1. Pick converted PNG(s) from `assets/sprites/source/png`.
2. Copy/rename to marker tone filenames in `assets/sprites/generated/`:
- `marker_core.png`
- `marker_shield.png`
- `marker_portal.png`
- etc. (one per tone in manifest)
3. Rebuild atlas:

```bash
node --import tsx tools/pack-marker-atlas-from-pngs.ts
```

4. Validate pipeline:

```bash
pnpm validate:markers
```

5. Restart dev server or hard refresh browser.

## 3. Visual-fit rules for current Znake style

To keep new sprites consistent with current UI/gameplay rendering:

- Prefer **high contrast** silhouettes; markers are read at small display size.
- Keep icon center clean; avoid tiny micro-details that vanish at cell scale.
- Use Znake palette families:
- benefit: cyan/green/gold accents
- hazard: purple/magenta/amber accents
- enemy: warm/orange-magenta hostile accents
- Preserve transparent background (no full opaque square).
- Keep shape centered inside frame; avoid touching outer frame edges.
- Test at runtime with `?dev=1` + `Reference Board (Static + Hover)`.

## 4. Where this fits in the pipeline

- Runtime loads `assets/sprites/generated/marker_<tone>.png` and falls back to procedural render if missing.
- `marker_atlas.png` + `manifest.json` should stay in sync after manual replacements.
- Source of truth for marker export framing/scaling remains:
- `src/game/render/markerExportSpec.ts`

Related:
- [MARKER_PIXEL_PIPELINE.md](./MARKER_PIXEL_PIPELINE.md)
- [MANUAL_MARKER_PNG_REPLACEMENT.md](./MANUAL_MARKER_PNG_REPLACEMENT.md)
