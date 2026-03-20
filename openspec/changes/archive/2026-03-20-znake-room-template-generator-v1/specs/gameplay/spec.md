## ADDED Requirements

### Requirement: Room template floor generation

The system SHALL support a connected room/corridor floor template as a selectable alternative to classic wall scatter generation.

#### Scenario: Floor template is selected per floor setup

- **WHEN** a new floor starts
- **THEN** gameplay resolves a configured floor template (`classic` or `rooms_v1`)
- **AND** generation pipeline uses the selected template

#### Scenario: Room template guarantees connectivity

- **WHEN** `rooms_v1` template is used
- **THEN** room and corridor carving creates a connected playable area
- **AND** generated topology is validated before run start

#### Scenario: Invalid room generation falls back safely

- **WHEN** room template generation fails validation after bounded retries
- **THEN** system falls back to classic floor generation
- **AND** run proceeds without crash or soft-lock

#### Scenario: Spawn behavior respects room/corridor zones

- **WHEN** room template is active
- **THEN** food and enemy spawns use zone-aware placement heuristics
- **AND** spawn safety constraints remain equivalent to existing rules
