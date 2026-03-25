## ADDED Requirements

### Requirement: Neon Bloom Pipeline
The engine MUST support a bloom effect that highlights bright colors (represented by the `glow` tokens in the `PAINT` record) to create a neon aura.

#### Scenario: Pulse Intensity
- **WHEN** the snake eats food
- **THEN** the bloom intensity MUST spike temporarily before fading back to baseline.

### Requirement: Scanlines and CRT Curvature
The game MUST render fine horizontal scanlines and a slight pincushion distortion to simulate the look of a classic arcade CRT monitor.

#### Scenario: Hit Feedback
- **WHEN** the snake hit a wall or enemy
- **THEN** the CRT curvature MUST jitter momentarily with a chromatic aberration effect.
