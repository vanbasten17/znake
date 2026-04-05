## Context

This is a gameplay-scoring change and should remain deterministic, testable, and routed through gameplay/core logic.
`GameScene` should consume resolved scoring outcomes rather than own the rule.

## Key Points (Codex-style)

- What is changing
  - Introduce a food-chain bonus window: after every 5 foods, next food gets extra points.
- Why we are doing it
  - Improves scoring rhythm and positive feedback without changing snake movement/collision rules.
- Impacted areas
  - Core scoring resolver, food pickup scoring path, deterministic unit tests.
- Risks / unknowns
  - Over-rewarding can distort score pacing; inline scene logic can violate architecture guardrails.

## Goals / Non-Goals

Goals:
- Keep bonus-window rules in gameplay/core module with pure functions.
- Keep scene changes minimal and orchestration-only.
- Validate deterministic arm/consume/rearm behavior with tests.

Non-Goals:
- UI-specific bonus indicators or HUD redesign.
- Rebalance broad score systems or unrelated pickups.
- Large scene refactors.

## Decisions

### Decision: Pure resolver + scene orchestration
- Implement `createInitialFoodBonusWindowState` and `resolveFoodBonusScore` in `src/game/core/**`.
- Scene only updates local runtime state and applies returned score delta.

### Decision: One-food bonus window
- Use a one-food window to keep behavior simple and deterministic.
- Trigger interval remains fixed at 5 foods.

## Risks / Trade-offs

- Risk: score inflation if bonus value is too high.
- Trade-off: a conservative multiplier may feel subtle but keeps progression stable.

## Validation Plan

1. Unit tests for resolver behavior (trigger, consume, deterministic rearm).
2. `pnpm check` and `pnpm test` for gameplay change gates.
3. `pnpm build` only if architecture-sensitive deltas are introduced.
