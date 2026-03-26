## ADDED Requirements

### Requirement: Event-choice progression points

The system SHALL support deterministic event-choice decision points in non-boss progression.

#### Scenario: Event-choice point enters pending state

- **WHEN** progression reaches an event-choice trigger for the current segment flow
- **THEN** gameplay enters an event-choice-pending state
- **AND** normal advancement pauses until one option is resolved

#### Scenario: Event-choice completion resumes progression

- **WHEN** an event option is resolved
- **THEN** progression updates run state using the selected deterministic payload
- **AND** segment advancement resumes from the post-event progression state

## MODIFIED Requirements

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

#### Scenario: Room objective transitions are state-machine driven

- **WHEN** room objective progress changes or completion is evaluated
- **THEN** objective state updates are produced by pure simulation helpers
- **AND** scene code handles runtime side effects such as HUD updates, feedback, and reward-overlay transitions

#### Scenario: Reward selection gates non-boss progression

- **WHEN** a non-boss segment objective is completed
- **THEN** progression pauses for reward selection
- **AND** the next segment begins only after the selected reward is applied

#### Scenario: Event-choice selection can gate non-boss progression

- **WHEN** a non-boss progression step enters an event-choice decision point
- **THEN** progression pauses for event-choice selection
- **AND** the next progression step begins only after the selected event outcome is applied
