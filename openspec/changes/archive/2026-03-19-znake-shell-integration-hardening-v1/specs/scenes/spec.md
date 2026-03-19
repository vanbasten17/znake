## ADDED Requirements

### Requirement: Stable scene handoff for DOM shell

The system SHALL perform scene transitions through a stable handoff path that prevents stale input and visual shell drift.

#### Scenario: Transition pre-cleans transient input

- **WHEN** a scene transitions to another scene
- **THEN** pending virtual input flags are reset before destination scene starts
- **AND** destination scene does not consume stale directional or action commands from prior scene interaction

#### Scenario: Shell mode can be pre-aligned at handoff

- **WHEN** a transition changes shell context (for example menu to run shell)
- **THEN** shell chrome mode can be applied before destination scene startup
- **AND** visible layout jumps between source and destination shell are minimized

#### Scenario: Scene shutdown clears scene-specific listeners

- **WHEN** a scene is shut down during transition
- **THEN** scene-specific keyboard listeners are removed
- **AND** transient scene HUD status does not leak into the next non-run overlay
