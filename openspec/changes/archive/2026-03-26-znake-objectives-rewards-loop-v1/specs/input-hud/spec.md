## ADDED Requirements

### Requirement: Active objective readability

The system SHALL show the active room objective in the run HUD with enough clarity for the player to understand the current goal at a glance.

#### Scenario: HUD shows active objective summary

- **WHEN** a run segment is active
- **THEN** the HUD shows the current objective label
- **AND** the label reflects the configured target for that objective

#### Scenario: HUD updates objective progress

- **WHEN** objective progress changes during the segment
- **THEN** the HUD updates the displayed progress or remaining amount
- **AND** the change is visible without opening a separate menu

### Requirement: Reward choice presentation

The system SHALL present a minimal reward-choice prompt after objective completion.

#### Scenario: Reward prompt appears on completion

- **WHEN** objective completion triggers a reward draft
- **THEN** the player is shown a reward-choice overlay or equivalent prompt
- **AND** the prompt displays multiple reward options

#### Scenario: Reward prompt explains tradeoffs

- **WHEN** reward options are presented
- **THEN** each option shows both its upside and downside in player-facing copy
- **AND** the player can choose one option with existing keyboard or touch interaction patterns
