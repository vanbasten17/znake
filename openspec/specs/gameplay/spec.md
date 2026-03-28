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

The system SHALL provide short, tunable reaction windows around high-risk combat moments without pausing the simulation or granting broad invulnerability, and SHALL keep those windows long enough to avoid repeated near-instant follow-up damage in normal play.

#### Scenario: Room entry grants brief contact grace

- **WHEN** a new floor begins and gameplay control starts
- **THEN** player enemy-contact damage is suppressed for a short configured room-entry grace window
- **AND** enemy movement and other board systems continue normally

#### Scenario: Nonlethal damage grants brief recovery grace

- **WHEN** the player survives enemy or hazard contact that removes shields or body segments
- **THEN** the system starts a short configured post-hit grace window
- **AND** repeated contact during that window does not immediately remove additional shields or segments

#### Scenario: Breathing windows remain challenge-preserving

- **WHEN** fairness windows are tuned
- **THEN** room-entry and post-hit windows remain brief and deterministic
- **AND** tuning improves agency without introducing broad low-risk downtime

### Requirement: Enemy telegraph readability

The system SHALL surface imminent dangerous enemy actions before impact using deterministic, tunable telegraph timing and maintain readable warning windows under normal encounter pacing.

#### Scenario: Ambusher dash is telegraphed before execution

- **WHEN** an ambusher becomes eligible to perform a dash attack
- **THEN** it enters a telegraph state for a configured number of enemy movement ticks before the dash resolves
- **AND** that telegraph state is available to presentation code for clear warning cues

#### Scenario: Egg hatch warns before threat state changes

- **WHEN** an egg enemy is close to hatching
- **THEN** its remaining hatch time is available for readable pre-hatch presentation cues
- **AND** the hatch still resolves deterministically from simulation state

#### Scenario: Telegraph windows remain readable under pressure

- **WHEN** high-pressure roles or elites are active in the same room
- **THEN** configured telegraph windows still expose a practical reaction opportunity
- **AND** role pressure remains dangerous without collapsing into unavoidable burst

### Requirement: Enemy spawn fairness

The system SHALL validate enemy spawn locations against localized fairness rules before committing a spawn and prefer cells that preserve immediate escape options.

#### Scenario: Enemy spawn avoids immediate player pressure

- **WHEN** a new enemy spawn cell is selected
- **THEN** the chosen cell respects configured minimum distance and lane-pressure fairness rules relative to the player head
- **AND** the spawn does not begin in an obviously near-instant-hit position

#### Scenario: Enemy spawn avoids low-agency pockets when possible

- **WHEN** enemy spawn candidates are evaluated
- **THEN** candidates with insufficient local escape space are rejected while fair alternatives exist
- **AND** the system falls back deterministically to general open-cell selection only if stricter fairness filters exhaust valid candidates

#### Scenario: Spawn safety tuning remains deterministic

- **WHEN** stricter spawn fairness thresholds are configured
- **THEN** candidate evaluation and fallback behavior remain deterministic from seed and occupancy state
- **AND** no scene-local random bypass is introduced

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

#### Scenario: Event-choice selection can gate non-boss progression

- **WHEN** a non-boss progression step enters an event-choice decision point
- **THEN** progression pauses for event-choice selection
- **AND** the next progression step begins only after the selected event outcome is applied

### Requirement: Room objective progression loop

The system SHALL use the active room objective as the short-term progression gate for combat-oriented non-boss run segments.

#### Scenario: Combat segment starts with an active objective

- **WHEN** a `combat` or `elite` room segment begins
- **THEN** gameplay starts with one active room objective
- **AND** the player can make progress toward completion immediately

#### Scenario: Objective completion gates reward before advancement

- **WHEN** the player fulfills the active objective in a `combat` or `elite` room
- **THEN** gameplay triggers a reward choice
- **AND** the next route decision or segment does not begin until one reward is selected

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

### Requirement: Bounded moment feedback

The system SHALL provide immediate, lightweight feedback for meaningful gameplay outcomes without changing the underlying gameplay result.

#### Scenario: Damage taken is immediately readable

