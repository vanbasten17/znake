## Why

Improves maintainability and removes transition logic from scene orchestration.

## Key Points (Codex-style)

- What is changing
  - Extract menu, run, pause, and death transitions into a dedicated scene state machine.
- Why we are doing it
  - Improves maintainability and removes transition logic from scene orchestration.
- Impacted areas
  - Scenes architecture, transition guards, tests.
- Risks / unknowns
  - Migration mistakes can break flow between scenes.

## What Changes

- Extract menu, run, pause, and death transitions into a dedicated scene state machine.
- Define OpenSpec requirements and implementation tasks for Scene State Machine Split.
- Keep simulation deterministic and preserve separation between simulation and rendering.

## Capabilities

### Modified Capabilities

- 
affected spec: `scenes`

## Impact

- Affected code (expected):
  - 
  - 
  - 
- No dependency changes required for proposal stage.
