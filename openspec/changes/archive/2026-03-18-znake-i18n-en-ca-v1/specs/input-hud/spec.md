## MODIFIED Requirements

### Requirement: Mode-aware hint messaging

The system SHALL present hint text consistent with active control mode and selected locale.

#### Scenario: Hints follow locale

- **WHEN** locale is English or Catalan
- **THEN** move/start/restart/upgrade hints are rendered in that locale

### Requirement: Action buttons

The system SHALL expose localized labels and aria text for Start/Pause and movement controls.

#### Scenario: Control labels follow locale

- **WHEN** locale changes at startup
- **THEN** control text and aria labels reflect selected locale

#### Scenario: Control labels update after manual language switch

- **WHEN** player changes language from menu
- **THEN** Start/Pause labels and control aria text are updated to the selected locale

#### Scenario: Neutral bootstrap copy before i18n init

- **WHEN** app HTML is first painted before i18n initialization
- **THEN** HUD/control/hint placeholders are language-neutral
- **AND** localized copy replaces placeholders after i18n initializes
