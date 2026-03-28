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
The system SHALL define an upgrade pool with id, family, name, desc, icon, color, gameplay-purpose metadata, and apply function for each upgrade.

#### Scenario: Family-based upgrade catalog is available

- **WHEN** upgrade pool is loaded
- **THEN** it contains an initial family-based pool for Aggro, Control, and Survival
- **AND** each family has 2 to 4 upgrades with distinct behavioral purpose

#### Scenario: Upgrade apply mutates run config

- **WHEN** upgrade.apply(config) is called
- **THEN** the config is mutated through centralized run-config fields
- **AND** family-specific effects remain independent from rendering code

### Requirement: Body economy run configuration contracts
The system SHALL expose deterministic run configuration fields for body economy sinks and guards.

#### Scenario: Run config includes sink tuning fields
- **WHEN** run configuration is initialized
- **THEN** it includes body pulse and reward overclock tuning fields (cost, cooldown/limit, duration where applicable)
- **AND** fields are available to simulation helpers without scene coupling

#### Scenario: Run config includes shared spend floor
- **WHEN** run configuration is initialized
- **THEN** it includes minimum spendable body length floor used by all body spend sinks
- **AND** default values preserve stable gameplay when body economy is not actively used

### Requirement: Deterministic body economy runtime state
The system SHALL maintain deterministic runtime state for body economy cooldown and reward-window usage.

#### Scenario: Seed and equal inputs reproduce body economy state transitions
- **WHEN** two runs share seed and equivalent spend inputs
- **THEN** body economy cooldown and usage transitions occur in equivalent order
- **AND** resulting segment counts and sink availability are equivalent

#### Scenario: Reward overclock usage resets on new objective completion window
- **WHEN** reward selection begins for a new completed objective
- **THEN** reward overclock usage state resets for that window
- **AND** previous window usage does not leak into subsequent reward windows

### Requirement: Central unlock policy contracts
The system SHALL define deterministic unlock-policy configuration for progression-gated meta features.

#### Scenario: Unlock policy map is centrally authored
- **WHEN** runtime resolves progression-gated feature availability
- **THEN** goal identifiers, thresholds, and unlock mode are read from centralized balance config
- **AND** call sites do not hardcode per-feature goal checks inline

### Requirement: Runtime content-pack contract resolves deterministically

The system SHALL resolve a content-pack definition at run start with deterministic fallback behavior.

#### Scenario: Unknown content-pack id falls back safely
- **WHEN** run start context requests an unknown content-pack id
- **THEN** runtime resolves the base content-pack contract
- **AND** run initialization remains deterministic and non-blocking

### Requirement: Latest replay snapshot persists as bounded run artifact

The system SHALL persist the latest replay snapshot using bounded metadata and input events.

#### Scenario: Run end writes replay snapshot for ghost/debug surfaces
- **WHEN** a run ends with available replay capture
- **THEN** runtime stores replay snapshot with seed, preset, floor, score, death reason, and bounded input events
- **AND** snapshot persistence does not alter gameplay resolution

### Requirement: Content selectors are modular and deterministic

Game-core SHALL keep content selector internals modular while preserving deterministic outcomes.

#### Scenario: Selector internals are extracted without behavior drift
- **WHEN** selector code is moved to dedicated helpers
- **THEN** public selector outcomes remain deterministic for equivalent inputs

### Requirement: Content selection helpers remain deterministic after refactor

Game-core content selection helpers SHALL preserve deterministic outcomes for equivalent inputs after internal refactors.

#### Scenario: Powerup and special-enemy picks preserve deterministic behavior
- **WHEN** helper internals are extracted/reorganized
- **THEN** returned picks for equivalent RNG sequences and floor inputs SHALL remain stable
- **AND** behavior SHALL be covered by automated deterministic tests

### Requirement: Replay payloads include explicit version tags

The system SHALL enforce this contract as part of the znake-simulation-replay-version-tag-contract-v1 scope.

#### Scenario: Contract is applied
- **WHEN** the relevant runtime or UI path executes
- **THEN** the defined contract behavior is applied consistently
- **AND** deterministic simulation behavior remains unchanged.



## ADDED Requirements

### Requirement: Core gameplay identifiers are centrally declared

The system SHALL provide a shared registry for core gameplay identifiers used across modules.

#### Scenario: Systems reuse shared identifier constants
- **WHEN** gameplay modules need known IDs (direction/enemy/powerup)
- **THEN** they use shared constants/types rather than ad-hoc literals
- **AND** behavior remains equivalent to prior contracts.
