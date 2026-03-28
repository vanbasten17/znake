## Why

Improves extension speed and reduces regression risk in upgrade logic.

## Key Points (Codex-style)

- What is changing
  - Convert upgrade effects from switch chains to strategy registry modules.
- Why we are doing it
  - Improves extension speed and reduces regression risk in upgrade logic.
- Impacted areas
  - Upgrade identity system, gameplay effects, test fixtures.
- Risks / unknowns
  - Order-dependent effects may change if registration order is unclear.

## What Changes

- Convert upgrade effects from switch chains to strategy registry modules.
- Define OpenSpec requirements and implementation tasks for Upgrade Strategy Registry.
- Keep simulation deterministic and preserve separation between simulation and rendering.

## Capabilities

### Modified Capabilities

- 
affected spec: `upgrade-identity`

## Impact

- Affected code (expected):
  - 
  - 
  - 
- No dependency changes required for proposal stage.
