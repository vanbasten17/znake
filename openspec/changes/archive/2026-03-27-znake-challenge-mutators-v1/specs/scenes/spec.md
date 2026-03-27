## ADDED Requirements

### Requirement: Mutator readability surfaces in game scene

The system SHALL present deterministic mutator readability cues through scene overlays without moving gameplay ownership into scene code.

#### Scenario: Pre-run mutator summary is shown
- **WHEN** a run starts with active mutators
- **THEN** GameScene surfaces a concise mutator summary payload before or at run entry
- **AND** summary text mirrors deterministic mutator config labels and effects

#### Scenario: Active mutator status remains readable in run HUD
- **WHEN** mutator effects are active during gameplay
- **THEN** run HUD or overlay shows bounded active mutator status cues suitable for desktop and portrait mobile
- **AND** scene presentation does not mutate mutator logic or resolution order
