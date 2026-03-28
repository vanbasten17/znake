## ADDED Requirements

### Requirement: Challenge preset lifecycle telemetry context

The system SHALL include active challenge preset context in run lifecycle telemetry payloads.

#### Scenario: Run start includes preset context
- **WHEN** a run starts from menu or death restart
- **THEN** telemetry payload includes challenge preset identifier and preset mutator identifier when present
- **AND** payload shape remains stable for dashboard aggregation

#### Scenario: Run end includes preset context for analysis
- **WHEN** run-end telemetry is emitted
- **THEN** payload includes active challenge preset identifier and preset mutator identifier context
- **AND** fields align with run-start preset context naming
