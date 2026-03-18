## MODIFIED Requirements

### Requirement: Menu scene

The system SHALL render menu text in the active locale.

#### Scenario: Menu texts localized

- **WHEN** menu scene is created
- **THEN** title/subtitle, best-score line, talent-shop prompt, and start prompt are localized

#### Scenario: Talent labels localized in menu

- **WHEN** menu scene renders talent rows
- **THEN** talent names and prerequisite labels are rendered in the selected locale

#### Scenario: Player can switch locale in menu

- **WHEN** player triggers the language toggle in the menu
- **THEN** menu text is re-rendered in the new locale
- **AND** selected locale is persisted for next app load

#### Scenario: Relic card name/description localized

- **WHEN** relic draft scene is shown
- **THEN** each relic card name and description is rendered in the selected locale

### Requirement: Upgrade scene

The system SHALL render upgrade UI text in the active locale.

#### Scenario: Upgrade scene localized

- **WHEN** upgrade scene is shown
- **THEN** floor-cleared and upgrade-choice labels are localized
- **AND** upgrade card names and descriptions are localized

### Requirement: Death scene

The system SHALL render death summary text in the active locale.

#### Scenario: Death summary localized

- **WHEN** death scene is shown
- **THEN** summary labels, action labels, and rewards text are localized
- **AND** earned-upgrade names are localized

### Requirement: Game scene

The system SHALL render gameplay UI text in the active locale.

#### Scenario: Biome name localized in-game

- **WHEN** game scene updates floor progress label
- **THEN** biome name is rendered in the selected locale
