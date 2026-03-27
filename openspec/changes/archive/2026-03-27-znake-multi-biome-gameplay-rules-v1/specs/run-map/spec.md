## ADDED Requirements

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
