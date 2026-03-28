## Why

Improves fairness and keeps tension curves readable instead of random spikes.

## Key Points (Codex-style)

- What is changing
  - Introduce a director that adjusts room pressure using run state, health trend, and recent mistakes.
- Why we are doing it
  - Improves fairness and keeps tension curves readable instead of random spikes.
- Impacted areas
  - Simulation pacing, room generation, balance tables, telemetry.
- Risks / unknowns
  - Director overfitting may reduce variety if constraints are too tight.

## What Changes

- Introduce a director that adjusts room pressure using run state, health trend, and recent mistakes.
- Define OpenSpec requirements and implementation tasks for Adaptive Room Director.
- Keep simulation deterministic and preserve separation between simulation and rendering.

## Capabilities

### Modified Capabilities

- affected spec: progression-director

## Impact

- Affected code (expected):
  - src/game/
  - src/styles/
  - tests/
- No dependency changes required for proposal stage.
