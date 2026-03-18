# gameplay

Core gameplay mechanics: snake movement, collision, food, powerups, enemies, floor progression.

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

---

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

The system SHALL spawn powerups (shield, slow, ghost, score) on safe cells; collecting applies the effect.

#### Scenario: Powerup spawns alongside or after food

- **WHEN** food eaten and random < 0.3, or 40% chance at level start
- **THEN** a powerup appears on a safe cell

#### Scenario: Shield powerup grants shield

- **WHEN** snake collects shield powerup
- **THEN** shields count increments by 1

#### Scenario: Slow powerup slows enemies

- **WHEN** snake collects slow powerup
- **THEN** enemyInterval is multiplied by 1.5

#### Scenario: Ghost powerup grants ghost charge

- **WHEN** snake collects ghost powerup
- **THEN** ghostCharges increments by 1

#### Scenario: Score powerup grants points

- **WHEN** snake collects score powerup
- **THEN** score increases by 30×scoreMult

---

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

The system SHALL advance floor when enough food is eaten; floor affects difficulty and upgrade choice.

#### Scenario: Floor clears after food threshold

- **WHEN** foodEaten >= 7 + floor*2
- **THEN** scene transitions to Upgrade with score and floor

#### Scenario: Floor increases walls and enemies

- **WHEN** floor N starts
- **THEN** wallCount = min(2+N, 7), enemyCount = min(1+floor(N/2), 4), enemyInterval scales with floor

#### Scenario: Cell regen degrades tail

- **WHEN** hasRegen and regenTimer > 5000 and snake length > 4
- **THEN** tail segment is removed, regenTimer resets
