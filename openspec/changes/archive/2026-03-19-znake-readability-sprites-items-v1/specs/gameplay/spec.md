## ADDED Requirements

### Requirement: Gameplay entity visual readability

The system SHALL provide distinct visual signatures for core gameplay entities without changing gameplay mechanics.

#### Scenario: Snake silhouette hierarchy remains clear in motion

- **WHEN** snake is rendered while moving
- **THEN** head and body segments remain visually distinguishable at a glance
- **AND** body continuity remains readable across turns and high-speed states

#### Scenario: Pickups and hazards are visually separable

- **WHEN** food, powerups, biome items, and hazards are present simultaneously
- **THEN** each category has a distinct shape/contrast cue
- **AND** players can visually differentiate collectibles from lethal elements without relying on memory

#### Scenario: Obstacle readability remains stable during pressure phases

- **WHEN** squeeze/pressure or portal states are active
- **THEN** walls, squeeze boundaries, and portal cues remain visually legible
- **AND** readability improvements do not alter collision rules

#### Scenario: Readability layer remains compatible with future PNG sprite pipeline

- **WHEN** project evolves from procedural canvas glyphs to authored PNG sprite assets
- **THEN** gameplay entity semantics (food, portal, hazards, powerups, enemies, snake hierarchy) remain consistent
- **AND** sprite-asset migration can replace current visual primitives without changing gameplay rules
