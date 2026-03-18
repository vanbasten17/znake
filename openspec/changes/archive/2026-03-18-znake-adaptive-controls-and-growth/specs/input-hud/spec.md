## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: HUD display

The system SHALL display score, floor, kills, run number in DOM elements and a hint bar.

#### Scenario: HUD updates on score change

- **WHEN** updateHud(score) is called
- **THEN** score-disp, floor-disp, kills-disp, run-num reflect gameState

#### Scenario: Hint bar shows contextual text

- **WHEN** setHintText(text) is called
- **THEN** hint-bar textContent is updated with text matching the active control mode
