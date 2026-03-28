## ADDED Requirements

### Requirement: Enemy composition contract aligns with unified progression director
The system SHALL provide active role window id and effective role policy caps through the unified progression-director payload for the same floor/spawn context.

#### Scenario: Unified payload carries composition window and role caps
- **WHEN** progression payload is resolved for enemy composition
- **THEN** payload includes the active role composition window id and effective per-role caps
- **AND** values match deterministic overlay results from enemy composition resolver
