## ADDED Requirements

### Requirement: Lightweight mutator availability progression

The system SHALL support lightweight deterministic mutator availability gating without introducing permanent stat inflation.

#### Scenario: Availability reads profile progression flags
- **WHEN** a run is prepared for mutator draft
- **THEN** mutator availability is filtered by persisted progression flags or milestones
- **AND** gating does not directly increase baseline combat stats

#### Scenario: Default profile remains valid
- **WHEN** profile data lacks mutator progression fields
- **THEN** runtime applies safe default mutator availability behavior
- **AND** run startup remains deterministic and migration-safe
