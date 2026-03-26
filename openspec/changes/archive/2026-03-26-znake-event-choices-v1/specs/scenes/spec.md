## ADDED Requirements

### Requirement: Event-choice overlay readability

The system SHALL present event options in a concise readable overlay that communicates risk and reward before confirmation.

#### Scenario: Event options stay concise and legible

- **WHEN** an event-choice overlay is shown
- **THEN** it presents two to three options with clear labels and short risk/reward copy
- **AND** option content remains readable within supported desktop and mobile layouts

#### Scenario: Confirmation prevents accidental irreversible picks

- **WHEN** a player selects an irreversible high-impact event option
- **THEN** the overlay requires explicit confirmation before resolution
- **AND** cancellation returns focus to option selection without applying effects

### Requirement: Event-choice resolution feedback

The system SHALL provide short deterministic feedback cues after event resolution.

#### Scenario: Resolution summary reflects selected payload

- **WHEN** an event option resolves
- **THEN** the overlay or HUD shows a short summary of applied costs and benefits
- **AND** the summary text matches the configured deterministic outcome payload

## MODIFIED Requirements

### Requirement: Game-scene feedback orchestration

`GameScene` SHALL orchestrate lightweight readability-first feedback without taking ownership of gameplay rules.

#### Scenario: Scene routes event moments through shared feedback helpers

- **WHEN** damage, pickup, or objective-complete outcomes are resolved
- **THEN** `GameScene` routes those moments through reusable feedback hooks/state
- **AND** gameplay resolution still comes from existing simulation and scene outcome logic

#### Scenario: Objective celebration stays bounded

- **WHEN** a reward-ready or completion celebration is shown
- **THEN** the scene keeps the emphasis short and localized
- **AND** hazards, reward prompts, and player position remain readable during the cue

#### Scenario: Event-choice moments follow orchestrator boundary

- **WHEN** an event-choice draft is presented or resolved
- **THEN** `GameScene` orchestrates overlay presentation and feedback timing only
- **AND** option drafting and effect resolution remain in deterministic simulation/config helpers
