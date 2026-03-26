## MODIFIED Requirements

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