- **WHEN** the player loses a shield, loses body segments, or takes a nonlethal hazard hit
- **THEN** presentation triggers a bounded impact response with readable flash/emphasis
- **AND** any micro-pause remains short enough to preserve control responsiveness

#### Scenario: Pickups are clearly acknowledged

- **WHEN** the player collects food, a powerup, or a biome item
- **THEN** presentation triggers an immediate pickup response distinct from damage feedback
- **AND** the response makes the collection readable without overwhelming nearby hazards

#### Scenario: Objective success gets a reward moment

- **WHEN** a room objective becomes reward-ready or a floor objective completes
- **THEN** presentation triggers a short celebration/emphasis response
- **AND** the response communicates success before the next reward or transition step begins

### Requirement: Event-choice progression points

The system SHALL support deterministic event-choice decision points in non-boss progression.

#### Scenario: Event-choice point enters pending state

- **WHEN** progression reaches an event-choice trigger for the current segment flow
- **THEN** gameplay enters an event-choice-pending state
- **AND** normal advancement pauses until one option is resolved

#### Scenario: Event-choice completion resumes progression

- **WHEN** an event option is resolved
- **THEN** progression updates run state using the selected deterministic payload
- **AND** segment advancement resumes from the post-event progression state

### Requirement: Body pulse gameplay sink
The system SHALL support a player-triggered `body_pulse` sink that spends body segments for short-range space relief under deterministic gating.

#### Scenario: Valid pulse spend applies cost and effect
- **WHEN** body pulse input is triggered, cooldown is ready, and spend floor rules pass
- **THEN** the configured segment spend is applied
- **AND** pulse effect gameplay state is activated for configured duration

#### Scenario: Pulse spend is blocked at low length
- **WHEN** body pulse input is triggered but spend would cross minimum spendable length
- **THEN** no segment spend occurs
- **AND** gameplay returns a deterministic blocked outcome

### Requirement: Reward overclock gameplay sink
The system SHALL support a `reward_overclock` sink during reward selection that trades body segments for one deterministic reward reroll per completed objective.

#### Scenario: Overclock rerolls reward options once
- **WHEN** reward selection is active and reward overclock is triggered with valid spend state
- **THEN** the configured segment spend is applied
- **AND** reward draft options are rerolled once for that objective completion

#### Scenario: Overclock cannot be repeated in same reward window
- **WHEN** reward overclock has already been consumed for the active reward window
- **THEN** additional overclock requests in that window are rejected
- **AND** existing drafted options remain unchanged

### Requirement: Tail-health coexistence with body spending
The system SHALL preserve tail-as-health semantics while allowing voluntary spend, using explicit deterministic attribution for segment-loss sources.

#### Scenario: Segment loss attribution remains readable
- **WHEN** segments are removed by combat damage or by voluntary spending
- **THEN** gameplay emits source-attributed outcomes for each loss event
- **AND** scene feedback can distinguish damage loss from spend loss without changing simulation rules

### Requirement: Room-level enemy role composition

The system SHALL compose encounter pressure from explicit enemy role contracts so room-level threat priorities are readable and tactically distinct.

#### Scenario: Combat room starts with readable role mix

- **WHEN** a combat or elite room initializes enemy pressure
- **THEN** active enemy composition is built from declared role contracts
- **AND** the resulting role mix avoids collapsing into functionally indistinguishable pressure sources

### Requirement: First-pass role behavior contracts

The system SHALL preserve deterministic gameplay contracts for first-pass roles `sniper`, `blocker`, `summoner`, `charger`, and `leech`.

#### Scenario: Sniper creates lane-threat timing

- **WHEN** a `sniper` role enemy resolves its primary action
- **THEN** it uses an explicit pre-fire telegraph and line-commit threat window
- **AND** the player has a readable opportunity to reposition before impact

#### Scenario: Blocker creates space denial without deadlock

- **WHEN** a `blocker` role enemy applies pressure
- **THEN** it constrains routing or lane access through deterministic area denial behavior
- **AND** room logic preserves at least one practical escape route when alternatives exist

#### Scenario: Summoner scales pressure with management window

