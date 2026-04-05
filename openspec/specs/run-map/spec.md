# run-map Specification

## Purpose
TBD - created by archiving change znake-room-type-run-map-v1. Update Purpose after archive.
## Requirements
### Requirement: Explicit room-type node graph

The system SHALL represent a run as a deterministic node graph where each node declares an explicit room type and outbound route choices.

#### Scenario: Node declares stable room-type metadata

- **WHEN** a run map node is generated
- **THEN** it includes a room type from the first-pass set `combat`, `elite`, `shop`, `rest`, or `event`
- **AND** it includes stable metadata for depth and reachable next nodes

#### Scenario: Room graph is seed-deterministic

- **WHEN** the same run seed and map template are resolved
- **THEN** the generated node graph produces the same room types and edges
- **AND** route structure does not depend on scene-local randomness

### Requirement: Readable local route preview

The system SHALL expose a limited preview of upcoming room choices so the player can read the next routing decision without opening a full meta-progression map.

#### Scenario: Reachable next rooms are previewed

- **WHEN** the player reaches a route-decision point
- **THEN** the currently reachable next nodes are exposed for UI presentation
- **AND** each exposed node includes its room type and branch identity

#### Scenario: Preview horizon remains intentionally bounded

- **WHEN** route preview data is resolved
- **THEN** it is limited to a configured local horizon rather than the entire future run graph
- **AND** the horizon remains consistent for a given map template and seed

### Requirement: Room-type resolution contracts

The system SHALL define how each first-pass room type resolves progression without requiring all future room content to be fully implemented in this change.

#### Scenario: Combat room enters objective loop

- **WHEN** the selected node type is `combat`
- **THEN** the room resolves through the existing room objective and reward progression loop
- **AND** completion advances to the next reachable map node set

#### Scenario: Elite room enters higher-risk combat contract

- **WHEN** the selected node type is `elite`
- **THEN** the room resolves through the combat objective/reward flow with elite-specific risk intent
- **AND** the node remains distinguishable from standard combat in route preview data

#### Scenario: Non-combat room reserves stable future hook

- **WHEN** the selected node type is `shop`, `rest`, or `event`
- **THEN** the node resolves through a non-combat room contract with explicit entry and exit points
- **AND** progression returns to the run map cleanly after that room resolves

### Requirement: Deterministic biome assignment in run-map nodes
The system SHALL assign biome context to run-map progression nodes deterministically for equivalent run seed and template inputs.

#### Scenario: Node biome assignment is seed-stable
- **WHEN** the same run seed and run-map template are resolved
- **THEN** each node's biome assignment is reproduced deterministically
- **AND** biome assignment does not depend on scene-local random calls

#### Scenario: Biome assignment metadata is available before room entry
- **WHEN** reachable next nodes are exposed for route preview
- **THEN** each node includes deterministic biome metadata required for upcoming gameplay-rule activation context
- **AND** metadata is available without entering the room

### Requirement: Run-map contracts include biome activation context
The system SHALL expose run-map biome metadata required by gameplay-rule activation and readability contracts.

#### Scenario: Selected node provides biome activation payload
- **WHEN** the player selects a reachable next room node
- **THEN** progression receives biome identifier and activation-context metadata for deterministic biome-rule resolution
- **AND** metadata handoff occurs before gameplay simulation begins the next segment

#### Scenario: Route preview communicates biome-informed decision context
- **WHEN** route-decision UI shows reachable choices
- **THEN** preview data can communicate concise biome context alongside room type
- **AND** displayed context remains consistent with deterministic activation payload that will apply after selection

### Requirement: Route-decision mastery capture points

The system SHALL capture deterministic route-mastery metrics when route decisions are committed.

#### Scenario: Route commit updates mastery summary

- **WHEN** player commits a route choice from available branch options
- **THEN** route-mastery summary updates deterministic counters from chosen option and local preview context
- **AND** capture logic does not modify run-map generation outcomes

### Requirement: Run-map depth-band balancing context
The system SHALL expose deterministic depth-band balancing context in run-map progression metadata for floors 1-15.

#### Scenario: Node progression resolves stable depth-band context
- **WHEN** a run-map node is generated or selected
- **THEN** node-derived progression context includes a deterministic depth-band label for bounded balancing systems
- **AND** depth-band resolution is reproducible from the same seed/template inputs

#### Scenario: Route preview can expose depth-band decision context
- **WHEN** reachable next nodes are surfaced in route preview
- **THEN** preview data can include bounded depth-band context alongside room and biome metadata
- **AND** context remains consistent with the balancing payload that will apply after selection

### Requirement: Route-preview cards expose deterministic risk forecast

The system SHALL expose a deterministic route risk forecast for each route-choice card using only route-preview metadata already resolved from the run-map state.

#### Scenario: Forecast score resolves from selected room and local preview
- **WHEN** route-choice cards are rendered for a route-decision point
- **THEN** each card resolves a deterministic risk forecast score from selected room-type and bounded preview composition
- **AND** the same seed and route-preview payload produce the same forecast score and level

#### Scenario: Forecast readability remains bounded and non-authoritative
- **WHEN** risk forecast text is displayed
- **THEN** it uses bounded levels (`LOW`, `MEDIUM`, `HIGH`) suitable for quick commit decisions
- **AND** forecast presentation does not alter simulation, route generation, or route outcome contracts

### Requirement: Route-choice cards expose deterministic tactical support lines

The system SHALL expose deterministic tactical support lines on route-choice cards derived only from already-resolved route preview metadata.

#### Scenario: Card lines expose pressure and recovery context
- **WHEN** route-choice cards are rendered
- **THEN** each card includes deterministic pressure/recovery context derived from selected room and bounded preview composition
- **AND** context derivation does not modify route generation or room outcomes

#### Scenario: Card lines expose depth and biome pivot context
- **WHEN** selected route metadata differs by depth band or biome
- **THEN** route-choice cards can expose deterministic depth and biome-pivot context for readability
- **AND** exposed context remains consistent with selected route payload

### Requirement: Route-choice overlay framing clarifies risk semantics

The system SHALL provide bounded framing text so route risk levels remain interpretable at commit time.

#### Scenario: Overlay framing includes mastery-aware subtitle and risk legend
- **WHEN** route-choice overlay opens with multiple route options
- **THEN** subtitle can include current route-mastery short summary
- **AND** overlay includes a compact risk-level legend explaining low/medium/high semantics

### Requirement: Route selection presents deterministic risk preview bands

The system SHALL expose a deterministic route-risk preview before route lock-in.

#### Scenario: Player inspects route options before commit
- WHEN route options are presented
- THEN each route shows one configured risk band and concise reason tags
- AND the same seed and state produce the same preview labels

