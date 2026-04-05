## Why

Boss attacks can blend into visual noise during high-intensity moments, hurting fairness and readability.

## Key Points (Codex-style)

- What is changing
  - Define stronger telegraph contrast and timing contracts for boss attacks.
- Why we are doing it
  - Increase reaction fairness while preserving encounter intensity.
- Impacted areas
  - Boss cue timing, visual language, accessibility profiles.
- Risks / unknowns
  - Over-long telegraphs may reduce challenge depth.

## What Changes

- Establish minimum telegraph lead-time and contrast thresholds.
- Specify behavior for accessibility visual profiles.
- Add deterministic cue-state validation requirements.

## Capabilities

### Modified Capabilities

- affected spec: boss-encounter-depth

## Impact

- Affected code (expected):
  - src/game/simulation/
  - src/game/systems/bossCounterplayCue.ts
  - src/game/render/
  - tests/