- **WHEN** a `summoner` role enemy attempts to add secondary threats
- **THEN** summon cadence follows deterministic role timing with pre-escalation readability
- **AND** player counterplay can interrupt or contain pressure before runaway board saturation

#### Scenario: Charger commits to burst lane attack

- **WHEN** a `charger` role enemy triggers a burst action
- **THEN** it enters a readable windup before high-commit movement
- **AND** post-commit recovery creates a punish or disengage window

#### Scenario: Leech applies economy pressure

- **WHEN** a `leech` role enemy interacts with economy targets
- **THEN** it applies deterministic pressure to pickup or reward value flow
- **AND** telegraph/counterplay windows allow the player to contest that pressure intentionally

### Requirement: Gameplay fairness from role interactions

The system SHALL enforce fairness at the interaction level when multiple roles are active in the same room.

#### Scenario: Multi-role pressure remains fair

- **WHEN** at least two role types are simultaneously applying pressure
- **THEN** anti-stack and cadence guardrails preserve a minimum reaction opportunity for the player
- **AND** unavoidable near-instant damage chains are prevented when valid alternatives exist

### Requirement: Deterministic challenge mutator activation

The system SHALL resolve first-pass challenge mutators deterministically from run seed and progression context before gameplay begins.

#### Scenario: Same seed yields same mutator set
- **WHEN** two runs start with the same seed and equivalent progression context
- **THEN** mutator selection and ordering are identical
- **AND** scene-local randomness does not alter the selected mutator set

#### Scenario: Mutator activation occurs before first gameplay tick
- **WHEN** gameplay initializes a new run
- **THEN** mutator effects are attached to run state before the first gameplay tick
- **AND** objective, enemy, and reward systems read the same resolved mutator context

### Requirement: Safe mutator composition across gameplay systems

The system SHALL apply mutators through simulation-owned composition contracts that preserve objective solvability and deterministic outcomes.

#### Scenario: Objective loop remains solvable under mutators
- **WHEN** mutators adjust pressure, timers, or reward tradeoffs
- **THEN** active room objectives remain achievable under configured fairness constraints
- **AND** invalid mutator combinations are rejected before run start

#### Scenario: Body and event outcomes remain recoverable
- **WHEN** mutators interact with body spend sinks or event-choice effects
- **THEN** composition enforces configured recoverability floors
- **AND** no accepted mutator set creates deterministic non-recoverable non-boss states

### Requirement: Anti-frustration guardrails for mutator pressure

The system SHALL enforce anti-frustration limits for stacked mutator pressure and preserve player reaction windows.

#### Scenario: Pressure stack ceiling is enforced
- **WHEN** candidate mutators exceed configured pressure budget or blocked-combination rules
- **THEN** those candidates are rejected deterministically
- **AND** replacement selection follows deterministic fallback logic

#### Scenario: Reaction fairness windows remain active
- **WHEN** mutators alter enemy tempo, spawn cadence, or hazard density
- **THEN** existing room-entry and post-hit fairness windows remain respected
- **AND** player reaction windows do not drop below configured minimum thresholds

### Requirement: Elite and miniboss pattern-kit readability contracts
The system SHALL model elite/miniboss kits as deterministic action patterns with explicit telegraph, commitment, and recovery windows exposed for readable counterplay.

#### Scenario: Pattern phases expose readable counterplay windows
- **WHEN** an elite or miniboss starts a pattern action
- **THEN** gameplay resolves ordered phases (`telegraph`, `commit`, `recovery`) deterministically from run state and seed context
- **AND** current phase and remaining phase timing are available to presentation systems for warning cues

#### Scenario: Counterplay window exists before high-commit impact
- **WHEN** a high-commit elite/miniboss action can damage the player
- **THEN** a minimum reaction window is present before impact
- **AND** the action cannot skip directly from neutral state to damaging state in the same resolution step

### Requirement: Elite and miniboss anti-cheap-hit fairness
The system SHALL enforce anti-cheap-hit rules for elite/miniboss pressure sequencing and spawn safety.

