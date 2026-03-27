## ADDED Requirements

### Requirement: Objective-reward loop milestone telemetry

The system SHALL emit stable, bounded telemetry for objective completion and reward selection milestones so objective-loop readability and decision outcomes can be analyzed consistently.

#### Scenario: Objective completion emits objective loop milestone event

- **WHEN** an objective completes and reward drafting begins
- **THEN** telemetry emits `objective_completed` with objective kind and objective-window identifier context
- **AND** payload includes bounded floor/score context for tuning comparisons

#### Scenario: Reward pick emits reward selection milestone event

- **WHEN** the player selects a reward option in the same objective window
- **THEN** telemetry emits `reward_picked` with selected reward identifier and pick index context
- **AND** payload includes bounded objective-window and clean-play resolution context
