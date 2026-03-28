## ADDED Requirements

### Requirement: Release compliance disclosure baseline
The system SHALL define minimum disclosure metadata and visibility requirements for release-targeted builds.

#### Scenario: Release-targeted UI surfaces include required disclosure links/text
- **WHEN** a release candidate build is prepared for distribution
- **THEN** required privacy and telemetry disclosure references are available from shell/menu-accessible UI surfaces
- **AND** disclosure presentation remains readable on supported portrait mobile and desktop layouts

#### Scenario: Compliance review metadata is tracked in release baseline
- **WHEN** release compliance review is performed
- **THEN** checklist output records reviewer, review date, and disclosure artifact references
- **AND** missing required metadata blocks release compliance approval

