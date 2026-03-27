## ADDED Requirements

### Requirement: Central elite and miniboss pattern-window tuning
The system SHALL keep elite/miniboss telegraph, commit, and recovery window knobs in centralized balance configuration.

#### Scenario: Pattern windows are balance-driven
- **WHEN** elite/miniboss phase durations or warning lead times are evaluated
- **THEN** values are resolved from centralized balance config
- **AND** gameplay and scene code do not duplicate those timing constants inline

### Requirement: Central anti-cheap-hit fairness thresholds for elite and miniboss encounters
The system SHALL define elite/miniboss reaction, spawn-safety, and anti-overlap thresholds in centralized balance configuration.

#### Scenario: Reaction and spawn safety thresholds are config-driven
- **WHEN** elite/miniboss fairness validation runs
- **THEN** minimum reaction windows, minimum spawn distance, and escape-space floors come from centralized balance config
- **AND** deterministic fallback thresholds are configured for exhausted strict-filter cases

#### Scenario: Anti-overlap sequencing is config-driven
- **WHEN** gameplay validates stacked elite/miniboss pressure intervals
- **THEN** overlap caps and required cadence gaps come from centralized balance config
- **AND** tuning can adjust fairness without editing scene-local logic

### Requirement: Central elite and miniboss cadence and reward-gate policy
The system SHALL define elite/miniboss encounter cadence and objective/reward gate policy in centralized balance configuration.

#### Scenario: Cadence policy is centrally authored
- **WHEN** run progression resolves elite/miniboss encounter frequency by depth or segment window
- **THEN** cadence tables and eligibility weights are read from centralized config
- **AND** progression systems consume resolved policy without hardcoded per-scene cadence lists

#### Scenario: Reward-gate policy is centrally authored
- **WHEN** an elite/miniboss encounter completes
- **THEN** objective-critical reward gating policy is resolved from centralized config
- **AND** reward flow paths do not hardcode encounter-specific gate exceptions inline
