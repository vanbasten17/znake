## MODIFIED Requirements

### Requirement: End-of-run currency rewards

The system SHALL produce reward breakdown data and apply tuned economy coefficients.

#### Scenario: Reward breakdown is available at run end

- **WHEN** a run ends
- **THEN** score/kill/floor components and final reward can be derived from centralized economy config

## ADDED Requirements

### Requirement: Mid-term progression goals

The system SHALL track and reward lightweight one-time goals across runs.

#### Scenario: Goal progress persists

- **WHEN** player advances goal metrics (for example floor reached or elite kills)
- **THEN** goal progress is persisted in profile state

#### Scenario: Goal reward can be claimed once

- **WHEN** player reaches a goal target and claims its reward
- **THEN** currency increases once and goal is marked claimed
