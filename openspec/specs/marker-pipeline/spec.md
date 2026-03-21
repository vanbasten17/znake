# marker-pipeline

Runtime and export behavior for glossary marker raster art (`marker_<tone>.png`) aligned with `markerExportSpec`.

## Purpose

Define how optional bitmap files override procedural marker art in browser and Node export tooling.
## Requirements
### Requirement: Per-tone PNG files and naming

The system SHALL treat `assets/sprites/generated/marker_<tone>.png` as the optional bitmap source for each `GlossaryMarkerTone` value, where `<tone>` matches the tone identifier (e.g. `core`, `biomeCore`, `enemyMirror`).

#### Scenario: Tone list drives filenames

- **WHEN** a tone exists in `GLOSSARY_MARKER_TONES`
- **THEN** the corresponding optional asset path is `marker_<tone>.png` under `assets/sprites/generated/`

---

### Requirement: Runtime bitmap preference with procedural fallback

The browser runtime SHALL load configured marker PNG URLs and prefer loaded bitmaps per tone when rasterizing markers for glossary and Phaser hi-res textures; if a tone image is missing or fails to load, that tone SHALL render procedurally.

#### Scenario: Optional Neon batch preview override for development

- **WHEN** URL query param `neonPreview=1` is present
- **THEN** runtime resolves tone-matched marker PNGs from `assets/sprites/source/marker_neon_proposals/png/` as first-choice overrides
- **AND** tones without a proposal PNG continue using base generated markers or procedural fallback

#### Scenario: Default runtime keeps production marker set

- **WHEN** `neonPreview=1` is not present
- **THEN** runtime uses generated marker PNGs under `assets/sprites/generated/`
- **AND** gameplay visuals remain unchanged from production defaults

### Requirement: Procedural-only module for Node tooling

The module that implements `drawMarkerSpriteProcedural` SHALL NOT import Vite asset URLs or browser-only bitmap loaders, so `pnpm generate:sprites` can execute in Node without loading `.png` as ES modules.

#### Scenario: Sprite export runs in Node

- **WHEN** `tools/generate-sprites.ts` runs
- **THEN** it imports procedural drawing from `markerRenderer.ts` without failing on PNG file extension imports

---

### Requirement: Export preserves existing per-tone PNGs

The `pnpm generate:sprites` command SHALL, for each tone, if `marker_<tone>.png` already exists in the output directory before that tone is rendered, write the exported PNG for that tone by re-rasterizing from the existing file at the same logical dimensions; otherwise it SHALL generate from procedural art.

#### Scenario: First-time generation

- **WHEN** no `marker_<tone>.png` exists yet for a tone
- **THEN** export generates that PNG from procedural art

#### Scenario: Hand-edited PNG on disk

- **WHEN** `marker_<tone>.png` already exists when export runs
- **THEN** export copies that raster into the new output (preserving the hand edit) unless the file is removed first

---

### Requirement: Dimensions and crispness

Rasterized markers for runtime and export SHALL match the active `markerExportSpec` (logical frame, default scale, NEAREST filter in Phaser) so pixels remain crisp and consistent with `pnpm validate:markers` expectations.

#### Scenario: Spec is single source of truth

- **WHEN** developers change export frame dimensions
- **THEN** they update `markerExportSpec.ts` and regenerate or replace PNGs to match those dimensions

