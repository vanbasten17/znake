# gameplay

Core gameplay mechanics: snake movement, collision, food, powerups, enemies, floor progression.

## Purpose

Define the expected gameplay behavior for snake movement, combat interactions, progression, and power systems in Znake.
## Requirements
### Requirement: Snake movement

The system SHALL move the player snake by one cell per tick in the current direction, with queued inputs allowing up to 2 direction changes between moves.

#### Scenario: Direction cannot reverse

- **WHEN** the user inputs opposite of current direction (e.g., right when moving left)
- **THEN** the input is ignored

#### Scenario: Snake grows when eating food

- **WHEN** snake head moves onto food cell
- **THEN** pendingGrowth increments and tail is not popped for that move

#### Scenario: Snake shrinks when not growing

- **WHEN** snake moves and pendingGrowth is 0
- **THEN** tail segment is removed

### Requirement: Wall and self collision

The system SHALL end the run when snake hits wall or own body, unless ghost charge is consumed for wall wrap.

#### Scenario: Wall collision causes death

- **WHEN** snake head moves into wall (or out of bounds)
- **THEN** die() is called unless ghost charge available

#### Scenario: Ghost charge wraps through wall

- **WHEN** snake hits wall with ghostCharges > 0
- **THEN** head wraps to opposite edge, ghostCharges decrements, particles spawn

#### Scenario: Self collision causes death

- **WHEN** snake head moves onto own body (excluding head/tail)
- **THEN** die() is called

---

### Requirement: Food spawning and magnet

The system SHALL spawn food on safe cells; magnet upgrade draws food toward snake when within 4-cell Manhattan distance.

#### Scenario: Food spawns on safe cell

- **WHEN** food is spawned
- **THEN** cell is not wall, snake segment, or enemy segment

#### Scenario: Magnet moves food toward snake

- **WHEN** hasMagnet and food within 4-cell distance
- **THEN** food drifts one cell per frame toward snake head (without crossing walls)

---

### Requirement: Powerup spawning and effects

The system SHALL support a biome-exclusive collectible item with score and growth benefits.

#### Scenario: Core item spawns from biome rules

- **WHEN** food is consumed on eligible floors and biome spawn chance succeeds
- **THEN** a core item appears on a safe cell

#### Scenario: Core item collection grants biome bonus

- **WHEN** player collects biome core item
- **THEN** score increases and pending growth increments by configured biome bonuses

### Requirement: Enemy AI and collision

The system SHALL provide explicit feedback for lethal collision outcomes.

#### Scenario: Lethal collision emits crash cue

- **WHEN** player death reason is `wall`, `self`, or `enemy`
- **THEN** feedback system emits a dedicated `crash` cue
- **AND** the cue is distinct from generic success/confirm interactions

#### Scenario: Non-collision lethal hazard preserves danger cue

- **WHEN** player death reason is `rift`
- **THEN** feedback system keeps using `danger` cue semantics

### Requirement: Floor progression

The system SHALL support temporary hazard-pressure modulation through item interaction.

#### Scenario: Rift battery suppresses hazard window

- **WHEN** player collects a rift battery item
- **THEN** rift pressure is reduced or paused for configured duration

#### Scenario: Non-boss floors use timed portal objective

- **WHEN** a non-boss floor starts
- **THEN** a countdown runs for the active floor objective
- **AND** the active objective type is selected from a deterministic non-boss rotation pattern

#### Scenario: Rotation start varies per run

- **WHEN** a new run starts or restarts
- **THEN** the non-boss objective cycle start is randomized for that run
- **AND** objective order remains stable until the run ends

#### Scenario: Rotation objective can require score threshold

- **WHEN** the active non-boss objective type is `score`
- **THEN** floor completion requires reaching configured score target before timeout pressure defeats the player

#### Scenario: Rotation objective can require kill threshold

- **WHEN** the active non-boss objective type is `kills`
- **THEN** floor completion requires defeating a configured number of enemies
- **AND** enemy availability remains sufficient to make the objective completable

#### Scenario: Squeeze pressure activates after portal grace

- **WHEN** objective countdown and grace window expire without floor completion
- **THEN** map boundaries progressively shrink inward at configured intervals
- **AND** crossing squeeze boundaries is treated as lethal wall collision

#### Scenario: Boss floors keep defeat-to-advance objective

- **WHEN** current floor is a boss floor
- **THEN** progression remains tied to boss elimination
- **AND** timed portal objective is not required for that floor

### Requirement: Snake body render continuity

The system SHALL render snake head and all remaining body segments in every frame where those segments exist.

#### Scenario: Head render does not abort tail render

- **WHEN** drawFrame renders the head segment
- **THEN** rendering continues for all remaining segments without exiting the full frame draw

#### Scenario: Tail is visible after movement

- **WHEN** snake length is greater than one
- **THEN** at least one non-head body segment is visible in the rendered frame

### Requirement: Run modifiers from persistent meta

The system SHALL apply persistent talent effects and selected relic effects before in-run upgrade effects when composing run behavior.

#### Scenario: Talents affect run start

- **WHEN** gameplay initializes a new run
- **THEN** unlocked talent modifiers are applied before gameplay begins

#### Scenario: Relic affects run start

- **WHEN** gameplay initializes with a selected relic
- **THEN** relic modifiers are applied before in-run upgrade modifiers

