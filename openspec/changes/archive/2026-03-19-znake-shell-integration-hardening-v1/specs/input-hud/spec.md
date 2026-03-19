## ADDED Requirements

### Requirement: Transition-safe virtual input state

The system SHALL expose a reset operation for virtual input state and use it during scene handoff.

#### Scenario: Reset clears pending commands

- **WHEN** transition reset is invoked
- **THEN** `virtualInput.dir` becomes `null`
- **AND** `virtualInput.start` and `virtualInput.pause` become `false`

#### Scenario: Reset is used before scene start

- **WHEN** a scene transition is initiated through shared flow helper
- **THEN** virtual input reset is executed before destination scene starts
- **AND** stale touch/swipe/button commands are not replayed in the new scene
