## Context

The game's visual presentation is locked to the canvas resolution (WIDTH/HEIGHT). This resolution is determined by `CELL` (pixels per grid cell). The current `CELL=40` is acceptable for standard displays, but it doesn't utilize the high-DPI (Retina) density of modern laptops, causing the CRT scanlines to look blocky and the artwork to look chunky rather than retro-high-fidelity.

## Goals / Non-Goals

**Goals:**
- Double the render resolution to a high-DPI (Retina) standard.
- Achieve a "finer" look for CRT shaders (scanlines, chromatic aberration).
- Keep the game's internal logical coordinates (20x27 cells) identical.
- Ensure that the SVG assets are rasterized at the new native resolution.

**Non-Goals:**
- Changing the game's actual view extent (still 20x27 cells).
- Upscaling to 4K (3840+) which might impact fill-rate on integrated GPUs.

## Decisions

### 1. The 1:1 Raster Standard
We will maintain the relationship between `CELL` and `MARKER_EXPORT_SCALE_DEFAULT`.
- **Current**: `CELL=40`, `MARKER_SCALE=2` (40px) → 1:1 match.
- **Proposed**: `CELL=80`, `MARKER_SCALE=4` (80px) → 1:1 match.

**Rationale**: This ensures that markers are drawn without scaling at run-time, keeping them at maximum sharpness within a high-dpi canvas.

### 2. Canvas Resolution: 1600x2160
The new resolution will be 1600x2160.
- **Width**: `20 cells * 80px = 1600px`
- **Height**: `27 cells * 80px = 2160px`
- **Total Pixels**: 3.4M (comparable to 1440p).
- **Rationale**: This fits effectively on most modern displays (scaled FIT) while providing enough density for very thin, discrete scanlines in the post-processing shader.

### 3. Shader Frequency Tuning
The `ArcadeEffectsPipeline` shader uses `uResolution` for scanline calculation.
```glsl
float scanline = sin(uv.y * uResolution.y * 1.8) * 0.04 * uCRTIntensity;
```
By doubling `uResolution.y`, we effectively double the number of horizontal scanlines, creating a much higher-fidelity CRT look (matching real-world Aperture Grill / Sony Trinitron density).

## Risks / Trade-offs

- **[Risk] High Fill-Rate cost**: Doubling resolution is a 4x increase in total pixels (from 0.8M to 3.4M).
  - **Mitigation**: Znake uses simple 2D primitives and optimized post-processing; modern browsers/GPUs handle 3.4M pixels at 60FPS effortlessly.
- **[Trade-off] Atlas Size**: The `marker_atlas.png` will increase from ~33KB to ~120KB.
  - **Mitigation**: This is still extremely lightweight for any web asset.
