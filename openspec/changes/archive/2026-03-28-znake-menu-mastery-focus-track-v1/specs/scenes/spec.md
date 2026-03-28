## ADDED Requirements

### Requirement: Rotating mastery focus in menu

The system SHALL show one deterministic rotating mastery-focus line in menu derived from existing goal progress state.

#### Scenario: Menu renders focus goal with current status
- **WHEN** menu overlay is rendered
- **THEN** one focus goal is selected deterministically from existing progression goals
- **AND** focus line includes claimed/ready/progress status context

#### Scenario: Focus surface does not replace full goals list
- **WHEN** focus line is shown
- **THEN** full goal list remains available in menu
- **AND** claim interactions remain behaviorally unchanged
