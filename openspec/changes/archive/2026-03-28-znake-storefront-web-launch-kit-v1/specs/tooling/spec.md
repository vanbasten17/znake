## ADDED Requirements

### Requirement: Release metadata generation for launch surfaces
The system SHALL provide deterministic release metadata outputs consumable by menu transparency UI and launch-page surfaces.

#### Scenario: Build metadata includes version and channel
- **WHEN** launch bundle metadata is generated
- **THEN** output includes semantic app version and release channel fields
- **AND** values are consistent between in-app menu display and launch-page display surfaces

#### Scenario: Metadata generation fails clearly on invalid configuration
- **WHEN** required release metadata inputs are missing or malformed
- **THEN** tooling reports actionable validation errors before release artifacts are considered ready
- **AND** failure mode does not alter gameplay build determinism
