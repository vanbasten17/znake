## ADDED Requirements

### Requirement: Boss telemetry includes phase-remix context

The system SHALL include deterministic phase-remix context in boss encounter telemetry payloads.

#### Scenario: Boss phase and damage telemetry include remix id
- **WHEN** boss phase-window, phase-change, or boss-damage-reason telemetry is emitted
- **THEN** payload includes stable `phaseRemixId` context field
- **AND** fields remain bounded for cross-remix fairness analysis
