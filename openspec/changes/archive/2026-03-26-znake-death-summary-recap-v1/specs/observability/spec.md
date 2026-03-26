## MODIFIED Requirements

### Requirement: Run lifecycle telemetry

The system SHALL emit a stable minimum set of gameplay observability events for every completed run and keep run-end context aligned with the death recap inputs.

#### Scenario: Run start emits mode context

- **WHEN** a run starts from menu or death-restart flow
- **THEN** telemetry includes `run_start` and `input_mode`

#### Scenario: Run end emits death and recap context

- **WHEN** player dies and run summary is generated
- **THEN** telemetry includes `death_reason`, `time_alive`, and `run_end` with aligned context
- **AND** run-end context can describe the selected-upgrade family leaning and notable run choices from existing run state when available
- **AND** recap support does not require a duplicate analytics-only event family
