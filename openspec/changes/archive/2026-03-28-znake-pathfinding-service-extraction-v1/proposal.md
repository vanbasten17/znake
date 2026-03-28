## Why

Keeps enemy behavior modular and tunable without scene coupling.

## Key Points (Codex-style)

- What is changing
  - Extract enemy pathfinding rules into a service with strategy interfaces.
- Why we are doing it
  - Keeps enemy behavior modular and tunable without scene coupling.
- Impacted areas
  - Enemy AI, simulation updates, performance profiling.
- Risks / unknowns
  - Performance regressions if allocation patterns are not controlled.

## What Changes

- Extract enemy pathfinding rules into a service with strategy interfaces.
- Define OpenSpec requirements and implementation tasks for Pathfinding Service Extraction.
- Keep simulation deterministic and preserve separation between simulation and rendering.

## Capabilities

### Modified Capabilities

- 
affected spec: `enemy-role-taxonomy`

## Impact

- Affected code (expected):
  - 
  - 
  - 
- No dependency changes required for proposal stage.
