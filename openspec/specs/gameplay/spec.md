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

The system SHALL support biome-exclusive enemy variants and mini-boss behavior in addition to baseline enemies.

#### Scenario: Stalker variant can appear in mid floors

- **WHEN** floor is at or above stalker unlock threshold and enemy spawn resolves variant chance
- **THEN** a stalker enemy may spawn with more aggressive movement and higher kill reward

#### Scenario: Mini-boss floor encounter

- **WHEN** floor index matches configured boss interval
- **THEN** run starts with a boss enemy that has multi-hit health and grants boss reward on defeat

### Requirement: Floor progression

The system SHALL include a biome hazard loop that applies recurring pressure during gameplay.

#### Scenario: Moving rift hazard pulses over time

- **WHEN** biome rift timer ticks
- **THEN** rift relocates and applies configured hazard outcome if player occupies rift cell

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

