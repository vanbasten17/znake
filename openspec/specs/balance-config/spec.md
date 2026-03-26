# balance-config Specification

## Purpose
TBD - created by archiving change znake-data-driven-balance-v1. Update Purpose after archive.
## Requirements
### Requirement: Central balance source

The system SHALL keep gameplay content selection rules in centralized, data-driven configuration rather than scene-local hardcoded lists.

#### Scenario: Spawn pools are data-driven

- **WHEN** gameplay resolves powerup/enemy variant selection policy
- **THEN** selection pools and weights are read from config modules
- **AND** scene code avoids inline hardcoded selection arrays for these systems

### Requirement: Objective and reward tuning tables

The system SHALL keep room objective declarations, objective target values, and reward definitions in centralized balance configuration.

#### Scenario: Objective targets are centrally tuned

- **WHEN** gameplay resolves duration, count, or activation targets for a room objective
- **THEN** those values come from centralized balance data
- **AND** they are not hardcoded inline in scene logic

#### Scenario: Reward tradeoffs are centrally tuned

- **WHEN** gameplay resolves a reward option's positive and negative modifiers
- **THEN** those values come from centralized balance data
- **AND** reward selection UI does not define gameplay effect magnitudes inline

### Requirement: Central combat fairness tuning

The system SHALL define combat fairness timings and spawn-safety thresholds in centralized balance configuration.

#### Scenario: Telegraph timing is balance-driven

- **WHEN** enemy telegraph duration or warning cadence is evaluated
- **THEN** the values come from centralized balance config
- **AND** enemy or scene code does not hardcode duplicate timing constants

#### Scenario: Grace windows and spawn safety thresholds are balance-driven

- **WHEN** room-entry grace, post-hit grace, minimum spawn distance, lane exclusion, or escape-space thresholds are evaluated
- **THEN** the values come from centralized balance config
- **AND** fairness rules can be tuned without editing multiple gameplay call sites

### Requirement: Central feedback tuning

The system SHALL keep first-pass feedback timing and intensity values in centralized configuration.

#### Scenario: Damage and pickup feedback are config-driven

- **WHEN** flash duration, shake duration, hit-stop window, or related pickup/damage emphasis values are evaluated
- **THEN** the values come from centralized balance config
- **AND** scene code does not duplicate those timing constants inline

#### Scenario: Objective celebration feedback is config-driven

- **WHEN** reward-ready or objective-complete emphasis values are evaluated
- **THEN** the values come from centralized balance config
- **AND** celebration tuning can be iterated without editing multiple call sites

