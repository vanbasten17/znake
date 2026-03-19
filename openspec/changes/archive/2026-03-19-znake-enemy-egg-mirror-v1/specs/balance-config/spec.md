## MODIFIED Requirements

### Requirement: Central balance source

The system SHALL keep elite and item variety tuning in centralized balance tables.

#### Scenario: Elite variety knobs are centralized

- **WHEN** gameplay resolves elite spawn chance/kind
- **THEN** rules and weights are read from centralized balance config

#### Scenario: Item interaction knobs are centralized

- **WHEN** gameplay resolves rift battery spawn/effect duration
- **THEN** values are read from centralized balance config

#### Scenario: Modifier cadence knobs are centralized

- **WHEN** gameplay resolves darkness modifier activation and radius
- **THEN** start floor, cadence, and visibility radius are read from centralized balance config

#### Scenario: Enemy archetype knobs are centralized

- **WHEN** gameplay resolves Egg/Mirror spawn and behavior parameters
- **THEN** floor thresholds, spawn chances, and behavior values are read from centralized balance config
