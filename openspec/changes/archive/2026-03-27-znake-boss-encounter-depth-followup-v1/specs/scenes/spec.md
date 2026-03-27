## ADDED Requirements

### Requirement: Boss encounter identity readability surfaces
`GameScene` SHALL present concise boss identity and phase-readability cues from deterministic simulation payloads without owning encounter logic.

#### Scenario: Scene surfaces boss identity and phase from simulation-owned payload
- **WHEN** a boss encounter is active and simulation exposes boss identity/phase readability state
- **THEN** scene/HUD shows concise boss identity and phase cue text suitable for desktop and mobile layouts
- **AND** cue rendering does not mutate encounter sequencing or fairness logic

### Requirement: Boss encounter summary readability
The system SHALL present concise post-boss summary context sourced from deterministic encounter payloads.

#### Scenario: Post-boss summary remains bounded and deterministic
- **WHEN** a boss encounter resolves or the run ends after boss pressure events
- **THEN** scene recap surfaces concise boss summary context (identity, key phase reached, bounded failure-reason counts)
- **AND** summary content is sourced from deterministic gameplay/telemetry-ready state only
