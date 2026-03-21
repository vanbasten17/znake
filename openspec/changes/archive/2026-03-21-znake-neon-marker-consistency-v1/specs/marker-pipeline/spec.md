## MODIFIED Requirements

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
