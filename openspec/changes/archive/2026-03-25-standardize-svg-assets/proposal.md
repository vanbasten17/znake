## Why

Currently, the game's marker assets are generated procedurally at runtime or edited as manual raster PNGs. This makes it difficult to maintain a consistent "Premium" visual style and prevents easy high-resolution scaling. Establishing an SVG-first pipeline allows for high-fidelity vector authoring, automated build steps, and reliable visual consistency across all game objects.

## What Changes

- **SVG Source-of-Truth**: Transition from procedural/manual PNGs to vector SVG files in `assets/sprites/source`.
- **Automated Generation**: Update build tools to automatically convert SVGs to the required 40x40 (or other scale) PNGs in `assets/sprites/generated`.
- **Dry-Run Capability**: Introduce a new tool/skill to preview SVG changes in a staging environment (temporary PNGs/previews) before committing them to the game's production folder.
- **Style Formalization**: Codify the "Premium Squared Neon" aesthetic into a living document to guide future asset creation.

## Capabilities

### New Capabilities
- `asset-pipeline-svg`: Automated conversion of SVG vectors into game-ready raster sprites with consistent pixel-alignment and scaling.
- `asset-dry-run`: A diagnostic and preview tool to validate SVG assets (dimensions, colors, borders) without overwriting existing game files.

### Modified Capabilities
- None.

## Impact

- **`assets/sprites/`**: New directory structure with `source/` for SVGs.
- **`tools/`**: Updates to `svg-to-png.ts` and potentially `generate-sprites.ts` to accommodate the vector-first flow.
- **`.agent/skills/`**: A new `asset-dry-run` skill for the AI agent to facilitate developer testing of new assets.
- **`package.json`**: New scripts for the dry-run and pipeline-aligned generation.
