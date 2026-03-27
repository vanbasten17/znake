## MODIFIED Requirements

### Requirement: Objective and reward tuning tables

The system SHALL keep room objective declarations, objective target values, reward definitions, and clean-play rule/payout tables in centralized balance configuration.

#### Scenario: Objective targets are centrally tuned

- **WHEN** gameplay resolves duration, count, or activation targets for a room objective
- **THEN** those values come from centralized balance data
- **AND** they are not hardcoded inline in scene logic

#### Scenario: Reward tradeoffs are centrally tuned

- **WHEN** gameplay resolves a reward option's positive and negative modifiers
- **THEN** those values come from centralized balance data
- **AND** reward selection UI does not define gameplay effect magnitudes inline

#### Scenario: Clean-play eligibility rules are centrally tuned

- **WHEN** gameplay evaluates whether a completed objective qualifies for clean-play status
- **THEN** condition flags and qualification constraints come from centralized balance config
- **AND** objective and scene code does not hardcode duplicate eligibility constants

#### Scenario: Clean-play payout rules are centrally tuned

- **WHEN** gameplay resolves clean-play bonus payout type, amount, and per-objective caps
- **THEN** those values come from centralized balance config
- **AND** reward/recap presentation paths consume resolved values without redefining magnitudes inline
