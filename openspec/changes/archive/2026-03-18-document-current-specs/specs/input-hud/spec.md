# input-hud

Input handling (touch, keyboard, DOM controls) and DOM HUD display.

## ADDED Requirements

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
- **THEN** hint-bar textContent is updated (e.g., "SWIPE OR D-PAD TO MOVE - PAUSE II")
