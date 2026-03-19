## ADDED Requirements

### Requirement: Accessibility visual preference controls

The system SHALL keep accessibility visual presets implemented and persistable while allowing dark-launch rollout.

#### Scenario: Accessibility visual preferences persist

- **WHEN** player enables or disables high contrast, large text, or reduced effects
- **THEN** preferences are stored locally
- **AND** preferences are restored on the next app launch

#### Scenario: Accessibility preferences support dark launch

- **WHEN** high-contrast/large-text/reduced-effects are dark-launched
- **THEN** menu UI does not expose those toggles
- **AND** runtime remains stable with those features forced off

### Requirement: Voice command to virtual input mapping

The system SHALL support optional voice commands that map to existing virtual input actions.

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
