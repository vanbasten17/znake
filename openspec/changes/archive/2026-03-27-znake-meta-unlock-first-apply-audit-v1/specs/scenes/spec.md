## ADDED Requirements

### Requirement: Menu progression unlock readiness surface
The system SHALL surface progression-gated feature unlock readiness in menu progression context without changing flow behavior.

#### Scenario: Menu goals title includes deterministic unlock readiness
- **WHEN** menu meta UI refreshes with current profile progression
- **THEN** goals/progression surface includes concise unlock readiness status derived from deterministic meta helper output
- **AND** start flow and talent/goal interactions remain behaviorally equivalent
