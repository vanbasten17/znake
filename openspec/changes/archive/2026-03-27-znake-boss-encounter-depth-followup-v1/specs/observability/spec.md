## ADDED Requirements

### Requirement: Boss encounter readability telemetry
The system SHALL emit stable telemetry for boss identity and phase-readability windows during boss encounters.

#### Scenario: Boss phase/readability windows are tracked
- **WHEN** boss encounter readability state transitions across phase windows
- **THEN** telemetry includes encounter identity, phase transition context, and bounded counterplay-window fields
- **AND** payload shape remains stable for cross-run fairness analysis

### Requirement: Boss encounter failure attribution telemetry
The system SHALL emit deterministic boss damage/reason attribution and include bounded boss summary fields at run end.

#### Scenario: Boss damage events include bounded failure reason context
- **WHEN** a boss pressure event damages the player
- **THEN** telemetry includes bounded failure-reason code and active boss identity/phase context
- **AND** emitted reason codes align with centralized taxonomy

#### Scenario: Run-end includes bounded boss encounter summary fields
- **WHEN** a run ends after at least one boss encounter context was active
- **THEN** run-end telemetry includes bounded boss encounter summary metrics
- **AND** summary fields align with encounter-level reason mappings emitted during the run
