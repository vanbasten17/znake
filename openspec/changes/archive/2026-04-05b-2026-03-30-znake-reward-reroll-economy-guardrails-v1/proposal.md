## Why

Reroll decisions can feel binary and swingy, reducing strategic depth in the reward loop.

## Key Points (Codex-style)

- What is changing
  - Introduce economy guardrails for reward rerolls to smooth risk/reward pacing.
- Why we are doing it
  - Preserve excitement while reducing dead-end economy outcomes.
- Impacted areas
  - Reward loop, resource economy, progression fairness.
- Risks / unknowns
  - Too many safeguards could remove meaningful reroll tension.

## What Changes

- Define reroll cost scaling and floor/ceiling guardrails.
- Define interaction with run-stage and objective completion state.
- Add deterministic balancing contract for reroll outcomes.

## Capabilities

### Modified Capabilities

- affected spec: objective-reward-loop

## Impact

- Affected code (expected):
  - src/game/core/rewards.ts
  - src/game/core/objectives.ts
  - src/game/simulation/
  - tests/
