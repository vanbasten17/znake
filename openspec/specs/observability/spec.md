# observability Specification

## Purpose
TBD - created by archiving change znake-observability-events-v1. Update Purpose after archive.
## Requirements
### Requirement: Run lifecycle telemetry

The system SHALL emit a stable minimum set of gameplay observability events for every completed run.

#### Scenario: Run start emits mode context

- **WHEN** a run starts from menu or death-restart flow
- **THEN** telemetry includes `run_start` and `input_mode`

#### Scenario: Run end emits death and survival context

- **WHEN** player dies and run summary is generated
- **THEN** telemetry includes `death_reason`, `time_alive`, and `run_end` with aligned context

### Requirement: Progression telemetry

The system SHALL emit progression and economy events needed for balancing analysis.

#### Scenario: Run reward breakdown is tracked

- **WHEN** run reward is computed
- **THEN** telemetry emits `run_reward_breakdown` with score/kill/floor components and final reward

#### Scenario: Goal transitions are tracked

- **WHEN** goal progress changes or a goal is claimed
- **THEN** telemetry emits `goal_progressed` and `goal_claimed` with goal id and values

