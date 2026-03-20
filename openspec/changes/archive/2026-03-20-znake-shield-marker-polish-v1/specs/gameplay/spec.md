## MODIFIED Requirements

### Requirement: Gameplay entity visual readability

The system SHALL provide distinct visual signatures for core gameplay entities without changing gameplay mechanics.

#### Scenario: Shield pickup marker remains instantly recognizable at small sizes

- **WHEN** shield marker is rendered in guide and gameplay
- **THEN** icon silhouette and interior emblem remain legible on small mobile scales
- **AND** visual polish does not alter gameplay behavior

### Requirement: Developer scenario bootstrap

The system SHALL support deterministic debug scenario bootstrap for fast smoke testing.

#### Scenario: Reference board scenario renders static gameplay catalog

- **WHEN** `GameScene` starts with `devScenarioId=reference_board`
- **THEN** gameplay simulation stays paused/frozen for snake/enemy/objective loops
- **AND** scene shows representative gameplay elements (snake, walls, hazards, pickups, enemies) on one board
- **AND** mouse hover on a reference element reveals its label for development QA
