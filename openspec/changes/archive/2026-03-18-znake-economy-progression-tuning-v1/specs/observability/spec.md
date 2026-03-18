## MODIFIED Requirements

### Requirement: Progression telemetry

The system SHALL emit progression and economy events needed for balancing analysis.

#### Scenario: Run reward breakdown is tracked

- **WHEN** run reward is computed
- **THEN** telemetry emits `run_reward_breakdown` with score/kill/floor components and final reward

#### Scenario: Goal transitions are tracked

- **WHEN** goal progress changes or a goal is claimed
- **THEN** telemetry emits `goal_progressed` and `goal_claimed` with goal id and values
