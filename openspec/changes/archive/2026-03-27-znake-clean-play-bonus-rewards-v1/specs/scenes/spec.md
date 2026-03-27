## MODIFIED Requirements

### Requirement: Death scene

The system SHALL render death summary text in the active locale and include concise clean-play recap context derived from resolved run data.

#### Scenario: Death summary localized

- **WHEN** death scene is shown
- **THEN** summary labels, action labels, and rewards text are localized
- **AND** earned-upgrade names are localized

#### Scenario: Death scene uses DOM vertical slice

- **WHEN** death scene is active
- **THEN** death summary composition is rendered via DOM overlay in game area
- **AND** next-run and main-menu actions remain behaviorally equivalent

#### Scenario: Death recap surfaces clean-play bonus summary

- **WHEN** death scene is shown after one or more completed objectives in a run
- **THEN** recap includes a concise clean-play summary based on resolved objective outcomes
- **AND** recap can communicate clean clear count and total clean-play bonus payout with readable fallback text when none were earned
