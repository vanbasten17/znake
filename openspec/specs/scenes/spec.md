# scenes

Phaser scene flow and lifecycle (Menu, Game, Upgrade, Death).

## Purpose

Define expected scene sequencing, transitions, and lifecycle responsibilities for core gameplay flow.
## Requirements
### Requirement: Scene order and bootstrap

The system SHALL register scenes in order Menu → Game → Upgrade → Death and start with Menu.

#### Scenario: Phaser starts with Menu

- **WHEN** createGame() is called
- **THEN** scene order is [MenuScene, GameScene, UpgradeScene, DeathScene] and Menu is first active

#### Scenario: Pixel art rendering

- **WHEN** Phaser game is created
- **THEN** antialias=false, pixelArt=true, scale mode FIT, centered

---

### Requirement: Menu scene

The system SHALL support a reference-driven polished menu visual identity without changing menu behavior.

#### Scenario: Menu visual language matches reference

- **WHEN** menu scene is rendered
- **THEN** hero title, stat strip, talent rows, goals, and start CTA use a cohesive neon-grid style aligned to the provided design reference
- **AND** composition avoids text overlap on portrait-first dimensions

#### Scenario: Menu behavior remains stable

- **WHEN** player uses menu interactions (start, talent unlock, goal claim, language switch)
- **THEN** all interactions behave equivalently to pre-redesign behavior

### Requirement: Game scene

The system SHALL render gameplay UI text in the active locale.

#### Scenario: Biome name localized in-game

- **WHEN** game scene updates floor progress label
- **THEN** biome name is rendered in the selected locale

### Requirement: Upgrade scene

The system SHALL render upgrade UI text in the active locale.

#### Scenario: Upgrade scene localized

- **WHEN** upgrade scene is shown
- **THEN** floor-cleared and upgrade-choice labels are localized
- **AND** upgrade card names and descriptions are localized

### Requirement: Death scene

The system SHALL render death summary text in the active locale.

#### Scenario: Death summary localized

- **WHEN** death scene is shown
- **THEN** summary labels, action labels, and rewards text are localized
- **AND** earned-upgrade names are localized

### Requirement: Relic draft polished composition

The system SHALL render relic selection in a portrait-first polished composition aligned with the approved reference.

#### Scenario: Relic selection fits vertical layout

- **WHEN** relic draft scene is shown
- **THEN** title, subtitle, and three relic cards fit without overlap
- **AND** card hit zones remain fully interactive

#### Scenario: Relic selection uses DOM vertical slice

- **WHEN** relic draft scene is active
- **THEN** relic selection content is rendered via DOM overlay in the game area
- **AND** scene behavior (pick flow, transitions, keyboard shortcuts) remains equivalent

### Requirement: Upgrade selection polished composition

The system SHALL render upgrade selection in a portrait-first polished composition aligned with the approved reference.

#### Scenario: Upgrade selection fits vertical layout

- **WHEN** floor-clear upgrade scene is shown
- **THEN** title, subtitle, and three upgrade cards fit without overlap
- **AND** card hit zones remain fully interactive