#### Scenario: Spawn and activation avoid immediate unavoidable damage
- **WHEN** an elite/miniboss encounter initializes or escalates phase pressure
- **THEN** spawn/activation resolution respects configured safety distance and escape-space checks
- **AND** deterministic fallback rules apply only when strict fairness filters exhaust valid candidates

#### Scenario: Overlapping pressure chains keep player agency
- **WHEN** multiple elite/miniboss pressure sources overlap in the same short interval
- **THEN** anti-overlap guardrails preserve at least one actionable evade or disengage option when alternatives exist
- **AND** unavoidable near-instant repeated-hit chains are blocked by deterministic sequencing constraints

### Requirement: Elite and miniboss progression cadence integration
The system SHALL integrate elite/miniboss encounters into objective/reward progression with deterministic cadence rules.

#### Scenario: Encounter cadence follows progression policy
- **WHEN** run progression resolves upcoming room pressure milestones
- **THEN** elite/miniboss encounter insertion follows centralized cadence policy and run-depth gating
- **AND** cadence resolution remains deterministic for equivalent seed and progression context

#### Scenario: Encounter completion respects objective and reward gating
- **WHEN** an elite/miniboss encounter marked as objective-critical is completed
- **THEN** progression enters the configured reward/objective gate before advancing route flow
- **AND** non-marked encounters resume normal progression without duplicating reward gates

### Requirement: Biome gameplay-rule taxonomy and deterministic activation
The system SHALL resolve biome gameplay rules through a deterministic taxonomy-driven activation path that is independent of scene-local randomness.

#### Scenario: Biome rule activation is deterministic for equivalent seed context
- **WHEN** the same run seed, run-map node biome metadata, and progression state are resolved
- **THEN** the same active biome gameplay-rule set is selected
- **AND** activation order is stable and reproducible across runs with equivalent context

#### Scenario: Biome rule activation happens at deterministic progression boundaries
- **WHEN** progression enters a new biome-qualified room or segment boundary
- **THEN** biome gameplay-rule activation is evaluated once for that boundary context
- **AND** in-room updates consume the resolved rule payload without re-rolling biome behavior

### Requirement: Biome modifiers alter route planning and pressure rhythm
The system SHALL provide first-pass biome gameplay modifiers that change movement, routing, or survival-pressure timing decisions, not only presentation.

#### Scenario: Active biome modifier changes tactical routing choices
- **WHEN** a biome gameplay rule is active in a combat-oriented segment
- **THEN** at least one rule effect changes reachable safe-lane planning, timing windows, or route-risk tradeoffs
- **AND** the resulting decision impact is attributable to the active biome rule payload

#### Scenario: Biome pressure cadence changes are bounded for fairness
- **WHEN** biome rules modify survival-pressure rhythm in a segment
- **THEN** cadence shifts remain within configured fairness floors for reaction and recoverability
- **AND** biome modifiers do not bypass existing anti-cheap-hit protection contracts

### Requirement: Biome compatibility guardrails across objectives, mutators, and body economy
The system SHALL validate biome gameplay-rule compatibility with objective contracts, mutator contracts, and body-economy constraints before final activation.

#### Scenario: Conflicting biome combinations are resolved with deterministic guardrail fallback
- **WHEN** candidate biome rules conflict with active objective, mutator, or body-economy recoverability thresholds
- **THEN** the system applies deterministic fallback behavior (downgrade, replacement, or deferral) from centralized policy
- **AND** the final activated rule set preserves minimum player agency constraints

#### Scenario: Objective-critical segments preserve completion viability under biome rules
- **WHEN** a biome rule would reduce viability for an active objective type (`survive`, `collect_cores`, `defeat_elite`, `activate_terminals`)
- **THEN** compatibility checks enforce objective-specific guardrails before activation is finalized
- **AND** objective progression contracts remain intact without scene-specific exception logic

### Requirement: Predator-prey encounter pacing contracts

The system SHALL apply deterministic predator-prey pacing phases so encounters alternate intentional hunt pressure and escape windows.

#### Scenario: Encounter starts with bounded opening phase

- **WHEN** a combat or elite encounter starts
- **THEN** pacing initializes from centralized opening-phase policy
- **AND** initial pressure setup preserves a readable reaction window

