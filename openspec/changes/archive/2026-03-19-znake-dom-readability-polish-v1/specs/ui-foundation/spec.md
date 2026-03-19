## ADDED Requirements

### Requirement: DOM readability token hierarchy

The system SHALL expose a consistent readability-oriented token hierarchy for DOM overlay text.

#### Scenario: Text hierarchy tokens are available

- **WHEN** overlay styles are loaded
- **THEN** shared tokens provide primary, secondary, and tertiary text levels
- **AND** overlays can apply consistent contrast without ad-hoc literals

#### Scenario: Baseline text rendering improves legibility

- **WHEN** app UI is rendered in modern mobile/desktop browsers
- **THEN** global text rendering and smoothing defaults improve readability
- **AND** existing layout behavior remains unchanged
