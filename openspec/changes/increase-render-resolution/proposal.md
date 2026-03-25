## Why

The current game resolution (800x1080 with 40px cells) results in a visual presentation that feels overly "chunky" and blurry on modern high-DPI displays (like Retina screens). The CRT scanline effects and bloom shaders are also locked to this lower resolution, producing very thick lines. Increasing the base render resolution will create a "High-Definition Retro" look with much finer post-processing and crisp, high-fidelity symbols.

## What Changes

- **Double Render Scale**: Increase `CELL` size from 40px to 80px, resulting in a 1600x2160 internal canvas (Retina-ready).
- **Asset Upscale**: Increase `MARKER_EXPORT_SCALE_DEFAULT` from 2 to 4 (80x80 markers) to ensure that the icons are perfectly paired with the new cell size.
- **Automated Re-rasterization**: Use the new SVG-to-PNG pipeline to rebuild all assets at the new native resolution.
- **Shader Adjustment**: The CRT scanlines and ink-outline effects will automatically adapt to the higher resolution, becoming denser and more subtle.

## Capabilities

### New Capabilities
- `high-dpi-rendering`: Support for high-resolution canvas layouts while preserving logical 20x27 cell gameplay coordinates.

### Modified Capabilities
- `asset-pipeline-svg`: Handling higher resolution exports (80x80 px).

## Impact

- **`src/game/core/constants.ts`**: Update `CELL` to `80`.
- **`src/game/render/markerExportSpec.ts`**: Update `MARKER_EXPORT_SCALE_DEFAULT` to `4`.
- **`assets/sprites/generated/`**: Complete regeneration of all PNG assets and the marker atlas.
- **Performance**: High resolution increases GPU fill-rate requirements; however, for a 2D game with simplified shaders, this is well within the capabilities of modern hardware like the MacBook Air.
