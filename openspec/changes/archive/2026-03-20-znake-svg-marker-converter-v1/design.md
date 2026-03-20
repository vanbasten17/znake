## Design

1. Add `tools/svg-to-png.ts`:
- Reads all `.svg` files from an input folder.
- Renders each SVG to PNG using `@resvg/resvg-js`.
- Writes outputs with same basename in an output folder.
- Supports CLI parameters: `--in`, `--out`, `--size`.

2. Script entrypoint in `package.json`:
- `pnpm sprites:svg2png`.

3. Defaults aligned with current marker pipeline:
- Default output size = `320x320` to match current generated marker frame size and avoid quality loss when replacing runtime marker PNGs.
- Optional `--size 40` remains available for concept previews.

4. Documentation:
- Add a concise usage doc with end-to-end replacement flow:
  1. author SVG,
  2. convert to PNG,
  3. copy/rename to `assets/sprites/generated/marker_<tone>.png`,
  4. rebuild atlas,
  5. run marker validation.

## Non-goals

- No runtime rendering changes.
- No changes to gameplay behavior or balancing.
