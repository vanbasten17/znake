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

The system SHALL expose localized labels and aria text for Start/Pause and movement controls.

#### Scenario: Control labels follow locale

- **WHEN** locale changes at startup
- **THEN** control text and aria labels reflect selected locale

#### Scenario: Control labels update after manual language switch

- **WHEN** player changes language from menu
- **THEN** Start/Pause labels and control aria text are updated to the selected locale

#### Scenario: Neutral bootstrap copy before i18n init

- **WHEN** app HTML is first painted before i18n initialization
- **THEN** HUD/control/hint placeholders are language-neutral
- **AND** localized copy replaces placeholders after i18n initializes

### Requirement: HUD display

The system SHALL keep HUD controls readable and reachable on mobile screen-edge devices with a portrait-first run shell.

#### Scenario: Bottom UI avoids home indicator overlap

- **WHEN** app runs on mobile devices with bottom safe-area inset
- **THEN** controls and hint bar apply additional bottom padding from safe-area env values

#### Scenario: Run shell uses 2/3 gameplay and 1/3 controls on touch devices

- **WHEN** control mode is touch and scene chrome is `run`
- **THEN** the run layout allocates roughly two-thirds of available vertical space to gameplay container
- **AND** allocates roughly one-third to control container
- **AND** keeps hint bar readable below controls

#### Scenario: Keyboard mode keeps gameplay priority

- **WHEN** control mode is keyboard
- **THEN** touch controls are hidden
- **AND** gameplay area expands instead of reserving control space

### Requirement: Adaptive control-mode selection

The system SHALL derive a control mode at runtime and apply UI behavior accordingly.

#### Scenario: Touch controls mode is selected

- **WHEN** runtime context indicates touch-first input and non-large screen
- **THEN** the system enables touch mode and exposes touch HUD controls

#### Scenario: Keyboard controls mode is selected

- **WHEN** runtime context does not match touch-first small-screen conditions
- **THEN** the system enables keyboard mode and hides touch HUD controls

### Requirement: Mode-aware hint messaging

The system SHALL present hint text consistent with active control mode and selected locale.

#### Scenario: Hints follow locale

- **WHEN** locale is English or Catalan
- **THEN** move/start/restart/upgrade hints are rendered in that locale

