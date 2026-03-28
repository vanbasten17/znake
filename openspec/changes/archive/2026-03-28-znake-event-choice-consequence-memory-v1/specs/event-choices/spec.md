## ADDED Requirements

### Requirement: Event-choice options can schedule delayed consequences

The system SHALL allow configured event-choice options to schedule bounded delayed consequences across subsequent floors.

#### Scenario: Qualifying option schedules deterministic delayed consequence
- **WHEN** a selected event option has consequence-memory mapping
- **THEN** gameplay schedules a deterministic consequence payload with trigger floor
- **AND** scheduling obeys configured queue cap and delay window
