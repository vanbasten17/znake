## ADDED Requirements

### Requirement: Event-choice outcomes align with reward identity

The system SHALL align event-choice option outcomes with existing reward identity language and tradeoff goals.

#### Scenario: Event option identity metadata is available

- **WHEN** an event option is drafted
- **THEN** it includes identity metadata compatible with existing reward families or role labels
- **AND** presentation can explain how the option influences playstyle

#### Scenario: Event tradeoffs remain explicit

- **WHEN** an event option is displayed
- **THEN** its upside and downside are both surfaced in player-facing copy
- **AND** option wording does not imply pure additive gain without cost

## MODIFIED Requirements

### Requirement: Reward draft after objective completion

The system SHALL present a reward choice immediately after objective completion and before the next segment starts.

#### Scenario: Completion opens reward choice

- **WHEN** the active objective becomes complete
- **THEN** the run enters a reward-pending state
- **AND** a reward draft with multiple options is generated

#### Scenario: Progression waits for reward pick

- **WHEN** a reward draft is pending
- **THEN** segment progression does not continue
- **AND** progression resumes only after the player selects one reward option

#### Scenario: Event-choice branch can replace reward draft at configured points

- **WHEN** progression enters a configured event-choice decision point instead of objective-completion reward flow
- **THEN** the run enters an event-choice-pending state
- **AND** progression resumes only after one event option is selected and resolved deterministically
