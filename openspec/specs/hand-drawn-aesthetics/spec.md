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

