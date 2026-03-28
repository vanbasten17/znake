## MODIFIED Requirements

### Requirement: Simulation invariants test coverage

The system SHALL provide automated tests for extracted pure simulation logic and persistence migrations.

#### Scenario: Autoloop report includes versioned metadata for traceability

- **WHEN** `autoloop` writes `.autoloop/loop-report.json`
- **THEN** report includes a `loopVersion` field
- **AND** version value is stable within a release so automation consumers can validate expected schema
