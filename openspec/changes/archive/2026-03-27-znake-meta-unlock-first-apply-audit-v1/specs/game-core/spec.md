## ADDED Requirements

### Requirement: Central unlock policy contracts
The system SHALL define deterministic unlock-policy configuration for progression-gated meta features.

#### Scenario: Unlock policy map is centrally authored
- **WHEN** runtime resolves progression-gated feature availability
- **THEN** goal identifiers, thresholds, and unlock mode are read from centralized balance config
- **AND** call sites do not hardcode per-feature goal checks inline
