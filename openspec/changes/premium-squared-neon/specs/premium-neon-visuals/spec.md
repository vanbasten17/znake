## ADDED Requirements

### Requirement: Circuit-Core Snake Segments
Snake segments MUST transition from flat squares to rounded-rects with an internal "core" detail (e.g., a smaller concentric rectangle or 4 internal corner lines) that uses a high-contrast glow color.

#### Scenario: Turn Momentum
- **WHEN** the snake turns 90 degrees
- **THEN** a "spark" particle effect MUST trigger at the turn pivot point.

### Requirement: Threat-Neon Enemy Designs
Enemies MUST have a distinct "glowing aura" and internal geometry that changes based on their phase (e.g., pulsing faster when the boss is in 'rage' mode).

#### Scenario: Rage Mode Feedback
- **WHEN** the boss phase transitions to 'rage'
- **THEN** its internal core color MUST pulse with a high-intensity red bloom.
