## ADDED Requirements

### Requirement: Runtime UI shell mount

The system SHALL create the shared HUD/gameplay/controls shell structure at runtime before gameplay systems bind DOM behavior.

#### Scenario: Shell contract is mounted before system setup

- **WHEN** app bootstrap starts
- **THEN** runtime shell markup is created before input and i18n setup
- **AND** all existing shell hook IDs (`hud`, `game-area`, `phaser-container`, `controls`, `hint-bar`) exist in the DOM

#### Scenario: Runtime shell preserves styling contract

- **WHEN** shell CSS is applied
- **THEN** runtime-mounted nodes expose the same IDs/classes as the previous static markup
- **AND** existing shell/tokens styles render without selector rewrites
