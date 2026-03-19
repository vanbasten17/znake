## ADDED Requirements

### Requirement: Portrait-first gameplay canvas

The system SHALL use a portrait-first internal game canvas ratio for mobile-oriented composition.

#### Scenario: Portrait ratio is active

- **WHEN** Phaser game is created
- **THEN** internal width/height ratio is portrait-oriented (height greater than width)
- **AND** run scenes can place gameplay and overlays without vertical overlap
