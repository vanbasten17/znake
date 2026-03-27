# scenes

Phaser scene flow and lifecycle (Menu, Game, Upgrade, Death).

## Purpose

Define expected scene sequencing, transitions, and lifecycle responsibilities for core gameplay flow.
## Requirements
### Requirement: Scene order and bootstrap

The system SHALL register scenes in order Menu → Game → Upgrade → Death and start with Menu.

#### Scenario: Phaser starts with Menu

- **WHEN** createGame() is called
- **THEN** scene order is [MenuScene, GameScene, UpgradeScene, DeathScene] and Menu is first active

#### Scenario: Pixel art rendering

- **WHEN** Phaser game is created
- **THEN** antialias=false, pixelArt=true, scale mode FIT, centered

---

### Requirement: Menu scene

The system SHALL support a reference-driven polished menu visual identity without changing menu behavior.

#### Scenario: Guide marker visuals reuse gameplay marker renderer

- **WHEN** glossary markers are rendered in menu guide
- **THEN** icon primitives are produced from the shared marker renderer used by gameplay
- **AND** guide and in-game marker icons remain visually consistent from the same source mapping
- **AND** when `marker_<tone>.png` loads successfully for a tone, that bitmap is used for that tone’s icon; otherwise procedural art is used for that tone

### Requirement: Game scene

The system SHALL render gameplay UI text in the active locale and orchestrate local run-map route presentation without taking ownership of progression rules.

#### Scenario: Biome name localized in-game

- **WHEN** game scene updates floor progress label
- **THEN** biome name is rendered in the selected locale

#### Scenario: Route choices are scene-orchestrated from run-map state

- **WHEN** the player reaches a route-decision point
- **THEN** `GameScene` reads the reachable room choices from shared run-map state
- **AND** presents them through existing HUD or DOM overlay patterns without generating branch rules inline

#### Scenario: Scene enters selected room through room-type contract

- **WHEN** the player selects an available next room
- **THEN** `GameScene` starts the resolved room using the selected node type and metadata
- **AND** room-specific logic remains delegated to shared gameplay or future room-resolution helpers

### Requirement: Dev reference board marker preview

When the **dev reference board** scenario is active, the system SHALL render each glossary marker preview cell using the same **hi-res marker textures** (`marker_hi_<tone>`) used for gameplay world markers, so optional `marker_<tone>.png` bitmaps and procedural fallbacks match guide and in-game appearance.

#### Scenario: Reference grid uses texture keys

- **WHEN** reference board mode is active and reference marker cells are drawn
- **THEN** each cell uses `Phaser.GameObjects.Image` with `markerTextureKey(tone)` for that cell’s tone
- **AND** those previews do not use `drawMarkerSpritePhaser` alone for the marker interior

### Requirement: Upgrade scene

The system SHALL render upgrade UI text in the active locale.

#### Scenario: Upgrade scene localized

- **WHEN** upgrade scene is shown
- **THEN** floor-cleared and upgrade-choice labels are localized
- **AND** upgrade card names and descriptions are localized

### Requirement: Death scene

The system SHALL render death summary text in the active locale and include concise clean-play recap context derived from resolved run data.

#### Scenario: Death summary localized

- **WHEN** death scene is shown
- **THEN** summary labels, action labels, and rewards text are localized
- **AND** earned-upgrade names are localized

#### Scenario: Death scene uses DOM vertical slice

- **WHEN** death scene is active
- **THEN** death summary composition is rendered via DOM overlay in game area
- **AND** next-run and main-menu actions remain behaviorally equivalent

#### Scenario: Death recap surfaces clean-play bonus summary

- **WHEN** death scene is shown after one or more completed objectives in a run
- **THEN** recap includes a concise clean-play summary based on resolved objective outcomes
- **AND** recap can communicate clean clear count and total clean-play bonus payout with readable fallback text when none were earned

### Requirement: Relic draft polished composition

The system SHALL render relic selection in a portrait-first polished composition aligned with the approved reference.

#### Scenario: Relic selection fits vertical layout

- **WHEN** relic draft scene is shown
- **THEN** title, subtitle, and three relic cards fit without overlap
- **AND** card hit zones remain fully interactive

#### Scenario: Relic selection uses DOM vertical slice

- **WHEN** relic draft scene is active
- **THEN** relic selection content is rendered via DOM overlay in the game area
- **AND** scene behavior (pick flow, transitions, keyboard shortcuts) remains equivalent

### Requirement: Upgrade selection polished composition

The system SHALL render upgrade selection in a portrait-first polished composition aligned with the approved reference while clearly surfacing family identity and decision context.

#### Scenario: Upgrade selection fits vertical layout

- **WHEN** floor-clear upgrade scene is shown
- **THEN** title, subtitle, and three upgrade cards fit without overlap
- **AND** card hit zones remain fully interactive

#### Scenario: Upgrade selection uses DOM vertical slice

- **WHEN** upgrade scene is active
- **THEN** upgrade selection content is rendered via DOM overlay in the game area
- **AND** scene behavior (pick flow, transitions, keyboard shortcuts) remains equivalent

