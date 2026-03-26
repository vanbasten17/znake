## ADDED Requirements

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
