## ADDED Requirements

### Requirement: Composition window telemetry context

The system SHALL include active composition window identifier in encounter role-composition telemetry.

#### Scenario: Role composition events include window id
- **WHEN** `encounter_role_composition` telemetry is emitted
- **THEN** payload includes deterministic `roleWindowId` for the active draft window
- **AND** field naming remains stable for dashboard aggregation
