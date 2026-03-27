# objective-reward-loop

Short-term room objectives and post-objective reward choices for run segments.

## Purpose

Define the behavior for data-driven room objectives, completion tracking, and tradeoff reward drafts in Znake.
## Requirements
### Requirement: Single active room objective

The system SHALL allow each test room or run segment to declare exactly one active objective from centralized data.

#### Scenario: Segment declares one active objective

- **WHEN** a room or run segment is initialized
- **THEN** runtime resolves exactly one objective definition from centralized config
- **AND** objective state starts in an active, incomplete state

#### Scenario: Objective definition is data-driven

- **WHEN** designers tune objective type, target, or supporting props
- **THEN** those values are read from centralized configuration
- **AND** scene code does not hardcode per-room target values inline

### Requirement: Objective progress state model

The system SHALL track objective progress through an explicit runtime state model.

#### Scenario: Progress updates match objective type

- **WHEN** runtime receives a progress event relevant to the active objective
- **THEN** objective state updates only the counters or timers used by that objective type
- **AND** unrelated progress fields do not affect completion

#### Scenario: Objective can complete only once

- **WHEN** objective progress reaches its configured completion threshold
- **THEN** the objective state is marked complete
- **AND** subsequent progress events do not retrigger completion

### Requirement: Reward draft after objective completion

The system SHALL present a reward choice immediately after objective completion, evaluate deterministic clean-play eligibility for the completed objective window, apply any configured clean-play bonus payout before the next segment starts, and preserve explicit loop milestones for completion and reward selection.

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

#### Scenario: Completion and reward-pick milestones remain distinct in runtime loop

- **WHEN** objective completion is resolved and reward drafting begins
- **THEN** completion moment state is represented before reward selection is confirmed
- **AND** reward selection is represented as a subsequent, distinct milestone in the same objective window

### Requirement: Tradeoff reward definitions

The system SHALL define first-pass reward options as paired upsides and downsides.

#### Scenario: Reward option exposes explicit tradeoff

- **WHEN** a reward option is shown to the player
- **THEN** its positive and negative effects are both visible in player-facing copy
- **AND** the option is not presented as a purely additive power gain

#### Scenario: Reward application is data-driven

- **WHEN** the player selects a reward option
- **THEN** the runtime applies the configured modifiers for that reward
- **AND** the effect values come from centralized config rather than overlay-local logic

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

