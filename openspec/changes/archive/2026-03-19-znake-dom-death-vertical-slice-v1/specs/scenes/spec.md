## MODIFIED Requirements

### Requirement: Death scene

The system SHALL render death summary text in the active locale.

#### Scenario: Death summary localized

- **WHEN** death scene is shown
- **THEN** summary labels, action labels, and rewards text are localized
- **AND** earned-upgrade names are localized

#### Scenario: Death scene uses DOM vertical slice

- **WHEN** death scene is active
- **THEN** death summary composition is rendered via DOM overlay in game area
- **AND** next-run and main-menu actions remain behaviorally equivalent
