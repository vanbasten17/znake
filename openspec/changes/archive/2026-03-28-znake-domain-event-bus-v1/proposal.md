## Why

Reduces tight coupling and clarifies cross-domain contracts.

## Key Points (Codex-style)

- What is changing
  - Introduce a typed domain event bus between simulation, UI, and telemetry adapters.
- Why we are doing it
  - Reduces tight coupling and clarifies cross-domain contracts.
- Impacted areas
  - Observability, scene glue, HUD update routing.
- Risks / unknowns
  - Event ordering bugs may appear without strict sequencing rules.

## What Changes

- Introduce a typed domain event bus between simulation, UI, and telemetry adapters.
- Define OpenSpec requirements and implementation tasks for Domain Event Bus.
- Keep simulation deterministic and preserve separation between simulation and rendering.

## Capabilities

### Modified Capabilities

- 
affected spec: `observability`

## Impact

- Affected code (expected):
  - 
  - 
  - 
- No dependency changes required for proposal stage.
