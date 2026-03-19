## MODIFIED Requirements

### Requirement: Swipe input

The system SHALL map touch swipe gestures to directional input (up/down/left/right).

#### Scenario: Sufficient swipe sets direction

- **WHEN** user swipes with distance >= 15px
- **THEN** virtualInput.dir is set to dominant axis direction

#### Scenario: Short tap is ignored

- **WHEN** touch distance < 15px
- **THEN** virtualInput.dir remains null

#### Scenario: Swipe direction is disabled in touch quadrant mode

- **WHEN** touch mode uses quadrant tap controls
- **THEN** swipe gestures do not enqueue direction changes

### Requirement: D-pad buttons

The system SHALL map DOM d-pad buttons (btn-up, btn-down, btn-left, btn-right) to virtualInput.dir.

#### Scenario: Button press sets direction

- **WHEN** user taps or clicks a d-pad button
- **THEN** virtualInput.dir is set to that direction and pressed class is applied

#### Scenario: Release clears pressed state

- **WHEN** user releases or leaves button
- **THEN** pressed class is removed

#### Scenario: Quadrant tap pad sets direction by dominant axis

- **WHEN** user taps inside gameplay area during run gameplay
- **THEN** input compares tap position against the two gameplay-area diagonals
- **AND** direction is resolved by triangular region (`up`, `down`, `left`, `right`)
- **AND** virtualInput.dir is updated with resolved direction

#### Scenario: Touch controls area is not reserved in run shell

- **WHEN** run shell is rendered in touch mode
- **THEN** no dedicated directional/action control panel is shown below gameplay
- **AND** gameplay area uses the available run content height for touch directional taps

#### Scenario: Bottom hint bar is omitted in mobile-first shell

- **WHEN** shell is mounted for gameplay
- **THEN** no persistent bottom hint bar is rendered
- **AND** gameplay content extends to the lower edge of the shell content area

#### Scenario: Touch hint copy reflects quadrant controls

- **WHEN** control mode is touch and locale is applied
- **THEN** movement hint text references tap/quadrant movement instead of swipe/D-pad
