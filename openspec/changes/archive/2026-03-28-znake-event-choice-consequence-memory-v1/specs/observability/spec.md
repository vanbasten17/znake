## ADDED Requirements

### Requirement: Event-choice consequence-memory telemetry

The system SHALL emit stable telemetry when delayed event-choice consequences are scheduled and applied.

#### Scenario: Scheduling and application events include deterministic context
- **WHEN** a qualifying option schedules a delayed consequence and when it later resolves
- **THEN** telemetry includes source option id, consequence id, floor context, and trigger floor
- **AND** payload remains bounded for retention analysis
