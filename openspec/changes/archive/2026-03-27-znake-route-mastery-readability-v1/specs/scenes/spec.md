## ADDED Requirements

### Requirement: Route-mastery readability in game and death scenes

Game and death scene presentation SHALL surface concise route-mastery readouts from deterministic summary state without owning metric logic.

#### Scenario: Game scene surfaces compact route-mastery status

- **WHEN** route status is presented during active run
- **THEN** `GameScene` can render compact route-mastery summary context from shared state
- **AND** scene does not mutate mastery metrics directly

#### Scenario: Death scene surfaces route-mastery recap context

- **WHEN** death recap is rendered
- **THEN** recap includes concise route-mastery summary fields from shared deterministic state
- **AND** recap remains readable within existing death overlay layout
