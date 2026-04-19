## ADDED Requirements

### Requirement: Game-scene input frame orchestration is delegated through scene helpers

The system SHALL keep frame-level virtual input orchestration in dedicated scene helper modules while preserving command-processing order and deterministic behavior.

#### Scenario: Game scene consumes virtual input through helper boundary
- **WHEN** `GameScene` processes per-frame virtual input (`dir`, `turn`, `pause`, `ability`)
- **THEN** scene code delegates orchestration to a scene-local helper
- **AND** existing acceptance/rejection behavior for movement commands remains equivalent
- **AND** pause/ability handling order remains equivalent

### Requirement: Menu challenge-share flow is delegated through scene helpers

The system SHALL route challenge-share import/export orchestration through scene helper modules without changing player-visible flow.

#### Scenario: Challenge-share export/import preserves behavior through helper boundary
- **WHEN** Menu challenge-share actions execute
- **THEN** copy/prompt behavior remains equivalent to previous scene behavior
- **AND** telemetry/feedback branches remain equivalent
- **AND** successful import still starts a run with shared-code seed/preset context
