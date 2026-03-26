## MODIFIED Requirements

### Requirement: Room template floor generation

The system SHALL keep floor layout generation and spawn-safe candidate resolution in pure simulation modules, while `GameScene` orchestrates calls and rendering side effects.

#### Scenario: Scene orchestrates pure floor generation

- **WHEN** a floor starts
- **THEN** `GameScene` delegates layout generation and validation to simulation-layer functions
- **AND** the delegated functions do not import Phaser, DOM, or global browser APIs

#### Scenario: Scene orchestrates pure spawn candidate selection

- **WHEN** food/powerup/portal/enemy spawn cell selection is needed
- **THEN** `GameScene` delegates candidate resolution to simulation-layer helpers
- **AND** scene remains responsible for applying resulting entities to runtime state and visual updates only