#### Scenario: Hunt and escape windows alternate through deterministic transitions

- **WHEN** encounter pressure and state inputs satisfy configured transition thresholds
- **THEN** pacing transitions deterministically between `hunt`, `escape`, and `reset`
- **AND** transitions preserve readable tension rhythm instead of continuous undifferentiated pressure

### Requirement: Multi-source pressure overlap fairness

The system SHALL enforce anti-overlap pressure sequencing guardrails across role and elite/miniboss pressure sources.

#### Scenario: Combined pressure keeps at least one actionable option

- **WHEN** multiple pressure sources attempt to overlap in a short window
- **THEN** overlap validation enforces configured budget and cadence gap thresholds
- **AND** the player retains at least one actionable evade or disengage option when alternatives exist

#### Scenario: Guardrail intervention preserves deterministic flow

- **WHEN** an action is deferred or downgraded by overlap guardrails
- **THEN** encounter progression remains deterministic and seed-stable
- **AND** intervention reason is available to observability hooks

### Requirement: Boss identity and readability progression
The system SHALL resolve boss encounters through explicit identity and phase-readability contracts while keeping encounter sequencing deterministic.

#### Scenario: Boss phase transitions expose identity-aware cues
- **WHEN** boss encounter phase changes during an active boss floor
- **THEN** simulation-owned encounter state includes current boss identity and phase readability payload
- **AND** scene presentation consumes that payload without owning phase transition logic

### Requirement: Boss pressure fairness guardrails
The system SHALL preserve fairness during boss pressure escalation through deterministic reaction and overlap guardrails.

#### Scenario: Boss escalation preserves minimum reaction opportunity
- **WHEN** boss pressure escalates into higher-threat phase behavior
- **THEN** escalation respects configured reaction and anti-overlap thresholds
- **AND** deterministic fallback sequencing applies when strict fairness constraints cannot all be satisfied

### Requirement: Bounded depth-balance progression contract
The system SHALL provide a bounded deterministic progression contract for floors 1-15 with explicit early, mid, and late pressure targets.

#### Scenario: Floor progression maps to stable depth bands
- **WHEN** gameplay resolves progression pressure for a floor within the bounded 1-15 window
- **THEN** it resolves against a deterministic depth-band contract (`early`, `mid`, `late`)
- **AND** the same seed and input stream yields the same floor pressure outcomes

#### Scenario: Depth-band pressure targets remain readable
- **WHEN** progression transitions between depth bands
- **THEN** pressure increase remains intentional and readable rather than abrupt
- **AND** transition tuning preserves practical counterplay windows under normal encounter density

### Requirement: Level-band difficulty guardrails
The system SHALL enforce level-band guardrails that reduce spike deaths and flat pacing segments without introducing dynamic nondeterministic difficulty.

#### Scenario: Guardrails dampen abrupt pressure spikes
- **WHEN** per-floor pressure deltas exceed configured level-band thresholds
- **THEN** deterministic guardrail logic clamps or smooths the affected values
- **AND** gameplay remains challenging while avoiding near-instant unjust difficulty jumps

#### Scenario: Guardrails avoid flat low-pressure stretches
- **WHEN** contiguous floors stay below configured minimum pressure progression for a band
- **THEN** deterministic guardrail logic raises bounded pressure values for subsequent floors
- **AND** progression keeps a meaningful sense of advancement

### Requirement: Depth-aware item usefulness
The system SHALL keep in-run item usefulness meaningful by resolving spawn/value policy from depth band and run context.

#### Scenario: Item usefulness scales by depth and context
- **WHEN** item spawn and effect usefulness are resolved during run progression
- **THEN** the resolved policy includes depth-band and run-context factors (objective pressure and room context)
- **AND** early, mid, and late floors each retain practical item decision value

### Requirement: Deterministic challenge preset bootstrap

The system SHALL support deterministic run bootstrap presets for `daily` and `weekly` challenge modes while preserving existing standard-run bootstrap behavior.

