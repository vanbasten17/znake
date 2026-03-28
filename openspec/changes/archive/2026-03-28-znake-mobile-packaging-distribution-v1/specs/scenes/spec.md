## ADDED Requirements

### Requirement: App-shell lifecycle parity with web gameplay flow
The system SHALL preserve core gameplay lifecycle semantics between web runtime and packaged app-shell runtime.

#### Scenario: Pause/resume semantics remain parity-safe
- **WHEN** packaged app lifecycle transitions occur (background, foreground, resume)
- **THEN** scene flow preserves pause/resume safety and stale-input protections equivalent to web runtime behavior
- **AND** packaged lifecycle handling does not alter deterministic gameplay resolution rules

### Requirement: Packaged shell scene-flow compatibility
The system SHALL keep scene order and transition expectations compatible in packaged shell execution.

#### Scenario: Scene sequencing remains equivalent in packaged builds
- **WHEN** run starts and transitions through menu/game/upgrade/death in packaged shell runtime
- **THEN** scene sequencing and transition behavior remain equivalent to existing web flow expectations
- **AND** packaging integration does not move gameplay-rule ownership into scene shell glue

