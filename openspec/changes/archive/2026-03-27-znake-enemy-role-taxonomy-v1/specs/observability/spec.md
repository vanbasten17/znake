## ADDED Requirements

### Requirement: Enemy role composition telemetry

The system SHALL emit structured telemetry describing encounter role composition for readability and fairness analysis.

#### Scenario: Encounter start records role mix

- **WHEN** a combat or elite encounter starts
- **THEN** telemetry includes an encounter role-composition event with active role counts and room context
- **AND** payload format is stable across runs for balancing analysis

### Requirement: Role pressure and counterplay telemetry

The system SHALL emit structured telemetry for key role-pressure outcomes and counterplay opportunities.

#### Scenario: High-pressure role action outcome is tracked

- **WHEN** a role action causes major pressure outcome such as player damage, objective disruption, or economy loss
- **THEN** telemetry records role id, action class, and run/room context
- **AND** emitted data can differentiate pressure source by role contract

#### Scenario: Counterplay window usage is tracked

- **WHEN** the player successfully or unsuccessfully responds inside a role counterplay window
- **THEN** telemetry records counterplay-attempt outcome with role and timing context
- **AND** event granularity remains bounded to actionable balancing checkpoints
