# game-core

Core domain types, constants, and persistent state for the znake roguelite.

## ADDED Requirements

### Requirement: Grid and visual constants

The system SHALL define immutable grid dimensions (20×16 cells, 20px per cell) and color palette for game entities (snake, food, walls, enemies, powerups).

#### Scenario: Canvas dimensions derived from grid

- **WHEN** the game initializes
- **THEN** canvas width is 400px (20×20) and height is 320px (16×20)

#### Scenario: Color palette is consistent

- **WHEN** any entity is rendered
- **THEN** it uses a color from the defined COLORS constant (snake, food, enemy, powerup, etc.)

---

### Requirement: Persistent game state

The system SHALL maintain cross-run game state (run number, total score, kills, floor, persistent upgrades) in memory for the current session.

#### Scenario: State resets on new run from menu

- **WHEN** the user starts a new run from the menu
- **THEN** run=1, totalScore=0, kills=0, floor=1, persistentUpgrades=[]

#### Scenario: State persists across floor clears

- **WHEN** the user completes a floor and picks an upgrade
- **THEN** floor increments and upgrade is appended to persistentUpgrades

#### Scenario: State carries to death summary

- **WHEN** the user dies
- **THEN** death screen displays kills and floor from gameState

---

### Requirement: Run configuration

The system SHALL support a per-run configuration (move interval, bonus length, shields, magnet, ghost charges, score multiplier, enemy slow, regen) that upgrades modify.

#### Scenario: Upgrades apply to run config

- **WHEN** GameScene creates with persistentUpgrades
- **THEN** each upgrade's apply() is called on the run config before gameplay starts

#### Scenario: Base config has sensible defaults

- **WHEN** no upgrades are selected
- **THEN** moveInterval=160ms, bonusStartLength=0, bonusShields=0, hasMagnet=false, ghostCharges=0, scoreMult=1, enemySlow=1, hasRegen=false

---

### Requirement: Upgrade definitions

The system SHALL define an upgrade pool with id, name, desc, icon, color, and apply function for each upgrade.

#### Scenario: Eight upgrades available

- **WHEN** upgrade pool is loaded
- **THEN** OVERCLOCK, BIOMASS, VOID SHIELD, ATTRACTOR, PHASE SHIFT, ECHO HARVEST, TIME RIFT, CELL REGEN are defined

#### Scenario: Upgrade apply mutates run config

- **WHEN** upgrade.apply(config) is called
- **THEN** the config is mutated (e.g., moveInterval reduced, bonusShields increased)
