# app-distribution Specification

## Purpose
TBD - created by archiving change znake-mobile-packaging-distribution-v1. Update Purpose after archive.
## Requirements
### Requirement: Mobile packaging capability contract
The system SHALL define a minimal, maintainable packaging capability contract for iOS and Android distribution shells.

#### Scenario: Candidate packaging targets both mobile platforms
- **WHEN** a release candidate packaging workflow is executed
- **THEN** workflow outputs include platform-targeted candidate artifacts for iOS and Android shells
- **AND** workflow documentation identifies required platform-specific prerequisites without embedding secrets

### Requirement: Release channel and version metadata contract
The system SHALL require consistent channel/version metadata for distribution candidates and releases.

#### Scenario: Channel-aware metadata is mandatory for candidate and release artifacts
- **WHEN** candidate or release artifacts are generated
- **THEN** artifacts include `release_version`, `release_channel`, and `build_id`
- **AND** `release_channel` values are constrained to `dev`, `stage`, or `prod`

### Requirement: Signing and distribution checklist contract
The system SHALL define signing/distribution readiness checklist requirements for candidate and release flows.

#### Scenario: Candidate signing checklist is recorded before distribution
- **WHEN** a candidate is prepared for internal/external distribution
- **THEN** checklist captures signing readiness, target channel, and reviewer metadata
- **AND** missing required checklist fields block candidate promotion

#### Scenario: Release signing checklist is recorded before store submission
- **WHEN** a release build is prepared for store submission
- **THEN** checklist captures release metadata tuple, signing confirmation, and submitter metadata
- **AND** missing required checklist fields block release submission

### Requirement: Packaging rollback readiness contract
The system SHALL define rollback readiness metadata for packaged release channels.

#### Scenario: Release metadata includes rollback target context
- **WHEN** a channel build is approved for release
- **THEN** release evidence includes previous stable build reference and rollback owner metadata
- **AND** rollback execution notes are available for first-response incidents

