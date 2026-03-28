## Why

Improves input reliability and simplifies adding new control schemes.

## Key Points (Codex-style)

- What is changing
  - Refactor input handling into command objects validated before simulation apply.
- Why we are doing it
  - Improves input reliability and simplifies adding new control schemes.
- Impacted areas
  - Input stack, simulation command application, replay traces.
- Risks / unknowns
  - Command validation rules may reject legacy edge inputs.

## What Changes

- Refactor input handling into command objects validated before simulation apply.
- Define OpenSpec requirements and implementation tasks for Input Command Pipeline.
- Keep simulation deterministic and preserve separation between simulation and rendering.

## Capabilities

### Modified Capabilities

- 
affected spec: `input-hud`

## Impact

- Affected code (expected):
  - 
  - 
  - 
- No dependency changes required for proposal stage.
