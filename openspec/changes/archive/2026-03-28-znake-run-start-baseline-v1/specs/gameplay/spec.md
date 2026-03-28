## ADDED Requirements

### Requirement: Run-start snake length composition
The system SHALL compose run-start snake length deterministically as `baseSnakeLength + bonusStartLength`, where baseline and progression bonuses remain independently tunable.

#### Scenario: Baseline run starts at head plus two body segments
- **WHEN** a run starts with no unlocked talents, relic modifiers, or reward/start-length bonuses
- **THEN** run-start snake length resolves from centralized baseline config as `3`
- **AND** resulting spawned snake contains exactly three segments

#### Scenario: Bonus stacking remains additive on top of baseline
- **WHEN** run config includes one or more additive start-length bonuses from progression systems
- **THEN** final run-start snake length resolves as baseline plus the summed additive bonuses
- **AND** no multiplicative or scene-local override path changes that composition
