## MODIFIED Requirements

### Requirement: Menu scene

The system SHALL include a pre-run relic draft scene or panel before entering gameplay.

#### Scenario: Menu start enters relic draft

- **WHEN** the player confirms run start from menu
- **THEN** the game transitions to relic draft instead of entering gameplay directly

#### Scenario: Draft selection enters gameplay

- **WHEN** the player selects one relic
- **THEN** gameplay starts with that relic in run context

### Requirement: Death scene

The system SHALL show a run summary that includes persistent reward outcome.

#### Scenario: Death screen shows reward

- **WHEN** a run ends
- **THEN** the summary includes currency earned and updated total currency
