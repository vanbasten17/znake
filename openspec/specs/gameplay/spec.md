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

Enemy movement and collision rule resolution SHALL be delegated to pure simulation modules, while scene code applies side effects.

#### Scenario: Enemy movement is simulation-driven

- **WHEN** an enemy movement tick occurs
- **THEN** movement decision logic is evaluated in pure simulation code
- **AND** `GameScene` only applies resulting state and side effects

#### Scenario: Enemy collision detection is simulation-driven

- **WHEN** snake/enemy overlap checks are evaluated
- **THEN** collision target and hit-part resolution come from pure simulation helpers
- **AND** scene code handles feedback, score, and transition side effects

### Requirement: Combat fairness windows

The system SHALL provide short, tunable reaction windows around high-risk combat moments without pausing the simulation or granting broad invulnerability.

#### Scenario: Room entry grants brief contact grace

- **WHEN** a new floor begins and gameplay control starts
- **THEN** player enemy-contact damage is suppressed for a short configured room-entry grace window
- **AND** enemy movement and other board systems continue normally

#### Scenario: Nonlethal damage grants brief recovery grace

- **WHEN** the player survives enemy or hazard contact that removes shields or body segments
- **THEN** the system starts a short configured post-hit grace window
- **AND** repeated contact during that window does not immediately remove additional shields or segments

### Requirement: Enemy telegraph readability

The system SHALL surface imminent dangerous enemy actions before impact using deterministic, tunable telegraph timing.

#### Scenario: Ambusher dash is telegraphed before execution

- **WHEN** an ambusher becomes eligible to perform a dash attack
- **THEN** it enters a telegraph state for a configured number of enemy movement ticks before the dash resolves
- **AND** that telegraph state is available to presentation code for clear warning cues

#### Scenario: Egg hatch warns before threat state changes

- **WHEN** an egg enemy is close to hatching
- **THEN** its remaining hatch time is available for readable pre-hatch presentation cues
- **AND** the hatch still resolves deterministically from simulation state

### Requirement: Enemy spawn fairness

The system SHALL validate enemy spawn locations against localized fairness rules before committing a spawn.

#### Scenario: Enemy spawn avoids immediate player pressure

- **WHEN** a new enemy spawn cell is selected
- **THEN** the chosen cell respects configured minimum distance and lane-pressure fairness rules relative to the player head
- **AND** the spawn does not begin in an obviously near-instant-hit position

#### Scenario: Enemy spawn avoids low-agency pockets when possible

- **WHEN** enemy spawn candidates are evaluated
- **THEN** candidates with insufficient local escape space are rejected while fair alternatives exist
- **AND** the system falls back deterministically to general open-cell selection only if stricter fairness filters exhaust valid candidates

### Requirement: Floor progression

Portal flow and core-pressure timing transitions SHALL be handled by pure objective state machine helpers.

#### Scenario: Portal and squeeze transitions are state-machine driven

- **WHEN** portal countdown/grace/squeeze updates run
- **THEN** timer transitions are produced by pure objective simulation functions
- **AND** scene code consumes emitted events for side effects (spawn portals, hints, feedback)

#### Scenario: Core pressure transitions are state-machine driven

- **WHEN** core pressure timer reaches threshold
- **THEN** pure objective simulation emits cooldown/decay outcomes
- **AND** scene code applies concrete snake mutations and death checks

#### Scenario: Room objective transitions are state-machine driven

- **WHEN** room objective progress changes or completion is evaluated
- **THEN** objective state updates are produced by pure simulation helpers
- **AND** scene code handles runtime side effects such as HUD updates, feedback, and reward-overlay transitions

#### Scenario: Reward selection gates non-boss progression

- **WHEN** a non-boss segment objective is completed
- **THEN** progression pauses for reward selection
- **AND** the next segment begins only after the selected reward is applied

### Requirement: Room objective progression loop

The system SHALL use the active room objective as the short-term progression gate for non-boss run segments.

#### Scenario: Non-boss segment starts with an active objective

- **WHEN** a non-boss room or run segment begins
- **THEN** gameplay starts with one active room objective
- **AND** the player can make progress toward completion immediately

#### Scenario: Objective completion gates reward before advancement

- **WHEN** the player fulfills the active room objective
- **THEN** gameplay triggers a reward choice
- **AND** the next segment does not begin until one reward is selected

### Requirement: Objective-specific progress events

The system SHALL support first-pass objective progress from survival, core collection, elite defeat, and terminal activation events.

#### Scenario: Survival objective completes on timer

- **WHEN** the active objective kind is `survive`
- **THEN** completion occurs after the configured survival duration elapses

#### Scenario: Core collection objective completes on pickups

- **WHEN** the active objective kind is `collect_cores`
- **THEN** collecting the configured number of core items completes the objective

#### Scenario: Elite defeat objective completes on elite kills

- **WHEN** the active objective kind is `defeat_elite`
- **THEN** defeating the configured number of elite enemies completes the objective

#### Scenario: Terminal objective completes on activations

- **WHEN** the active objective kind is `activate_terminals`
- **THEN** activating the configured number of terminals completes the objective

### Requirement: Snake body render continuity

The system SHALL render snake head and all remaining body segments in every frame where those segments exist.

#### Scenario: Head render does not abort tail render

- **WHEN** drawFrame renders the head segment
- **THEN** rendering continues for all remaining segments without exiting the full frame draw

#### Scenario: Tail is visible after movement

- **WHEN** snake length is greater than one
- **THEN** at least one non-head body segment is visible in the rendered frame

### Requirement: Run modifiers from persistent meta

