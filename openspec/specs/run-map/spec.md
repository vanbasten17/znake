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

