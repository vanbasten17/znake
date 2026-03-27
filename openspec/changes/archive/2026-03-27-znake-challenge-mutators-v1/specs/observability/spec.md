## ADDED Requirements

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
