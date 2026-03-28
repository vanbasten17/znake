## Why

Simplifies asset lifecycle management and loading error handling.

## Key Points (Codex-style)

- What is changing
  - Introduce an asset loading facade that centralizes scene preload contracts.
- Why we are doing it
  - Simplifies asset lifecycle management and loading error handling.
- Impacted areas
  - Scene preload code, marker assets, fallback behavior.
- Risks / unknowns
  - Facade misuse can hide missing asset failures.

## What Changes

- Introduce an asset loading facade that centralizes scene preload contracts.
- Define OpenSpec requirements and implementation tasks for Asset Loading Facade.
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
