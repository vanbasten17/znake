## Why

Tight turns in high-speed moments can feel unresponsive when valid near-window input arrives just before turn eligibility.

## Key Points (Codex-style)

- What is changing
  - Add a deterministic short grace buffer for turn inputs.
- Why we are doing it
  - Improve responsiveness and perceived control without reducing skill ceiling.
- Impacted areas
  - Input pipeline timing, movement validity checks, HUD feedback.
- Risks / unknowns
  - Oversized grace windows can trivialize precision constraints.

## What Changes

- Define turn-input grace window bounds and priority rules.
- Specify conflict handling when multiple buffered commands exist.
- Add deterministic replay expectations for buffered execution.

## Capabilities

### Modified Capabilities

- affected spec: input-hud

## Impact

- Affected code (expected):
  - src/game/systems/inputCommandPipeline.ts
  - src/game/systems/input.ts
  - src/game/simulation/
  - tests/
