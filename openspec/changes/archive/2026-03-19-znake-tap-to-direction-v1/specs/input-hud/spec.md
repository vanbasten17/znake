## MODIFIED Requirements

### Requirement: Virtual input bridge

The system SHALL expose a virtualInput object (dir, start, pause) on window for DOM and touch to communicate with Phaser scenes.

#### Scenario: Virtual input is globally available

- **WHEN** app loads
- **THEN** window.virtualInput exists with dir: null, start: false, pause: false

#### Scenario: Direction is consumed per frame

- **WHEN** GameScene update reads window.virtualInput.dir
- **THEN** it sets dir to null after applying to prevent repeat

#### Scenario: Swipe direction is exposed for touch steering

- **WHEN** touch swipe input is used on gameplay area
- **THEN** virtualInput includes absolute direction intent (`left`/`right`/`up`/`down`)
- **AND** GameScene can consume and clear it per frame

### Requirement: D-pad buttons

The system SHALL map DOM d-pad buttons (btn-up, btn-down, btn-left, btn-right) to virtualInput.dir.

#### Scenario: Horizontal swipe emits absolute horizontal direction

- **WHEN** user performs a horizontal-dominant swipe on gameplay area
- **THEN** swipe right emits `dir=right`
- **AND** swipe left emits `dir=left`

#### Scenario: Vertical swipe emits absolute direction

- **WHEN** user performs a vertical-dominant swipe on gameplay area
- **THEN** swipe up emits `dir=up`
- **AND** swipe down emits `dir=down`

#### Scenario: Short swipe is ignored

- **WHEN** swipe is below minimum distance
- **THEN** no movement intent is emitted
