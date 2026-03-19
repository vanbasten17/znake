## MODIFIED Requirements

### Requirement: Relic draft polished composition

The system SHALL render relic selection in a portrait-first polished composition aligned with the approved reference.

#### Scenario: Relic selection fits vertical layout

- **WHEN** relic draft scene is shown
- **THEN** title, subtitle, and three relic cards fit without overlap
- **AND** card hit zones remain fully interactive

#### Scenario: Relic selection uses DOM vertical slice

- **WHEN** relic draft scene is active
- **THEN** relic selection content is rendered via DOM overlay in the game area
- **AND** scene behavior (pick flow, transitions, keyboard shortcuts) remains equivalent
