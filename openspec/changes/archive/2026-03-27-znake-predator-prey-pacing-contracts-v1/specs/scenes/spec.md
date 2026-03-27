## ADDED Requirements

### Requirement: Predator-prey pacing readability surfaces in game scene

`GameScene` SHALL present concise pacing-readability cues from simulation-owned pacing state without owning pacing logic.

#### Scenario: Scene shows current pacing phase context

- **WHEN** gameplay pacing state changes or updates during an encounter
- **THEN** run HUD/status surfaces concise phase context (`hunt`, `escape`, `reset`) and transition imminence cues
- **AND** scene presentation does not mutate pacing transitions or guardrail outcomes

#### Scenario: Scene keeps pacing cues bounded for readability

- **WHEN** pacing cues are presented alongside existing pressure/status text
- **THEN** cues remain concise and non-overlapping on supported desktop and portrait mobile layouts
- **AND** existing hazard/objective readability remains intact
