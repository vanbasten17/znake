# scenes (delta)

Delta for `openspec/specs/scenes/spec.md` — dev reference board marker grid.

## ADDED Requirements

### Requirement: Dev reference board marker preview

When the **dev reference board** scenario is active, the system SHALL render each glossary marker preview cell using the same **hi-res marker textures** (`marker_hi_<tone>`) used for gameplay world markers, so optional `marker_<tone>.png` bitmaps and procedural fallbacks match guide and in-game appearance.

#### Scenario: Reference grid uses texture keys

- **WHEN** reference board mode is active and reference marker cells are drawn
- **THEN** each cell uses `Phaser.GameObjects.Image` (or equivalent) with `markerTextureKey(tone)` for that cell’s tone
- **AND** the implementation does not use `drawMarkerSpritePhaser` only for those marker previews
