## MODIFIED Requirements

### Requirement: Voice command to virtual input mapping

The system SHALL support optional voice commands that map to existing virtual input actions with explicit UX state and command feedback.

#### Scenario: Directional voice commands enqueue movement

- **WHEN** voice input is enabled and recognized command is `up`, `down`, `left`, or `right`
- **THEN** `window.virtualInput.dir` is set to the corresponding direction

#### Scenario: Utility voice commands map to action buttons

- **WHEN** voice input is enabled and recognized command is `pause` or `start`
- **THEN** corresponding `window.virtualInput.pause` or `window.virtualInput.start` flag is set

#### Scenario: Unsupported speech API degrades gracefully

- **WHEN** browser speech recognition is unavailable
- **THEN** voice mode is shown as unavailable
- **AND** no runtime errors are thrown

#### Scenario: Voice runtime status is explicit for UX

- **WHEN** voice input transitions between unavailable, denied, disabled, and active listening states
- **THEN** a stable status value is exposed for UI rendering
- **AND** keyboard/touch/swipe behavior remains unchanged

#### Scenario: Voice command acceptance/rejection emits short feedback

- **WHEN** transcript is processed
- **THEN** recognized commands produce short accepted feedback
- **AND** unrecognized non-empty transcripts produce short rejected feedback
