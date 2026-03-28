## ADDED Requirements

### Requirement: Challenge share lifecycle telemetry

The system SHALL emit stable telemetry for challenge share export/import lifecycle outcomes.

#### Scenario: Share export emits preset context

- **WHEN** a challenge share code export succeeds
- **THEN** telemetry emits `challenge_share_exported`
- **AND** payload includes challenge preset context

#### Scenario: Share import failure emits bounded reason context

- **WHEN** challenge share import fails because of invalid format, checksum mismatch, or payload validation failure
- **THEN** telemetry emits `challenge_share_import_failed`
- **AND** payload includes bounded failure reason context for analysis

#### Scenario: Share import success emits bounded progress context

- **WHEN** challenge share import succeeds
- **THEN** telemetry emits `challenge_share_imported`
- **AND** payload includes challenge preset id and bounded floor/score context
