## ADDED Requirements

### Requirement: Elite and miniboss telegraph readability surfaces
`GameScene` SHALL present elite/miniboss phase readability cues from deterministic simulation state without owning encounter logic.

#### Scenario: Scene renders phase-aware warning cues
- **WHEN** elite/miniboss simulation state exposes current pattern phase and remaining phase timing
- **THEN** scene/HUD overlays surface concise telegraph and commit-readiness cues
- **AND** presentation consumes simulation-owned state without mutating encounter sequencing logic

### Requirement: Elite and miniboss encounter summary readability
The system SHALL provide concise post-encounter readability context for player learning without introducing non-deterministic flow changes.

#### Scenario: Post-encounter summary reflects deterministic encounter context
- **WHEN** an elite/miniboss encounter resolves
- **THEN** scene overlay can show concise readable summary context (encounter type, key avoided/hit patterns, and gate outcome)
- **AND** summary content is sourced from deterministic encounter and telemetry-ready state payloads

#### Scenario: Mobile and desktop layouts preserve cue readability
- **WHEN** elite/miniboss cues and summary overlays are shown on supported layouts
- **THEN** warning and summary copy remain readable within portrait mobile and desktop constraints
- **AND** cue overlays do not hide critical movement-space information near the player head
