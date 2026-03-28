## ADDED Requirements

### Requirement: Deterministic challenge preset bootstrap

The system SHALL support deterministic run bootstrap presets for `daily` and `weekly` challenge modes while preserving existing standard-run bootstrap behavior.

#### Scenario: Daily preset seed is stable within the same UTC day
- **WHEN** daily challenge runs start on the same UTC day
- **THEN** resolved run seed is identical across those starts
- **AND** standard run mode seed behavior remains unchanged

#### Scenario: Weekly preset seed is stable within the same UTC week bucket
- **WHEN** weekly challenge runs start within the same UTC week bucket
- **THEN** resolved run seed is identical across those starts
- **AND** weekly seed changes only when week bucket changes

### Requirement: Preset modifier composition uses existing mutator guardrails

The system SHALL compose first-pass challenge preset modifier behavior through existing mutator contracts and fairness guardrails.

#### Scenario: Preset forced mutator joins run mutator context safely
- **WHEN** a challenge preset provides a forced mutator identifier
- **THEN** gameplay includes that mutator in run mutator context only when floor eligibility allows
- **AND** existing guardrail constraints and deterministic ordering remain preserved
