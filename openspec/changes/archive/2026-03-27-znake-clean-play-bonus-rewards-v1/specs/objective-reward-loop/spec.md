## MODIFIED Requirements

### Requirement: Reward draft after objective completion

The system SHALL present a reward choice immediately after objective completion, evaluate deterministic clean-play eligibility for the completed objective window, and apply any configured clean-play bonus payout before the next segment starts.

#### Scenario: Completion opens reward choice with clean-play result

- **WHEN** the active objective becomes complete
- **THEN** the run enters a reward-pending state
- **AND** a reward draft with multiple options is generated
- **AND** clean-play eligibility for the completed objective window is resolved deterministically from tracked run state

#### Scenario: Progression waits for reward pick

- **WHEN** a reward draft is pending
- **THEN** segment progression does not continue
- **AND** progression resumes only after the player selects one reward option

#### Scenario: Clean-play bonus payout is bounded and one-shot per objective completion

- **WHEN** clean-play eligibility is true for the completed objective
- **THEN** the system applies exactly one clean-play bonus payout using centralized payout config
- **AND** the same objective completion cannot trigger additional clean-play bonus payouts

#### Scenario: Event-choice branch can replace reward draft at configured points

- **WHEN** progression enters a configured event-choice decision point instead of objective-completion reward flow
- **THEN** the run enters an event-choice-pending state
- **AND** progression resumes only after one event option is selected and resolved deterministically