#### Scenario: Upgrade cards show family identity

- **WHEN** upgrade choices are shown
- **THEN** each card communicates the upgrade family and short gameplay purpose
- **AND** tradeoff-oriented copy remains readable without inspecting external menus

### Requirement: Stable scene handoff for DOM shell

The system SHALL perform scene transitions through a stable handoff path that prevents stale input and visual shell drift.

#### Scenario: Transition pre-cleans transient input

- **WHEN** a scene transitions to another scene
- **THEN** pending virtual input flags are reset before destination scene starts
- **AND** destination scene does not consume stale directional or action commands from prior scene interaction

#### Scenario: Shell mode can be pre-aligned at handoff

- **WHEN** a transition changes shell context (for example menu to run shell)
- **THEN** shell chrome mode can be applied before destination scene startup
- **AND** visible layout jumps between source and destination shell are minimized

#### Scenario: Scene shutdown clears scene-specific listeners

- **WHEN** a scene is shut down during transition
- **THEN** scene-specific keyboard listeners are removed
- **AND** transient scene HUD status does not leak into the next non-run overlay

### Requirement: Readable DOM menu overlays

The system SHALL keep DOM menu overlays behaviorally equivalent while improving textual readability and hierarchy.

#### Scenario: Core menu copy remains readable on portrait mobile

- **WHEN** menu scene is displayed on portrait touch devices
- **THEN** title, stats, talent rows, goals, and CTA text remain clearly readable
- **AND** no interaction targets or scene flow behavior are changed

#### Scenario: Relic, upgrade, and death copy maintain clear hierarchy

- **WHEN** relic draft, upgrade, or death overlays are shown
- **THEN** headings, descriptions, and metadata use consistent visual hierarchy
- **AND** selection and transition behavior remains equivalent to pre-polish flow

### Requirement: Elimination run status readability

The system SHALL communicate elimination-floor combat status in run HUD text.

#### Scenario: Venom readiness appears in run status

- **WHEN** elimination run is active
- **THEN** run status includes venom charge/cooldown readiness text
- **AND** status is localized to active language

### Requirement: Game-scene feedback orchestration

`GameScene` SHALL orchestrate lightweight readability-first feedback without taking ownership of gameplay rules.

#### Scenario: Scene routes event moments through shared feedback helpers

- **WHEN** damage, pickup, or objective-complete outcomes are resolved
- **THEN** `GameScene` routes those moments through reusable feedback hooks/state
- **AND** gameplay resolution still comes from existing simulation and scene outcome logic

#### Scenario: Objective celebration stays bounded

- **WHEN** a reward-ready or completion celebration is shown
- **THEN** the scene keeps the emphasis short and localized
- **AND** hazards, reward prompts, and player position remain readable during the cue

#### Scenario: Event-choice moments follow orchestrator boundary

- **WHEN** an event-choice draft is presented or resolved
- **THEN** `GameScene` orchestrates overlay presentation and feedback timing only
- **AND** option drafting and effect resolution remain in deterministic simulation/config helpers

### Requirement: Event-choice overlay readability

The system SHALL present event options in a concise readable overlay that communicates risk and reward before confirmation.

#### Scenario: Event options stay concise and legible

- **WHEN** an event-choice overlay is shown
- **THEN** it presents two to three options with clear labels and short risk/reward copy
- **AND** option content remains readable within supported desktop and mobile layouts

#### Scenario: Confirmation prevents accidental irreversible picks

- **WHEN** a player selects an irreversible high-impact event option
- **THEN** the overlay requires explicit confirmation before resolution
- **AND** cancellation returns focus to option selection without applying effects

### Requirement: Event-choice resolution feedback

The system SHALL provide short deterministic feedback cues after event resolution.

#### Scenario: Resolution summary reflects selected payload

- **WHEN** an event option resolves
- **THEN** the overlay or HUD shows a short summary of applied costs and benefits
- **AND** the summary text matches the configured deterministic outcome payload

### Requirement: Mutator readability surfaces in game scene

The system SHALL present deterministic mutator readability cues through scene overlays without moving gameplay ownership into scene code.

#### Scenario: Pre-run mutator summary is shown
- **WHEN** a run starts with active mutators
- **THEN** GameScene surfaces a concise mutator summary payload before or at run entry
- **AND** summary text mirrors deterministic mutator config labels and effects

#### Scenario: Active mutator status remains readable in run HUD
- **WHEN** mutator effects are active during gameplay
- **THEN** run HUD or overlay shows bounded active mutator status cues suitable for desktop and portrait mobile
- **AND** scene presentation does not mutate mutator logic or resolution order

### Requirement: Elite and miniboss telegraph readability surfaces
`GameScene` SHALL present elite/miniboss phase readability cues from deterministic simulation state without owning encounter logic.

#### Scenario: Scene renders phase-aware warning cues
- **WHEN** elite/miniboss simulation state exposes current pattern phase and remaining phase timing
- **THEN** scene/HUD overlays surface concise telegraph and commit-readiness cues
- **AND** presentation consumes simulation-owned state without mutating encounter sequencing logic

