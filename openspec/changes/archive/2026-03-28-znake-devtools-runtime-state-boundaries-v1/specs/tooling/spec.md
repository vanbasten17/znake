## ADDED Requirements

### Requirement: Runtime devtools state stays isolated from simulation state

The system SHALL enforce this contract as part of the znake-devtools-runtime-state-boundaries-v1 scope.

#### Scenario: Contract is applied
- **WHEN** the relevant runtime or UI path executes
- **THEN** the defined contract behavior is applied consistently
- **AND** deterministic simulation behavior remains unchanged.
