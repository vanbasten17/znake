## ADDED Requirements

### Requirement: Typed telemetry event contract

The system SHALL centralize high-frequency scene telemetry payload shapes through typed helper contracts.

#### Scenario: Scene call sites emit through typed event helpers

- **WHEN** scenes emit telemetry for run lifecycle, room progression, objective/reward, and route decisions
- **THEN** scenes call typed telemetry helpers instead of ad-hoc inline payload construction
- **AND** event names and payload semantics remain stable for existing analytics consumers

#### Scenario: Payload schema drift is reduced by shared contracts

- **WHEN** telemetry payload fields evolve
- **THEN** schema updates occur in shared typed contracts
- **AND** scene-level updates are limited to explicit helper-API call changes