### Requirement: Elite and miniboss encounter summary readability
The system SHALL provide concise post-encounter readability context for player learning without introducing non-deterministic flow changes.

#### Scenario: Post-encounter summary reflects deterministic encounter context
- **WHEN** an elite/miniboss encounter resolves
- **THEN** scene overlay can show concise readable summary context (encounter type, key avoided/hit patterns, and gate outcome)
- **AND** summary content is sourced from deterministic encounter and telemetry-ready state payloads

#### Scenario: Mobile and desktop layouts preserve cue readability
- **WHEN** elite/miniboss cues and summary overlays are shown on supported layouts
- **THEN** warning and summary copy remain readable within portrait mobile and desktop constraints
- **AND** cue overlays do not hide critical movement-space information near the player head

### Requirement: Active biome-rule readability in GameScene
`GameScene` SHALL present active biome gameplay-rule context as concise tactical cues without owning biome-rule resolution logic.

#### Scenario: Scene surfaces deterministic active-rule summary
- **WHEN** a room or segment begins with active biome gameplay rules
- **THEN** GameScene displays concise active-rule summary cues sourced from deterministic simulation payloads
- **AND** cue content communicates movement/routing/survival impact in readable player-facing language

#### Scenario: HUD status reflects active biome rule state changes
- **WHEN** biome gameplay-rule state changes due to deterministic boundary activation or guardrail fallback
- **THEN** HUD/overlay status updates within bounded presentation timing
- **AND** update behavior does not mutate gameplay rule activation order

### Requirement: Biome-rule cue readability constraints
The system SHALL keep biome-rule readability cues legible across supported layouts while preserving movement-space visibility.

#### Scenario: Mobile and desktop layouts keep biome cues readable
- **WHEN** active biome-rule cues are shown on portrait mobile or desktop layouts
- **THEN** labels and short tactical descriptors remain readable without overlap with primary objective/status UI
- **AND** cues remain bounded in density to avoid cognitive overload during high-pressure moments

#### Scenario: Biome cues avoid obscuring critical movement information
- **WHEN** biome-rule overlays are visible during gameplay
- **THEN** cue placement does not hide critical movement-space information near the player head or immediate threat lanes
- **AND** presentation fallback behavior is applied when layout constraints are exceeded

### Requirement: Predator-prey pacing readability surfaces in game scene

`GameScene` SHALL present concise pacing-readability cues from simulation-owned pacing state without owning pacing logic.

#### Scenario: Scene shows current pacing phase context

- **WHEN** gameplay pacing state changes or updates during an encounter
- **THEN** run HUD/status surfaces concise phase context (`hunt`, `escape`, `reset`) and transition imminence cues
- **AND** scene presentation does not mutate pacing transitions or guardrail outcomes

#### Scenario: Scene keeps pacing cues bounded for readability

- **WHEN** pacing cues are presented alongside existing pressure/status text
- **THEN** cues remain concise and non-overlapping on supported desktop and portrait mobile layouts
- **AND** existing hazard/objective readability remains intact

### Requirement: Boss encounter identity readability surfaces
`GameScene` SHALL present concise boss identity and phase-readability cues from deterministic simulation payloads without owning encounter logic.

#### Scenario: Scene surfaces boss identity and phase from simulation-owned payload
- **WHEN** a boss encounter is active and simulation exposes boss identity/phase readability state
- **THEN** scene/HUD shows concise boss identity and phase cue text suitable for desktop and mobile layouts
- **AND** cue rendering does not mutate encounter sequencing or fairness logic

### Requirement: Boss encounter summary readability
The system SHALL present concise post-boss summary context sourced from deterministic encounter payloads.

#### Scenario: Post-boss summary remains bounded and deterministic
- **WHEN** a boss encounter resolves or the run ends after boss pressure events
- **THEN** scene recap surfaces concise boss summary context (identity, key phase reached, bounded failure-reason counts)
- **AND** summary content is sourced from deterministic gameplay/telemetry-ready state only

### Requirement: Menu progression unlock readiness surface
The system SHALL surface progression-gated feature unlock readiness in menu progression context without changing flow behavior.

#### Scenario: Menu goals title includes deterministic unlock readiness
- **WHEN** menu meta UI refreshes with current profile progression
- **THEN** goals/progression surface includes concise unlock readiness status derived from deterministic meta helper output
- **AND** start flow and talent/goal interactions remain behaviorally equivalent

### Requirement: Scene overlay semantic color consistency
The system SHALL apply shared semantic token families to key readability cues across menu and run-adjacent overlays.

#### Scenario: Key overlay cues use shared semantic tokens
- **WHEN** menu, death, reward, upgrade, or relic overlays render key semantic text accents
- **THEN** those accents use shared semantic token families for danger/heal/economy/control/elite intent
- **AND** scene flow and interaction behavior remain unchanged

#### Scenario: Mobile and desktop readability remains clear
- **WHEN** semantic token mappings are applied on portrait mobile and desktop
- **THEN** cue text remains readable and distinguishable
- **AND** no gameplay-state ownership moves into scene style logic

