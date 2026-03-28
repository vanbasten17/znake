## ADDED Requirements

### Requirement: Shared DOM overlay primitives for scene surfaces

The system SHALL provide shared DOM overlay/card composition primitives for scene-level overlays to reduce duplication and keep interaction patterns consistent.

#### Scenario: Scene overlays compose from shared primitives

- **WHEN** menu/game/upgrade/relic/death scenes build card-oriented overlays
- **THEN** overlays are composed from shared primitives for panel, card, title/subtitle, and action rows
- **AND** scene-specific behavior remains parameterized rather than duplicated

#### Scenario: Shared primitives preserve existing readability and interaction contracts

- **WHEN** overlays migrate to shared primitives
- **THEN** accessibility/readability hierarchy remains intact across supported layouts
- **AND** click/tap/keyboard behavior remains equivalent to current scene flows unless explicitly changed
