# observability Specification

## Purpose
TBD - created by archiving change znake-observability-events-v1. Update Purpose after archive.
## Requirements
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

### Requirement: Progression telemetry

The system SHALL emit telemetry for newly added elite, item, and floor-template interactions.

#### Scenario: Elite lifecycle is tracked

- **WHEN** ambusher (or other elite kind) is spawned and defeated
- **THEN** telemetry emits `elite_spawned` and `elite_defeated` with elite kind and floor context

#### Scenario: Rift battery interaction is tracked

- **WHEN** rift battery is collected and suppression starts/ends
- **THEN** telemetry emits `item_collected` and `rift_suppressed` with duration/effect context

#### Scenario: Floor template selection is tracked

- **WHEN** a floor starts and template is resolved
- **THEN** telemetry emits `floor_template_selected`
- **AND** payload includes floor, selected template, and fallback usage

### Requirement: Clean-play bonus telemetry

The system SHALL emit stable telemetry describing clean-play eligibility, result, and payout for completed objectives.

#### Scenario: Objective completion emits clean-play result context

- **WHEN** an objective completion is resolved
- **THEN** telemetry includes a clean-play result field indicating whether eligibility was met
- **AND** payload includes objective kind and deterministic qualification context needed for tuning

#### Scenario: Bonus payout emits bounded payout context

- **WHEN** a clean-play bonus payout is applied
- **THEN** telemetry includes payout type, amount, and objective-window identifier
- **AND** the payload supports detecting duplicate or exploit-like payout patterns without requiring scene-specific logs

### Requirement: Mutator lifecycle telemetry

The system SHALL emit stable telemetry for mutator drafting, activation, rejection, and in-run impact.

#### Scenario: Draft and activation are tracked
- **WHEN** mutators are drafted and finalized for a run
- **THEN** telemetry emits mutator draft and activation events with run seed context and mutator identifiers
- **AND** payload shape remains stable for dashboard aggregation

#### Scenario: Rejections include guardrail reason
- **WHEN** a candidate mutator is rejected by compatibility or fairness validation
- **THEN** telemetry includes a deterministic rejection reason code
- **AND** emitted data can distinguish conflict rejection from pressure-budget rejection

### Requirement: Run-end mutator impact context

The system SHALL include mutator impact summary in run-end telemetry context for balancing analysis.

#### Scenario: Run end reports active mutator context
- **WHEN** a run ends
- **THEN** run-end telemetry includes active mutator identifiers and bounded impact summary fields
- **AND** summary fields align with configured mutator domains for comparison across runs

