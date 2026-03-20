## Why

We need a lightweight internal path to author original marker art in SVG and convert it into runtime-ready PNGs, without hand-editing each raster output.

## What Changes

- Add an internal CLI tool to batch-convert marker SVG files into square PNG files.
- Expose the tool via `pnpm sprites:svg2png`.
- Add short documentation with:
  - conversion command usage,
  - how to replace marker runtime assets safely,
  - visual-fit guidance to keep outputs coherent with Znake’s current style.

## Impact

- Faster iteration for custom sprite creation.
- Lower friction for replacing generated marker assets while staying aligned with existing marker pipeline and atlas flow.
