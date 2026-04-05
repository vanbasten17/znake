## ADDED Requirements

### Requirement: Overlay lifecycle transitions are explicitly guarded

The system SHALL enforce explicit overlay lifecycle transition contracts.

#### Scenario: Overlay transition performs deterministic ownership handoff
- WHEN an overlay enters or exits an interactive state
- THEN transition guards validate state change legality
- AND gameplay/input ownership handoff occurs deterministically at defined boundaries
