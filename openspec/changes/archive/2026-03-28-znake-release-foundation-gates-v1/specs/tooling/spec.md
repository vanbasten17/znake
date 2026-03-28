## ADDED Requirements

### Requirement: Release candidate gate contract
The system SHALL define a release candidate gate contract that requires engineering, visual, and asset-quality checks before candidate approval.

#### Scenario: Engineering gate enforces baseline checks
- **WHEN** a release candidate is evaluated
- **THEN** gate evaluation requires successful `pnpm check` execution
- **AND** requires successful production build validation for release-targeted candidates
- **AND** candidate approval is blocked when any required engineering check fails

#### Scenario: Visual and asset gates require explicit review evidence
- **WHEN** a release candidate is evaluated for launch readiness
- **THEN** gate evaluation includes explicit visual-quality checklist results and asset-quality checklist results
- **AND** each checklist section records reviewer metadata and pass/fail outcome
- **AND** candidate approval is blocked when required checklist evidence is missing or failed

### Requirement: Release gate metadata consistency
The release gating flow SHALL require a shared metadata tuple across all gate outputs.

#### Scenario: Gate artifacts include release metadata tuple
- **WHEN** gate outputs are produced for a release candidate
- **THEN** outputs include `release_version`, `release_channel`, and `build_id`
- **AND** missing tuple fields result in gate failure status

