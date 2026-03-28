## ADDED Requirements

### Requirement: Boss phases expose counterplay windows and punish loops

The system SHALL expose deterministic boss counterplay cue copy that labels windows and punish loops per phase.

#### Scenario: Boss cues label window and punish loop phases
- **WHEN** boss encounter readability phase is telegraph, commit, or recovery
- **THEN** cue text labels the expected counterplay window or punish loop for that phase
- **AND** cue copy includes deterministic boss identity/remix context.

#### Scenario: Elite cues follow same deterministic phase mapping
- **WHEN** elite miniboss cue text is resolved from phase state
- **THEN** phase labels map to deterministic window/punish copy
- **AND** same phase inputs always produce identical cue output.
