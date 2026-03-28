## Why

Strengthens deterministic core boundaries and testability.

## Key Points (Codex-style)

- What is changing
  - Move tick orchestration into a pure simulation step service with injected dependencies.
- Why we are doing it
  - Strengthens deterministic core boundaries and testability.
- Impacted areas
  - Game core loop, simulation pipeline, replay checks.
- Risks / unknowns
  - Boundary churn may temporarily duplicate code paths.

## What Changes

- Move tick orchestration into a pure simulation step service with injected dependencies.
- Define OpenSpec requirements and implementation tasks for Simulation Step Service Boundary.
- Keep simulation deterministic and preserve separation between simulation and rendering.

## Capabilities

### Modified Capabilities

- 
affected spec: `game-core`

## Impact

- Affected code (expected):
  - 
  - 
  - 
- No dependency changes required for proposal stage.
