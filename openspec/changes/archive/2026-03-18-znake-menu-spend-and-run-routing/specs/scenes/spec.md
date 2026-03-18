## MODIFIED Requirements

### Requirement: Death scene

The system SHALL provide post-death routing options for both immediate continuation and menu return.

#### Scenario: Next run route

- **WHEN** player selects Next Run from death scene (or presses Enter/Space/Start)
- **THEN** run counter advances and the game transitions to relic draft

#### Scenario: Return to menu route

- **WHEN** player selects Main Menu from death scene (or presses `M`)
- **THEN** game transitions to Menu scene without starting a new run
