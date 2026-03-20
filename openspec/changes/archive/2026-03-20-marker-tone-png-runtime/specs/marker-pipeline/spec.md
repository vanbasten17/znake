# marker-pipeline

Runtime and export behavior for glossary marker raster art (`marker_<tone>.png`) aligned with `markerExportSpec`.

## ADDED Requirements

### Requirement: Per-tone PNG files and naming

The system SHALL treat `assets/sprites/generated/marker_<tone>.png` as the optional bitmap source for each `GlossaryMarkerTone` value, where `<tone>` matches the tone identifier (e.g. `core`, `biomeCore`, `enemyMirror`).

#### Scenario: Tone list drives filenames

- **WHEN** a tone exists in `GLOSSARY_MARKER_TONES`
- **THEN** the corresponding optional asset path is `marker_<tone>.png` under `assets/sprites/generated/`

---

### Requirement: Runtime bitmap preference with procedural fallback

The browser runtime SHALL load all configured marker PNG URLs, then prefer a loaded bitmap for each tone when rasterizing markers for the glossary and for Phaser hi-res marker textures; if a tone’s image is missing or fails to load, the system SHALL render that tone using procedural art (`drawMarkerSpriteProcedural`).

#### Scenario: Successful PNG load

- **WHEN** `marker_<tone>.png` loads successfully before marker textures are registered
- **THEN** `drawMarkerSpriteCanvas` draws that bitmap scaled to the logical marker frame for that tone

#### Scenario: Failed or missing PNG

- **WHEN** a marker PNG fails to load or has no URL
- **THEN** that tone uses procedural drawing only for that tone

---

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
