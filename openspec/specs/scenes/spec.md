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

### Requirement: Game scene

The system SHALL render gameplay UI text in the active locale.

#### Scenario: Biome name localized in-game

- **WHEN** game scene updates floor progress label
- **THEN** biome name is rendered in the selected locale

### Requirement: Upgrade scene

The system SHALL render upgrade UI text in the active locale.

#### Scenario: Upgrade scene localized

- **WHEN** upgrade scene is shown
- **THEN** floor-cleared and upgrade-choice labels are localized
- **AND** upgrade card names and descriptions are localized

### Requirement: Death scene

The system SHALL render death summary text in the active locale.

#### Scenario: Death summary localized

- **WHEN** death scene is shown
- **THEN** summary labels, action labels, and rewards text are localized
- **AND** earned-upgrade names are localized

#### Scenario: Death scene uses DOM vertical slice

- **WHEN** death scene is active
- **THEN** death summary composition is rendered via DOM overlay in game area
- **AND** next-run and main-menu actions remain behaviorally equivalent

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

The system SHALL render upgrade selection in a portrait-first polished composition aligned with the approved reference.

#### Scenario: Upgrade selection fits vertical layout

- **WHEN** floor-clear upgrade scene is shown
- **THEN** title, subtitle, and three upgrade cards fit without overlap
- **AND** card hit zones remain fully interactive

#### Scenario: Upgrade selection uses DOM vertical slice

- **WHEN** upgrade scene is active
- **THEN** upgrade selection content is rendered via DOM overlay in the game area
- **AND** scene behavior (pick flow, transitions, keyboard shortcuts) remains equivalent

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