#### Scenario: Daily preset seed is stable within the same UTC day
- **WHEN** daily challenge runs start on the same UTC day
- **THEN** resolved run seed is identical across those starts
- **AND** standard run mode seed behavior remains unchanged

#### Scenario: Weekly preset seed is stable within the same UTC week bucket
- **WHEN** weekly challenge runs start within the same UTC week bucket
- **THEN** resolved run seed is identical across those starts
- **AND** weekly seed changes only when week bucket changes

### Requirement: Preset modifier composition uses existing mutator guardrails

The system SHALL compose first-pass challenge preset modifier behavior through existing mutator contracts and fairness guardrails.

#### Scenario: Preset forced mutator joins run mutator context safely
- **WHEN** a challenge preset provides a forced mutator identifier
- **THEN** gameplay includes that mutator in run mutator context only when floor eligibility allows
- **AND** existing guardrail constraints and deterministic ordering remain preserved

### Requirement: Deterministic enemy composition director resolution

The system SHALL resolve active enemy composition windows deterministically from depth band and spawn cadence context.

#### Scenario: Equivalent spawn cadence yields equivalent role window
- **WHEN** two runs share equivalent seed, floor band, and role spawn cadence state
- **THEN** active composition window identifier is identical
- **AND** resulting role policy overlay is identical

#### Scenario: Window-aware role drafting preserves guardrails
- **WHEN** normal enemy roles are drafted through active composition window policy
- **THEN** existing active-cap and spawn-gap guardrails remain enforced
- **AND** non-normal forced spawns are not rewritten by window policy

### Requirement: Route package resolution applies bounded identity effects

The system SHALL apply bounded package-specific effects when pending route choice resolves.

#### Scenario: Route package apply includes deterministic score bonus
- **WHEN** safer or riskier route is applied at room transition
- **THEN** package score bonus is applied deterministically with existing score multiplier context
- **AND** existing route pressure deltas remain active

### Requirement: Due event-choice consequences resolve at floor start

The system SHALL resolve due delayed event-choice consequences at floor initialization in deterministic order.

#### Scenario: Due consequences apply before room setup
- **WHEN** a new floor starts and pending delayed consequences are due
- **THEN** consequence effects are applied to floor-start runtime state before room-specific setup
- **AND** consumed consequences are removed from pending queue

### Requirement: Expanded upgrade pool preserves deterministic draft behavior

The system SHALL keep upgrade draft determinism and duplicate-avoidance when family mini-set entries are expanded.

#### Scenario: Expanded catalog yields deterministic drafts
- **WHEN** identical run seed, floor, and owned upgrade context request a draft from the expanded pool
- **THEN** the selected upgrade ids remain deterministic
- **AND** no duplicate upgrade id appears within the same draft

### Requirement: Boss phase-remix application remains deterministic

The system SHALL apply boss phase-remix profile effects deterministically by floor progression context.

#### Scenario: Equivalent boss floors resolve equivalent remix behavior
- **WHEN** equivalent runs reach the same boss floor context
- **THEN** gameplay resolves the same boss remix id and applies the same bounded rage/support parameters
- **AND** scene logic does not inject runtime randomness into remix selection

### Requirement: Lifecycle resume continuity cue

The system SHALL emit a concise deterministic continuity cue when gameplay resumes from lifecycle auto-pause.

#### Scenario: Auto-resume hint includes objective and pending context
- **WHEN** app focus returns and lifecycle resumes an auto-paused run
- **THEN** the hint surface includes floor, objective preview, and bounded pending-context summary
- **AND** cue text is derived from deterministic run state

### Requirement: Ability readiness cues reflect active context

The system SHALL present ability-cooldown cue text from the currently active ability context.

#### Scenario: Cooldown cue switches by ability context
- **WHEN** ability hint context is evaluated
- **THEN** cooldown cue reflects venom context when active, otherwise body-pulse context
- **AND** cue values are derived from deterministic runtime state

### Requirement: Run-start snake length composition
The system SHALL compose run-start snake length deterministically as `baseSnakeLength + bonusStartLength`, where baseline and progression bonuses remain independently tunable.

