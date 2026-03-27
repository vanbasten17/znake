## ADDED Requirements

### Requirement: Data-driven mutator unlock breadth policy
The system SHALL resolve mutator availability from centralized goal-threshold policy rather than hardcoded single-goal checks.

#### Scenario: Any configured goal can satisfy unlock breadth policy
- **WHEN** profile goal progress meets at least one configured unlock threshold under `any` mode
- **THEN** mutator availability resolves as unlocked
- **AND** unlock decision remains deterministic from profile and balance inputs

### Requirement: Unlock policy remains deterministic and migration-safe
The system SHALL evaluate unlock policy safely when profile fields are partially initialized by migration/default paths.

#### Scenario: Missing or zeroed progress keeps gating stable
- **WHEN** profile goal progress fields are missing, defaulted, or below thresholds
- **THEN** mutator availability resolves as locked
- **AND** run startup remains deterministic without runtime exceptions
