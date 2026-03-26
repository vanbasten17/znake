## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Floor progression

Portal flow and objective/reward timing transitions SHALL be handled by pure objective state machine helpers.

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
