## MODIFIED Requirements

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