The system SHALL apply persistent talent effects and selected relic effects before in-run upgrade effects when composing run behavior, and in-run upgrades SHALL be able to alter timing, routing, zoning, or recovery rules.

#### Scenario: Talents affect run start

- **WHEN** gameplay initializes a new run
- **THEN** unlocked talent modifiers are applied before gameplay begins

#### Scenario: Relic affects run start

- **WHEN** gameplay initializes with a selected relic
- **THEN** relic modifiers are applied before in-run upgrade modifiers

#### Scenario: Identity upgrades affect space decisions

- **WHEN** a run starts after one or more in-run upgrades have been selected
- **THEN** the resulting run config can change movement pressure, map control, or recovery behavior
- **AND** at least some upgrades influence routing, timing, or body-management decisions during play

### Requirement: Gameplay entity visual readability

The system SHALL provide distinct visual signatures for core gameplay entities without changing gameplay mechanics.

#### Scenario: Marker overlays remain readable without ring clutter

- **WHEN** gameplay markers are rendered in active runs
- **THEN** marker sprites and glow cues are visible without additional circular ring overlays
- **AND** readability improvements do not alter gameplay behavior

#### Scenario: Score-linked entities avoid persistent glow emphasis

- **WHEN** an entity’s primary role is score collection/progression
- **THEN** it does not use persistent glow emphasis by default
- **AND** score visibility relies on clear sprite silhouette and hierarchy-safe contrast

#### Scenario: Players classify danger-vs-reward in under one second

- **WHEN** multiple entity categories are visible simultaneously
- **THEN** visual signals allow primary classification (`danger`, `reward`, `utility`, `obstacle`) in under one second under normal gameplay conditions
- **AND** classification does not depend solely on micro-detail icons

### Requirement: Developer scenario bootstrap

The system SHALL support deterministic debug scenario bootstrap for fast smoke testing.

#### Scenario: Reference board scenario renders static gameplay catalog

- **WHEN** `GameScene` starts with `devScenarioId=reference_board`
- **THEN** gameplay simulation stays paused/frozen for snake/enemy/objective loops
- **AND** scene shows representative gameplay elements (snake, walls, hazards, pickups, enemies) on one board
- **AND** mouse hover on a reference element reveals its label for development QA

### Requirement: Room template floor generation

The system SHALL keep floor layout generation and spawn-safe candidate resolution in pure simulation modules, while `GameScene` orchestrates calls and rendering side effects.

#### Scenario: Scene orchestrates pure floor generation

- **WHEN** a floor starts
- **THEN** `GameScene` delegates layout generation and validation to simulation-layer functions
- **AND** the delegated functions do not import Phaser, DOM, or global browser APIs

#### Scenario: Scene orchestrates pure spawn candidate selection

- **WHEN** food/powerup/portal/enemy spawn cell selection is needed
- **THEN** `GameScene` delegates candidate resolution to simulation-layer helpers
- **AND** scene remains responsible for applying resulting entities to runtime state and visual updates only

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

### Requirement: Shape semantics for entity categories

The system SHALL define primary shape families that communicate gameplay intent consistently.

#### Scenario: Shape family maps to gameplay meaning

- **WHEN** an entity is rendered
- **THEN** its base silhouette follows category intent (rounded for collectible/utility, angular for threat, rectilinear for terrain/obstacle)
- **AND** opposite intents do not share identical primary silhouettes in the same gameplay context

#### Scenario: Ambiguity is blocked by constraints

- **WHEN** two high-priority entities coexist on screen
- **THEN** they are distinguishable via at least one major channel (shape, color family, or state emphasis)
- **AND** no pair relies only on tiny inner icon differences for disambiguation

### Requirement: Priority and urgency feedback hierarchy

The system SHALL communicate player-action priority through a bounded emphasis model.

#### Scenario: Priority maps to bounded emphasis intensity

- **WHEN** an entity priority is `low`, `medium`, `high`, or `critical`
- **THEN** emphasis (contrast, glow, pulse, and optional cue intensity) scales with that level
- **AND** `critical` receives strongest emphasis while preserving readability

#### Scenario: Attention budget prevents overload

- **WHEN** several emphasized entities are present
- **THEN** the system limits concurrent critical visual cues to avoid clutter
- **AND** non-interactive/passive entities downgrade emphasis automatically

### Requirement: Entity classification contract

The system SHALL define visual rules per gameplay category.

#### Scenario: Category rules are explicit

- **WHEN** category is `obstacles`, `enemies`, `collectibles`, or `power-ups`
- **THEN** each category has documented gameplay role and default visual representation rules
- **AND** each category includes constraints that prevent semantic conflicts with other categories

### Requirement: State-driven visual behavior

The system SHALL map entity state to predictable visual intensity.

#### Scenario: State progression changes visual urgency

- **WHEN** an entity transitions across `idle`, `active`, and `dangerous`
- **THEN** visual emphasis escalates in that order
- **AND** transitions remain perceivable without disorienting motion spikes

### Requirement: Extensible visual token mapping

The system SHALL support adding new entity types via data-driven semantic mapping.

#### Scenario: New entity onboarding uses token mapping

- **WHEN** a new entity type is introduced
- **THEN** it must declare category, intent, priority, state-visual mapping, shape token, and color token
- **AND** it is rejected for release if mapping is missing or conflicts with existing semantics

#### Scenario: Dev reference board reflects shared mapping

- **WHEN** reference/guide visual previews are rendered
- **THEN** they are sourced from the same semantic mapping used in gameplay
- **AND** previews do not diverge from in-run meaning
