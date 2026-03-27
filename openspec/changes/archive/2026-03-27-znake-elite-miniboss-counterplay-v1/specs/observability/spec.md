## ADDED Requirements

### Requirement: Elite and miniboss readability telemetry
The system SHALL emit stable encounter-level telemetry for elite/miniboss readability and counterplay windows.

#### Scenario: Telegraph and counterplay windows are tracked
- **WHEN** an elite/miniboss pattern action enters telegraph and then resolves
- **THEN** telemetry includes encounter identifier, pattern phase timings, and counterplay-window context
- **AND** payload shape remains stable for cross-run comparison dashboards

### Requirement: Elite and miniboss failure-reason attribution telemetry
The system SHALL emit deterministic reason-code context for elite/miniboss damage and defeat outcomes.

#### Scenario: Encounter damage includes bounded failure reason
- **WHEN** an elite/miniboss action damages the player
- **THEN** telemetry includes a bounded failure-reason code from a centralized reason taxonomy
- **AND** emitted context can distinguish timing misses from spatial trap or stacked-pressure outcomes

#### Scenario: Encounter defeat summary supports fairness tuning
- **WHEN** the run ends after at least one elite/miniboss encounter
- **THEN** run-end telemetry includes bounded elite/miniboss readability summary fields
- **AND** summary fields align with encounter-level reason-code taxonomy used during the run
