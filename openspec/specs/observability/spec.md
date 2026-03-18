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

The system SHALL emit progression events for floor transitions and upgrade choices.

#### Scenario: Upgrade selection is tracked

- **WHEN** player picks an upgrade card
- **THEN** telemetry emits `upgrade_picked` with upgrade id and run context

#### Scenario: Floor advance is tracked

- **WHEN** floor increments after upgrade selection
- **THEN** telemetry emits `floor_reached` with the new floor value

