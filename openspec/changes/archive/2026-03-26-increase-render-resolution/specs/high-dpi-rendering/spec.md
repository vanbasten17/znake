## ADDED Requirements

### Requirement: Double Game Scale
The system SHALL double the base render resolution from 40px per cell to 80px per cell (Retina-standard).

#### Scenario: Verify total canvas resolution
- **WHEN** the game initializes
- **THEN** the total internal canvas `WIDTH` and `HEIGHT` MUST be 1600x2160 pixels (20x27 cells at 80px each)
- **AND** the logical gameplay coordinates (food locations, snake segment units) remain centered in each 80x80 cell.

### Requirement: High-Density Sprite Rasterization
The system SHALL increase the bitmap export scale for marker sprites to match the new native cell resolution.

#### Scenario: High-DPI sprite conversion
- **WHEN** user runs the `pnpm sprites:update` tool
- **THEN** all PNGs in `assets/sprites/generated/` MUST be rendered at 80x80 px (4x scale from logical 20x20).
- **AND** the `manifest.json` reflects `exportScale: 4`.

### Requirement: Adaptive Post-Processor
The CRT scanline and bloom effects SHALL adapt to the high-resolution canvas by producing finer, denser details.

#### Scenario: Shaders adapt to canvas density
- **WHEN** the post-processing pipeline is active
- **THEN** the horizontal scanline frequency must increase proportionally to `uResolution.y`
- **AND** the resulting scanlines must be thinner than at the previous 40px scale, providing a "High-Definition Retro" look.
