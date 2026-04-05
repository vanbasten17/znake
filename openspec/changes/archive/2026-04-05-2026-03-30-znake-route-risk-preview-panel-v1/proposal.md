## Why

Route decisions are currently made with limited forward risk readability, leading to avoidable frustration spikes.

## Key Points (Codex-style)

- What is changing
  - Add a compact route-risk preview panel before route lock-in.
- Why we are doing it
  - Improve fairness by making tradeoffs legible before commitment.
- Impacted areas
  - Run-map selection UX, risk forecast presentation, balance readability.
- Risks / unknowns
  - Exposing too much certainty can flatten strategic tension.

## What Changes

- Define route-risk preview contract and information budget.
- Specify deterministic risk-band generation for preview labels.
- Clarify what must remain hidden to preserve discovery.

## Capabilities

### Modified Capabilities

- affected spec: run-map

## Impact

- Affected code (expected):
  - src/game/simulation/runMap.ts
  - src/game/systems/
  - src/game/scenes/
  - tests/
