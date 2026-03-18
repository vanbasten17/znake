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

The system SHALL emit telemetry for newly added elite and item interactions.

#### Scenario: Elite lifecycle is tracked

- **WHEN** ambusher (or other elite kind) is spawned and defeated
- **THEN** telemetry emits `elite_spawned` and `elite_defeated` with elite kind and floor context

#### Scenario: Rift battery interaction is tracked

- **WHEN** rift battery is collected and suppression starts/ends
- **THEN** telemetry emits `item_collected` and `rift_suppressed` with duration/effect context

