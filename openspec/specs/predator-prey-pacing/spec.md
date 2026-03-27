# predator-prey-pacing Specification

## Purpose
TBD - created by archiving change znake-predator-prey-pacing-contracts-v1. Update Purpose after archive.
## Requirements
### Requirement: Deterministic predator-prey pacing phase machine

The system SHALL model encounter pacing as a deterministic phase machine with bounded transitions between `hunt`, `escape`, and `reset`.

#### Scenario: Equivalent state and seed produce equivalent pacing timeline

- **WHEN** two runs execute with identical seed and equivalent encounter state history
- **THEN** pacing phase sequence and transition timings match deterministically
- **AND** no scene-frame timing variance changes pacing outcomes

#### Scenario: Phase transitions emit bounded reasons

- **WHEN** pacing transitions between `hunt`, `escape`, and `reset`
- **THEN** each transition includes a bounded reason code from shared taxonomy
- **AND** transition reasons remain stable for telemetry and recap usage

### Requirement: Anti-overlap pressure guardrails

The system SHALL apply deterministic guardrails when high-pressure actions would overlap beyond configured budgets.

#### Scenario: Overlap budget prevents unavoidable pressure chains

- **WHEN** active high-pressure windows exceed configured overlap budget
- **THEN** at least one candidate pressure action is deferred or downgraded deterministically
- **AND** resulting pressure remains dangerous while preserving actionable agency

#### Scenario: Guardrail fallback remains deterministic

- **WHEN** strict overlap constraints reject all candidate actions
- **THEN** the fallback action follows centralized deterministic priority
- **AND** emitted reason codes identify fallback cause and applied action

