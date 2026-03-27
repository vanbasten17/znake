## MODIFIED Requirements

### Requirement: Central combat fairness tuning

The system SHALL define combat fairness timings and spawn-safety thresholds in centralized balance configuration, including telegraph readability windows and short room-entry/post-hit breathing windows.

#### Scenario: Telegraph timing is balance-driven

- **WHEN** enemy telegraph duration or warning cadence is evaluated
- **THEN** the values come from centralized balance config
- **AND** enemy or scene code does not hardcode duplicate timing constants

#### Scenario: Grace windows and spawn safety thresholds are balance-driven

- **WHEN** room-entry grace, post-hit grace, minimum spawn distance, lane exclusion, or escape-space thresholds are evaluated
- **THEN** the values come from centralized balance config
- **AND** fairness rules can be tuned without editing multiple gameplay call sites

#### Scenario: Fairness tuning remains threshold-driven and bounded

- **WHEN** combat fairness values are adjusted for a tuning pass
- **THEN** updates are made through centralized threshold tables
- **AND** tuning does not require new scene-owned fairness branches
