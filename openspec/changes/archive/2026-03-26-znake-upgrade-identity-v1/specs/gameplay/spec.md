## MODIFIED Requirements

### Requirement: Run modifiers from persistent meta

The system SHALL apply persistent talent effects and selected relic effects before in-run upgrade effects when composing run behavior, and in-run upgrades SHALL be able to alter timing, routing, zoning, or recovery rules.

#### Scenario: Talents affect run start

- **WHEN** gameplay initializes a new run
- **THEN** unlocked talent modifiers are applied before gameplay begins

#### Scenario: Relic affects run start

- **WHEN** gameplay initializes with a selected relic
- **THEN** relic modifiers are applied before in-run upgrade modifiers

#### Scenario: Identity upgrades affect space decisions

- **WHEN** a run starts after one or more in-run upgrades have been selected
- **THEN** the resulting run config can change movement pressure, map control, or recovery behavior
- **AND** at least some upgrades influence routing, timing, or body-management decisions during play
