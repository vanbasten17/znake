# game-core

Core domain types, constants, and persistent state for the znake roguelite.

## Purpose

Define the foundational domain contracts for constants, shared state, and run configuration behavior.
## Requirements
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

The runtime SHALL capture replay-ready run metadata for deterministic debugging.

#### Scenario: Run capture starts with seed

- **WHEN** a run starts
- **THEN** runtime initializes replay capture with the resolved run seed
- **AND** capture timeline starts at run-begin

#### Scenario: Input intents are appended in order

- **WHEN** gameplay accepts input intents (direction, turn, ability, pause)
- **THEN** each accepted intent is appended to replay capture with relative timestamp
- **AND** event ordering is preserved for reproducibility

### Requirement: Run configuration

The system SHALL provide deterministic randomness primitives for gameplay systems that depend on random decisions.

#### Scenario: Seeded RNG drives extracted simulation systems

- **WHEN** a run starts
- **THEN** the runtime initializes a seeded RNG instance for simulation helpers
- **AND** extracted simulation modules consume that RNG instead of direct `Math.random()` usage

#### Scenario: Same seed reproduces same simulation decisions

- **WHEN** the same seed and equivalent simulation inputs are used
- **THEN** extracted simulation functions produce equivalent random decisions and outputs

### Requirement: Upgrade definitions

The system SHALL define an upgrade pool with id, name, desc, icon, color, and apply function for each upgrade.

#### Scenario: Eight upgrades available

- **WHEN** upgrade pool is loaded
- **THEN** OVERCLOCK, BIOMASS, VOID SHIELD, ATTRACTOR, PHASE SHIFT, ECHO HARVEST, TIME RIFT, CELL REGEN are defined

#### Scenario: Upgrade apply mutates run config

- **WHEN** upgrade.apply(config) is called
- **THEN** the config is mutated (e.g., moveInterval reduced, bonusShields increased)

