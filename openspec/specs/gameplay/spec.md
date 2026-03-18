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

The system SHALL spawn powerups and apply runtime effects using configurable balance values.

#### Scenario: Powerup spawn chances are configurable

- **WHEN** floor starts, food is eaten, or post-pick respawn is evaluated
- **THEN** spawn chances and respawn delay use centralized balance probabilities and timings

#### Scenario: Slow and score powerups use configurable multipliers

- **WHEN** player collects slow or score powerups
- **THEN** enemy slow multiplier and score bonus come from centralized balance values

### Requirement: Enemy AI and collision

The system SHALL spawn enemy snakes that path toward player; head-on collision kills enemy (shield consumed or death).

#### Scenario: Enemies move toward player

- **WHEN** enemy move timer triggers
- **THEN** each enemy moves head toward player (manhattan heuristic, avoids walls/self)

#### Scenario: Player head-on kills enemy

- **WHEN** player head moves onto enemy head cell
- **THEN** enemy dies, kills++, score += 20×scoreMult, particles spawn

#### Scenario: Enemy head-on with no shield causes death

- **WHEN** enemy head moves onto player head and shields=0
- **THEN** die() is called

#### Scenario: Enemy head-on with shield consumes shield

- **WHEN** enemy head moves onto player head and shields>0
- **THEN** shields decrements, camera shakes, enemies filtered, possibly new enemy spawns

---

### Requirement: Floor progression

The system SHALL advance floor when enough food is eaten; floor affects difficulty and upgrade choice, using centralized balance configuration for progression values.

#### Scenario: Floor clears after configured food threshold

- **WHEN** `foodEaten` reaches the configured per-floor target
- **THEN** scene transitions to Upgrade with score and floor

#### Scenario: Floor difficulty derives from balance config

- **WHEN** floor N starts
- **THEN** wall count, enemy count, and enemy interval are computed through centralized floor setup values, not inline literals

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

