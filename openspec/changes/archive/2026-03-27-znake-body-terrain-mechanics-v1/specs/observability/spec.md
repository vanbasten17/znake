## ADDED Requirements

### Requirement: Body-terrain snapshot telemetry

The system SHALL emit stable telemetry for deterministic body-terrain snapshots at bounded decision moments.

#### Scenario: Snapshot telemetry emits bounded terrain fields

- **WHEN** a body-spend decision or equivalent terrain-critical moment occurs
- **THEN** telemetry includes bounded terrain snapshot fields (safe-pocket count, lane/zone control context, trap-risk flag)
- **AND** payload shape remains stable for tuning analysis

### Requirement: Body-terrain guardrail telemetry

The system SHALL emit telemetry when terrain recoverability guardrails block spend actions.

#### Scenario: Guardrail intervention telemetry includes reason code

- **WHEN** terrain-aware spend guardrail blocks an action
- **THEN** telemetry includes action kind, bounded guardrail reason code, and terrain snapshot context
- **AND** emitted events distinguish terrain guardrail blocks from cooldown or floor-limit blocks
