# scenes

Phaser scene flow and lifecycle (Menu, Game, Upgrade, Death).

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

The system SHALL display title, best score, and wait for start input to begin a new run.

#### Scenario: Best score from localStorage

- **WHEN** Menu creates
- **THEN** best score is read from znake_best or serpent_best (legacy)

#### Scenario: Start begins run

- **WHEN** user presses Enter, Space, or virtualInput.start
- **THEN** gameState is reset, scene transitions to Game

---

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

The system SHALL show score, floor, kills, best; update localStorage best; offer new run.

#### Scenario: Best score persisted

- **WHEN** Death creates with score
- **THEN** best = max(score, stored best), localStorage.znake_best updated

#### Scenario: New run from death

- **WHEN** user triggers start (Enter/Space/virtualInput.start)
- **THEN** gameState.run++, kills=0, floor=1, persistentUpgrades=[], scene.start('Game')

#### Scenario: Upgrades earned displayed

- **WHEN** persistentUpgrades is non-empty
- **THEN** "UPGRADES EARNED:" and list of upgrade icons/names shown
