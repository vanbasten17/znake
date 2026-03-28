## ADDED Requirements

### Requirement: Deterministic runway boss cadence
The system SHALL provide a deterministic regular-floor runway where floors `1-9` remain non-boss progression and floor `10` is the first boss cadence milestone.

#### Scenario: Early runway excludes boss floor insertion
- **WHEN** run progression resolves floors `1` through `9`
- **THEN** those floors remain non-boss cadence floors
- **AND** boss progression insertion does not occur before floor `10`

#### Scenario: Boss milestone resolves on floor 10 cadence
- **WHEN** run progression resolves floor `10`
- **THEN** floor `10` is resolved as a boss cadence floor
- **AND** subsequent boss cadence milestones follow the same deterministic interval pattern
