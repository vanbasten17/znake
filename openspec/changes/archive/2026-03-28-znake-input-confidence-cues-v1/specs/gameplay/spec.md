## ADDED Requirements

### Requirement: Ability readiness cues reflect active context

The system SHALL present ability-cooldown cue text from the currently active ability context.

#### Scenario: Cooldown cue switches by ability context
- **WHEN** ability hint context is evaluated
- **THEN** cooldown cue reflects venom context when active, otherwise body-pulse context
- **AND** cue values are derived from deterministic runtime state
