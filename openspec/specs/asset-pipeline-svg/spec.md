# asset-pipeline-svg Specification

## Purpose
TBD - created by archiving change standardize-svg-assets. Update Purpose after archive.
## Requirements
### Requirement: SVG-to-PNG Batch Conversion
The system SHALL provide a command-line tool `pnpm sprites:svg2png` that processes all `.svg` files from a source directory and outputs corresponding `.png` files to a target directory.

#### Scenario: Batch conversion of marker source
- **WHEN** user runs `pnpm sprites:svg2png`
- **THEN** all `.svg` files in `assets/sprites/source/` are rendered as 40x40 PNGs in `assets/sprites/generated/`
- **AND** existing PNGs are overwritten with the new vector-rendered versions

### Requirement: Automatic Pixel Alignment
The conversion process SHALL ensure that the logical 20x20 SVG viewbox is scaled by exactly 2x to achieve the 40x40 pixel-perfect game output.

#### Scenario: Sharp rendering validation
- **WHEN** an SVG with integer-aligned rectangles is converted
- **THEN** the resulting PNG must show no anti-aliasing artifacts on the vertical and horizontal edges (integer scaling)

