## ADDED Requirements

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
