## ADDED Requirements

### Requirement: Deterministic body-terrain snapshot contract

The system SHALL compute a deterministic body-terrain snapshot from active run state that can be reused by gameplay, HUD readability, and telemetry.

#### Scenario: Equivalent run state yields equivalent terrain snapshot

- **WHEN** two runs have equivalent snake/enemy/wall state at the same deterministic tick
- **THEN** lane-control, zone-control, safe-pocket, and trap-risk fields match exactly
- **AND** snapshot computation does not depend on render timing

### Requirement: Recoverability guardrail contract for body spend

The system SHALL apply deterministic recoverability guardrails before body spend actions in high-pressure low-agency states.

#### Scenario: Guardrail blocks unsafe spend in low-agency state

- **WHEN** a body spend action is requested while terrain snapshot reports low safe-pocket availability under active pressure
- **THEN** spend is blocked by guardrail with bounded reason code
- **AND** snake length remains unchanged

#### Scenario: Guardrail allows spend in recoverable state

- **WHEN** body spend is requested while terrain snapshot satisfies configured recoverability thresholds
- **THEN** spend resolves through normal deterministic spend pipeline
- **AND** guardrail does not alter non-blocked outcomes