#### Scenario: Baseline run starts at head plus two body segments
- **WHEN** a run starts with no unlocked talents, relic modifiers, or reward/start-length bonuses
- **THEN** run-start snake length resolves from centralized baseline config as `3`
- **AND** resulting spawned snake contains exactly three segments

#### Scenario: Bonus stacking remains additive on top of baseline
- **WHEN** run config includes one or more additive start-length bonuses from progression systems
- **THEN** final run-start snake length resolves as baseline plus the summed additive bonuses
- **AND** no multiplicative or scene-local override path changes that composition

### Requirement: Unified progression contract ownership boundary
The system SHALL resolve progression composition in deterministic core/config helpers, and scene orchestration SHALL consume the resolved payload without duplicating composition rules.

#### Scenario: Scene orchestration consumes composed progression payload
- **WHEN** gameplay needs progression knobs for a floor/spawn context
- **THEN** orchestration reads resolved progression payload from core helper boundary
- **AND** scene code does not re-compose depth/pressure/role-cap rules inline

### Requirement: Fairness validation coverage across depth bands
The system SHALL validate reaction-window, recoverability, and no-cheap-hit fairness thresholds across early, mid, and late depth bands using deterministic probes.

#### Scenario: Depth-band fairness probes validate bounded thresholds
- **WHEN** fairness validation runs for representative floors in each depth band
- **THEN** reaction, recoverability, and cheap-hit metrics are compared against depth-band thresholds
- **AND** failures identify specific metric and depth-band context

### Requirement: Deterministic runway boss cadence
The system SHALL provide a deterministic regular-floor runway where floors `1-9` remain non-boss progression and floor `10` is the first boss cadence milestone.

#### Scenario: Early runway excludes boss floor insertion
- **WHEN** run progression resolves floors `1` through `9`
- **THEN** those floors remain non-boss cadence floors
- **AND** boss progression insertion does not occur before floor `10`

#### Scenario: Boss milestone resolves on floor 10 cadence
- **WHEN** run progression resolves floor `10`
- **THEN** floor `10` is resolved as a boss cadence floor
- **AND** subsequent boss cadence milestones follow the same deterministic interval pattern

### Requirement: Route risk signals include non-color markers

Route risk readability SHALL include symbolic cues in addition to color and text.

#### Scenario: Risk line includes symbol marker
- **WHEN** route risk line is composed
- **THEN** risk level is paired with a stable symbol marker

### Requirement: Route risk formatting is utility-driven and consistent

Gameplay route overlays SHALL use a reusable formatter utility for risk cue composition.

#### Scenario: Formatter produces stable risk cue text
- **WHEN** route risk level and localized label are provided
- **THEN** formatter returns a stable cue string that scenes can render directly

### Requirement: Route risk cues are not color-only

The gameplay route-choice surface SHALL express risk with text and color together.

#### Scenario: Risk forecast includes textual level cue
- **WHEN** route cards are shown
- **THEN** risk forecast text SHALL include an explicit risk label
- **AND** labels SHALL remain deterministic for the same route insights

### Requirement: Route risk formatter exposes symbol resolver helper

The system SHALL enforce this contract as part of the znake-refactor-route-risk-cue-helpers-v1 scope.

#### Scenario: Contract is applied
- **WHEN** the relevant runtime or UI path executes
- **THEN** the defined contract behavior is applied consistently
- **AND** deterministic simulation behavior remains unchanged.

### Requirement: Feedback tone profiles apply bounded gain and duration

The system SHALL enforce this contract as part of the znake-feedback-tone-profile-constraints-v1 scope.

#### Scenario: Contract is applied
- **WHEN** the relevant runtime or UI path executes
- **THEN** the defined contract behavior is applied consistently
- **AND** deterministic simulation behavior remains unchanged.



## ADDED Requirements

### Requirement: Enemy tick uses explicit strategy routing for special kinds

The system SHALL route special enemy tick behavior through explicit strategy selection before normal chase fallback.

#### Scenario: Special enemy kind selects deterministic strategy
- **WHEN** an enemy tick starts for a known special kind
- **THEN** the matching strategy handler is selected deterministically
- **AND** normal chase fallback executes only when no special strategy result applies.
