## ADDED Requirements

### Requirement: Central predator-prey pacing tuning tables

The system SHALL define pacing phase durations, transition thresholds, and opening policy in centralized balance configuration.

#### Scenario: Pacing phase knobs are config-driven

- **WHEN** gameplay resolves pacing phase timing or transition thresholds
- **THEN** values are read from centralized balance config
- **AND** simulation/scene code avoids duplicating inline pacing constants

### Requirement: Central anti-overlap pressure guardrail policy

The system SHALL define overlap budgets, cadence gaps, and deterministic fallback priorities for pressure sequencing in centralized balance configuration.

#### Scenario: Overlap thresholds are config-driven

- **WHEN** overlap guardrail validation evaluates simultaneous pressure windows
- **THEN** max-overlap and minimum cadence-gap thresholds come from centralized config
- **AND** tuning can adjust fairness without editing multiple call sites

#### Scenario: Guardrail reason and fallback mappings are centrally defined

- **WHEN** overlap guardrails defer, downgrade, or allow a pressured action
- **THEN** reason-code mappings and fallback priorities are read from centralized config
- **AND** telemetry/readability consumers use shared taxonomy without scene-local remapping
