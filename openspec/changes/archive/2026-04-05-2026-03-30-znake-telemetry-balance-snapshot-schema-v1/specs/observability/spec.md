## ADDED Requirements

### Requirement: Balance telemetry emits normalized versioned snapshots

The system SHALL emit normalized, versioned telemetry snapshots for balance-critical events.

#### Scenario: Objective completion snapshot is emitted
- **WHEN** a balance-critical event occurs
- **THEN** telemetry includes a versioned snapshot envelope with required canonical fields
- **AND** snapshot values are deterministic for identical simulation state
