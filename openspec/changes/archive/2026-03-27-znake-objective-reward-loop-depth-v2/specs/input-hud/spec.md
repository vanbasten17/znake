## MODIFIED Requirements

### Requirement: Active objective readability

The system SHALL show the active room objective in the run HUD with enough clarity for the player to understand the current goal at a glance and SHALL prioritize objective-complete/reward-ready messaging over secondary cue text during reward-decision windows.

#### Scenario: HUD shows active objective summary

- **WHEN** a run segment is active
- **THEN** the HUD shows the current objective label
- **AND** the label reflects the configured target for that objective

#### Scenario: HUD updates objective progress

- **WHEN** objective progress changes during the segment
- **THEN** the HUD updates the displayed progress or remaining amount
- **AND** the change is visible without opening a separate menu

#### Scenario: Reward-pending state prioritizes objective-complete readability

- **WHEN** objective completion transitions into reward-pending state
- **THEN** objective HUD messaging prioritizes objective-complete/reward-ready context
- **AND** secondary tactical cue concatenation does not obscure the reward-ready call-to-action

### Requirement: Reward choice presentation

The system SHALL present a minimal reward-choice prompt after objective completion with clear contrast and decision framing.

#### Scenario: Reward prompt appears on completion

- **WHEN** objective completion triggers a reward draft
- **THEN** the player is shown a reward-choice overlay or equivalent prompt
- **AND** the prompt displays multiple reward options

#### Scenario: Reward prompt explains tradeoffs

- **WHEN** reward options are presented
- **THEN** each option shows both its upside and downside in player-facing copy
- **AND** the player can choose one option with existing keyboard or touch interaction patterns

#### Scenario: Reward prompt supports fast upside/downside scanning

- **WHEN** the reward overlay is visible
- **THEN** option rows provide explicit upside/downside framing labels or equivalent readable structure
- **AND** visual contrast between option container and text remains legible across supported accessibility visual presets
