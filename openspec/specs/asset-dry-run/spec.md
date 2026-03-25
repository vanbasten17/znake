# asset-dry-run Specification

## Purpose
TBD - created by archiving change standardize-svg-assets. Update Purpose after archive.
## Requirements
### Requirement: Dry-Run Previews
The system SHALL provide a `--dry-run` option (or environment variable toggle) for asset conversion that generates previews in a temporary directory without affecting the production folder.

#### Scenario: Validating a new asset icon
- **WHEN** user runs `pnpm sprites:svg2png --dry-run` (or similar)
- **THEN** files are written to a temporary preview-specific directory (e.g., `assets/sprites/previews`)
- **AND** the production assets in `assets/sprites/generated/` remain unchanged

### Requirement: Agent Dry-Run Skill
The agent SHALL implement a skill to automatically execute a dry-run of specific assets and present the resulting image to the user.

#### Scenario: AI-assisted asset iteration
- **WHEN** the agent detects changes to an SVG file in `source/`
- **THEN** it may offer to run a dry-run preview
- **AND** display the rendered PNG to the user for visual confirmation before production update

