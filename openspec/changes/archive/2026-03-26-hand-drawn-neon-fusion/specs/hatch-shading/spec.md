## ADDED Requirements

### Requirement: Cross-Hatch Interior
Segment interiors MUST replace smooth gradients with a diagonal "hatching" pattern (e.g., 45-degree lines) that is also procedurally wobbly.

#### Scenario: Pulse Shading
- **WHEN** the neon segment pulses
- **THEN** the hatching thickness MUST oscillate, giving the impression of "changing pressure" on the pencil.

### Requirement: Dark Cross-Hatching (Shadow)
The "shadow" side of segments (away from movement direction) MUST feature denser, darker cross-hatching to simulate 3D volume in a hand-drawn style.

#### Scenario: Inertia Shadow
- **WHEN** the snake moves at high speed
- **THEN** the hatching MUST tilt slightly in the opposite direction of the velocity vector to emphasize motion.
