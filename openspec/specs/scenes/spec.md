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

The system SHALL include a pre-run relic draft scene or panel before entering gameplay.

#### Scenario: Menu start enters relic draft

- **WHEN** the player confirms run start from menu
- **THEN** the game transitions to relic draft instead of entering gameplay directly

#### Scenario: Draft selection enters gameplay

- **WHEN** the player selects one relic
- **THEN** gameplay starts with that relic in run context

### Requirement: Game scene

The system SHALL run gameplay loop: snake, food, powerups, enemies, collisions, floor progression, pause.

#### Scenario: Game receives optional score from Upgrade

- **WHEN** transitioning from Upgrade scene
- **THEN** Game receives { score, floor } and preserves score across floor transition

#### Scenario: Pause freezes movement

- **WHEN** user triggers pause (keyboard Space or virtualInput.pause)
- **THEN** paused=true, "PAUSED" text shown, update skips movement

#### Scenario: Floor clear transitions to Upgrade

- **WHEN** foodEaten >= foodToNextFloor
- **THEN** scene.start('Upgrade', { score, floor: gameState.floor })

#### Scenario: Death transitions to Death scene

- **WHEN** die() is called
- **THEN** particles spawn, 600ms delay, scene.start('Death', { score })

---

### Requirement: Upgrade scene

The system SHALL present 3 random upgrade choices; picking one adds to persistentUpgrades and continues to next floor.

#### Scenario: Three choices from pool

- **WHEN** Upgrade creates
- **THEN** 3 distinct upgrades are chosen randomly from UPGRADE_POOL

#### Scenario: Pick adds upgrade and advances floor

- **WHEN** user selects an upgrade (click/tap or keys 1/2/3)
- **THEN** persistentUpgrades.push(upgrade), floor++, scene.start('Game', { score })

#### Scenario: No double pick

- **WHEN** user has already picked
- **THEN** subsequent picks are ignored

---

### Requirement: Death scene

The system SHALL provide post-death routing options for both immediate continuation and menu return.

#### Scenario: Next run route

- **WHEN** player selects Next Run from death scene (or presses Enter/Space/Start)
- **THEN** run counter advances and the game transitions to relic draft

#### Scenario: Return to menu route

- **WHEN** player selects Main Menu from death scene (or presses `M`)
- **THEN** game transitions to Menu scene without starting a new run

