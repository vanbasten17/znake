# input-hud

Input handling (touch, keyboard, DOM controls) and DOM HUD display.

## Purpose

Define how player input is captured across platforms and how HUD/UI feedback is presented.
## Requirements
### Requirement: Virtual input bridge

The system SHALL expose a virtualInput object (dir, start, pause) on window for DOM and touch to communicate with Phaser scenes.

#### Scenario: Virtual input is globally available

- **WHEN** app loads
- **THEN** window.virtualInput exists with dir: null, start: false, pause: false

#### Scenario: Direction is consumed per frame

- **WHEN** GameScene update reads window.virtualInput.dir
- **THEN** it sets dir to null after applying to prevent repeat

---

### Requirement: Swipe input

The system SHALL map touch swipe gestures to directional input (up/down/left/right).

#### Scenario: Sufficient swipe sets direction

- **WHEN** user swipes with distance >= 15px
- **THEN** virtualInput.dir is set to dominant axis direction

#### Scenario: Short tap is ignored

- **WHEN** touch distance < 15px
- **THEN** virtualInput.dir remains null

---

### Requirement: D-pad buttons

The system SHALL map DOM d-pad buttons (btn-up, btn-down, btn-left, btn-right) to virtualInput.dir.

#### Scenario: Button press sets direction

- **WHEN** user taps or clicks a d-pad button
- **THEN** virtualInput.dir is set to that direction and pressed class is applied

#### Scenario: Release clears pressed state

- **WHEN** user releases or leaves button
- **THEN** pressed class is removed

---

### Requirement: Action buttons

The system SHALL map Start and Pause buttons to virtualInput.start and virtualInput.pause.

#### Scenario: Pause button sets pause flag

- **WHEN** user taps btn-pause
- **THEN** virtualInput.pause = true

#### Scenario: Start button sets start flag

- **WHEN** user taps btn-start
- **THEN** virtualInput.start = true

---

### Requirement: HUD display

The system SHALL display score, floor, kills, run number in DOM elements and a hint bar.

#### Scenario: HUD updates on score change

- **WHEN** updateHud(score) is called
- **THEN** score-disp, floor-disp, kills-disp, run-num reflect gameState

#### Scenario: Hint bar shows contextual text

- **WHEN** setHintText(text) is called
- **THEN** hint-bar textContent is updated with text matching the active control mode

### Requirement: Adaptive control-mode selection

The system SHALL derive a control mode at runtime and apply UI behavior accordingly.

#### Scenario: Touch controls mode is selected

- **WHEN** runtime context indicates touch-first input and non-large screen
- **THEN** the system enables touch mode and exposes touch HUD controls

#### Scenario: Keyboard controls mode is selected

- **WHEN** runtime context does not match touch-first small-screen conditions
- **THEN** the system enables keyboard mode and hides touch HUD controls

### Requirement: Mode-aware hint messaging

The system SHALL present hint text consistent with the active control mode.

#### Scenario: Keyboard hint text shown

- **WHEN** keyboard mode is active
- **THEN** move/start/restart/upgrade hints reference keyboard controls (arrows/WASD, Enter/Space)

#### Scenario: Touch hint text shown

- **WHEN** touch mode is active
- **THEN** move/start/restart/upgrade hints reference swipe, d-pad, and start button behavior

