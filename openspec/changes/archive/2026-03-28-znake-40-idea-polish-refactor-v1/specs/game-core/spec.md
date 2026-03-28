## ADDED Requirements

### Requirement: Content selection helpers remain deterministic after refactor

Game-core content selection helpers SHALL preserve deterministic outcomes for equivalent inputs after internal refactors.

#### Scenario: Powerup and special-enemy picks preserve deterministic behavior
- **WHEN** helper internals are extracted/reorganized
- **THEN** returned picks for equivalent RNG sequences and floor inputs SHALL remain stable
- **AND** behavior SHALL be covered by automated deterministic tests.
