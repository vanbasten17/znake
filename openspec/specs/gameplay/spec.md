# gameplay

Core gameplay mechanics: snake movement, collision, food, powerups, enemies, floor progression.

## Purpose

Define the expected gameplay behavior for snake movement, combat interactions, progression, and power systems in Znake.
## Requirements
### Requirement: Snake movement

The system SHALL advance snake movement on a fixed interval and apply input with anti-reverse protection.

#### Scenario: Absolute swipe direction resolves to cardinal movement

- **WHEN** GameScene receives a swipe direction payload (`left`/`right`/`up`/`down`) from virtual input
- **THEN** it enqueues the requested cardinal direction
- **AND** enqueues direction through existing anti-reverse input logic

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

#### Scenario: Boss impact with shield uses readable knockback response

- **WHEN** player collides with boss while having at least one shield
- **THEN** boss takes configured collision damage
- **AND** player consumes shield and receives explicit knockback/impact feedback
- **AND** resulting player position remains valid within current collision constraints

#### Scenario: Boss impact without shield remains lethal

- **WHEN** player collides with boss without shield
- **THEN** run ends per existing lethal collision rules

#### Scenario: Egg enemy hatches into active threat

- **WHEN** Egg enemy hatch countdown reaches zero
- **THEN** Egg transforms into a moving enemy archetype
- **AND** subsequent movement follows existing enemy collision rules

#### Scenario: Mirror enemy tracks delayed player path

- **WHEN** Mirror enemy updates movement
- **THEN** it follows a delayed snapshot of player head path
- **AND** movement remains bounded by wall/self constraints

### Requirement: Floor progression

The system SHALL support temporary hazard-pressure modulation through item interaction.

#### Scenario: Core pressure activates on eligible non-boss floors

- **WHEN** a floor starts and biome pressure config is enabled for that floor
- **THEN** a pressure countdown starts
- **AND** pressure state is represented in run status text

#### Scenario: Food resets core pressure countdown

- **WHEN** player consumes food while core pressure is active
- **THEN** pressure countdown resets to configured interval

#### Scenario: Timeout consumes coolant before degrading tail

- **WHEN** core pressure countdown reaches zero and coolant charges are available
- **THEN** one coolant charge is consumed
- **AND** countdown resets without degrading snake length

#### Scenario: Timeout degrades tail when no coolant is available

- **WHEN** core pressure countdown reaches zero and coolant charges are not available
- **THEN** snake length is reduced by configured pressure amount
- **AND** countdown resets

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

### Requirement: Gameplay entity visual readability

The system SHALL provide distinct visual signatures for core gameplay entities without changing gameplay mechanics.

#### Scenario: Marker overlays remain readable without ring clutter

- **WHEN** gameplay markers are rendered in active runs
- **THEN** marker sprites and glow cues are visible without additional circular ring overlays
- **AND** readability improvements do not alter gameplay behavior

### Requirement: Developer scenario bootstrap

The system SHALL support deterministic debug scenario bootstrap for fast smoke testing.

#### Scenario: Reference board scenario renders static gameplay catalog

- **WHEN** `GameScene` starts with `devScenarioId=reference_board`
- **THEN** gameplay simulation stays paused/frozen for snake/enemy/objective loops
- **AND** scene shows representative gameplay elements (snake, walls, hazards, pickups, enemies) on one board
- **AND** mouse hover on a reference element reveals its label for development QA

### Requirement: Room template floor generation

The system SHALL support a connected room/corridor floor template as a selectable alternative to classic wall scatter generation.

#### Scenario: Floor template is selected per floor setup

- **WHEN** a new floor starts
- **THEN** gameplay resolves a configured floor template (`classic` or `rooms_v1`)
- **AND** generation pipeline uses the selected template

#### Scenario: Room template guarantees connectivity

- **WHEN** `rooms_v1` template is used
- **THEN** room and corridor carving creates a connected playable area
- **AND** generated topology is validated before run start

#### Scenario: Invalid room generation falls back safely

- **WHEN** room template generation fails validation after bounded retries
- **THEN** system falls back to classic floor generation
- **AND** run proceeds without crash or soft-lock

#### Scenario: Spawn behavior respects room/corridor zones

- **WHEN** room template is active
- **THEN** food and enemy spawns use zone-aware placement heuristics
- **AND** spawn safety constraints remain equivalent to existing rules

### Requirement: Boss-floor encounter scaffold

The system SHALL maintain a dedicated boss-floor encounter branch that can be extended incrementally without breaking baseline progression.

#### Scenario: Boss floor uses explicit encounter objective

- **WHEN** floor is marked as boss floor
- **THEN** progression objective is boss defeat
- **AND** non-boss objective checks are bypassed for that floor

#### Scenario: Boss defeat transitions cleanly to upgrade selection

- **WHEN** boss health reaches zero
- **THEN** scene transitions to upgrade flow
- **AND** no additional portal/score/kill objective gating blocks the transition

#### Scenario: Boss floor provides recurring shield support opportunities

- **WHEN** boss encounter is active and no powerup is present
- **THEN** a shield-oriented support powerup is offered on a recurring timer
- **AND** support cadence remains configurable in centralized balance knobs

#### Scenario: Boss support does not grant direct shield charges

- **WHEN** boss support logic triggers
- **THEN** shield availability is provided through collectible powerup spawn only
- **AND** shield count changes only on player pickup or damage consumption

#### Scenario: Boss floors do not preload shields at start

- **WHEN** a boss floor initializes
- **THEN** player starts with zero active shields
- **AND** shield access is obtained from collectible shield powerups during encounter

### Requirement: Elimination run type with venom combat

The system SHALL support elimination-oriented kill floors with manual venom offense.

#### Scenario: Kill objective floors run as elimination mode

- **WHEN** floor objective kind is `kills`
- **THEN** floor runs without food spawning
- **AND** progression depends on reaching kill target

#### Scenario: Venom charge can be collected and fired

- **WHEN** player collects venom powerup
- **THEN** a venom charge is added
- **AND** player can manually fire while charge is available

#### Scenario: Venom projectile damages enemies and respects cooldown

- **WHEN** venom is fired
- **THEN** projectile travels forward until wall/enemy contact
- **AND** enemy hit applies venom damage behavior
- **AND** subsequent fire is blocked until cooldown completes

#### Scenario: Boss floors expose venom pickup opportunity

- **WHEN** current floor objective is `boss`
- **THEN** run offers collectible venom opportunities during the fight
- **AND** venom remains manually fired via ability trigger

