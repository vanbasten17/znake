## ADDED Requirements

### Requirement: Predator-prey pacing lifecycle telemetry

The system SHALL emit stable telemetry for pacing phase transitions and guardrail interventions.

#### Scenario: Phase transitions emit bounded context

- **WHEN** pacing transitions between `hunt`, `escape`, and `reset`
- **THEN** telemetry includes prior phase, next phase, and bounded transition reason code
- **AND** payload shape remains stable for cross-run pacing analysis

#### Scenario: Guardrail interventions emit bounded intervention context

- **WHEN** anti-overlap guardrails defer or downgrade pressure actions
- **THEN** telemetry includes intervention action, reason code, and overlap context
- **AND** events distinguish strict-filter application from fallback resolution

### Requirement: Run-end pacing impact summary telemetry

The system SHALL include bounded pacing-impact summary fields in run-end context.

#### Scenario: Run end reports pacing summary fields

- **WHEN** a run ends after one or more pacing-phase transitions
- **THEN** run-end telemetry includes transition counts by phase and guardrail intervention totals
- **AND** summary fields align with pacing lifecycle taxonomy used during the run
