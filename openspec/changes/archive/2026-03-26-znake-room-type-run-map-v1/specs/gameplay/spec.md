## MODIFIED Requirements

### Requirement: Floor progression

Portal flow, run-map routing, and objective/reward timing transitions SHALL be handled by pure progression state helpers.

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

#### Scenario: Run-map route selection drives next room type

- **WHEN** a route-decision point is reached after room resolution
- **THEN** the next room is selected from the deterministic reachable run-map nodes
- **AND** room setup reads the selected node type instead of assuming uniform linear advancement

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
