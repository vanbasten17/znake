# hand-drawn-aesthetics Specification

## Purpose
TBD - created by archiving change hand-drawn-neon-fusion. Update Purpose after archive.
## Requirements
### Requirement: Line Jitter (Procedural Wobble)
All line drawing MUST incorporate a "jitter" factor that adds small, random offsets (0.2 - 0.5px) to segment edges every few frames, simulating a pencil's imperfection.

#### Scenario: Turn Tension
- **WHEN** the snake turns rapidly
- **THEN** the jitter intensity MUST momentarily increase to 1.2px, visually expressing "tension" in the sketch.

### Requirement: Thick Inked Rim
Segments MUST have a thick, high-contrast dark "ink" stroke (2-3px) drawn behind the neon glow to separate them clearly from the background.

#### Scenario: Edge Separation
- **WHEN** two segments overlap or touch
- **THEN** the inked rim MUST remain visible for both, ensuring they don't visually merge into one blob.

### Requirement: Biome palettes follow contrast-safe color scripts
The scene renderer SHALL resolve deterministic per-biome color scripts that preserve readability and support high-contrast accessibility.

#### Scenario: Biome background and wall colors switch with active biome
- **WHEN** the active biome changes between `void-depths`, `crystal-caverns`, and `ember-fields`
- **THEN** background, grid, stars, and wall palette tones MUST switch to that biome script
- **AND** simulation timing and gameplay outcomes remain unchanged.

#### Scenario: High contrast mode raises key readability anchors
- **WHEN** high-contrast accessibility mode is active
- **THEN** wall outlines and stars MUST upgrade to high-contrast anchors
- **AND** biome identity tones remain visible in background and wall fills.
