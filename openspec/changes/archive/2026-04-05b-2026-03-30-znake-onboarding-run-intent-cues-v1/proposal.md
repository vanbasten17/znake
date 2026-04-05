## Why

New players lose runs before understanding enemy intent and objective priorities.

## Key Points (Codex-style)

- What is changing
  - Add first-run intent cues that highlight immediate danger and next best objective action.
- Why we are doing it
  - Improve early-run clarity and reduce avoidable first-session frustration.
- Impacted areas
  - Gameplay readability, onboarding flow, HUD cue timing.
- Risks / unknowns
  - Over-cueing can reduce mastery expression for experienced players.

## What Changes

- Define contracts for onboarding-intent cues during the first runs.
- Bound cues to deterministic game state transitions only.
- Specify validation expectations for readability and fairness.

## Capabilities

### Modified Capabilities

- affected spec: gameplay

## Impact

- Affected code (expected):
  - src/game/simulation/
  - src/game/systems/
  - src/game/scenes/
  - tests/
