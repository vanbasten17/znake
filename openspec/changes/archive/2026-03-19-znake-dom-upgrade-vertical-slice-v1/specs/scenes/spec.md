## MODIFIED Requirements

### Requirement: Upgrade selection polished composition

The system SHALL render upgrade selection in a portrait-first polished composition aligned with the approved reference.

#### Scenario: Upgrade selection fits vertical layout

- **WHEN** floor-clear upgrade scene is shown
- **THEN** title, subtitle, and three upgrade cards fit without overlap
- **AND** card hit zones remain fully interactive

#### Scenario: Upgrade selection uses DOM vertical slice

- **WHEN** upgrade scene is active
- **THEN** upgrade selection content is rendered via DOM overlay in the game area
- **AND** scene behavior (pick flow, transitions, keyboard shortcuts) remains equivalent
