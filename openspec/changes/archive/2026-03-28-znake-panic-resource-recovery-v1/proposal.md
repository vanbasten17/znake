## Why

Reduces frustration spikes while preserving challenge through strict limits.

## Key Points (Codex-style)

- What is changing
  - Add low-health recovery triggers that offer controlled comeback windows.
- Why we are doing it
  - Reduces frustration spikes while preserving challenge through strict limits.
- Impacted areas
  - Combat systems, consumable economy, fairness telemetry.
- Risks / unknowns
  - If too generous it can flatten difficulty.

## What Changes

- Add low-health recovery triggers that offer controlled comeback windows.
- Define OpenSpec requirements and implementation tasks for Panic Resource Recovery.
- Keep simulation deterministic and preserve separation between simulation and rendering.

## Capabilities

### Modified Capabilities

- affected spec: body-economy

## Impact

- Affected code (expected):
  - src/game/
  - src/styles/
  - tests/
- No dependency changes required for proposal stage.
