## MODIFIED Requirements

### Requirement: Death scene

The system SHALL render death summary text in the active locale and present a concise recap that explains why the run ended and what build identity emerged.

#### Scenario: Death summary localized

- **WHEN** death scene is shown
- **THEN** summary labels, action labels, and rewards text are localized
- **AND** earned-upgrade names are localized
- **AND** recap labels and fallback text are localized

#### Scenario: Death scene uses DOM vertical slice

- **WHEN** death scene is active
- **THEN** death summary composition is rendered via DOM overlay in game area
- **AND** next-run and main-menu actions remain behaviorally equivalent

#### Scenario: Death recap surfaces run-ending cause and build identity

- **WHEN** death scene is shown after a completed run
- **THEN** the summary includes a player-facing death-cause line derived from the recorded run-ending reason
- **AND** the summary includes the run's strongest build-family leaning or a neutral fallback when no clear leaning exists
- **AND** the summary includes a concise list of notable run choices drawn from existing run selections

#### Scenario: Death recap stays concise across screen sizes

- **WHEN** death scene is shown on portrait mobile or desktop layouts
- **THEN** death-cause, build-identity, and notable-choice recap text remains readable without horizontal overflow
- **AND** the recap stacks or wraps without obscuring the primary score, rewards, or actions
