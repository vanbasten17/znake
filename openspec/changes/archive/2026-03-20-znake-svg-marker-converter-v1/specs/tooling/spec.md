## ADDED Requirements

### Requirement: SVG-to-PNG marker conversion devtool

The system SHALL provide an internal CLI workflow to convert authored marker SVG files into PNG outputs compatible with the current marker replacement pipeline.

#### Scenario: Batch conversion runs from tooling command

- **WHEN** developer runs `pnpm sprites:svg2png`
- **THEN** all SVG files in the input folder are converted to PNG files in the output folder
- **AND** each output keeps the source basename with `.png` extension

#### Scenario: Conversion supports pipeline-aligned resolution

- **WHEN** developer runs conversion without explicit size
- **THEN** generated PNG size defaults to the marker pipeline replacement resolution
- **AND** command supports explicit `--size` override for preview or custom exports

#### Scenario: Replacement path is documented for generated marker assets

- **WHEN** developer wants to replace in-game marker sprites with converted PNGs
- **THEN** docs describe where to place files, how to rebuild atlas, and how to validate consistency
