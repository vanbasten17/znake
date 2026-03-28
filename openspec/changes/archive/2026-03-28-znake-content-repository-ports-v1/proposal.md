## Why

Applies DIP and allows future content sources without touching consumers.

## Key Points (Codex-style)

- What is changing
  - Create repository interfaces for upgrades, enemies, and rooms with adapter implementations.
- Why we are doing it
  - Applies DIP and allows future content sources without touching consumers.
- Impacted areas
  - Content loading, factory systems, tooling hooks.
- Risks / unknowns
  - Interface sprawl can increase boilerplate if over-applied.

## What Changes

- Create repository interfaces for upgrades, enemies, and rooms with adapter implementations.
- Define OpenSpec requirements and implementation tasks for Content Repository Ports.
- Keep simulation deterministic and preserve separation between simulation and rendering.

## Capabilities

### Modified Capabilities

- 
affected spec: `tooling`

## Impact

- Affected code (expected):
  - 
  - 
  - 
- No dependency changes required for proposal stage.
