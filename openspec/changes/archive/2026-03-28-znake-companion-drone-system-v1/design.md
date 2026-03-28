## Context

Companion Drone System adds a lightweight support layer without introducing autonomous pathfinding complexity in this iteration.

## Key Points (Codex-style)

- What is changing
  - Add deterministic drone-support trigger logic with a fixed cooldown and bounded bonus payout.
- Why we are doing it
  - Introduces tactical rhythm and build flavor with low architecture risk.
- Impacted areas
  - Enemy defeat resolution, run HUD hint copy, deterministic system tests.
- Risks / unknowns
  - Bonus tuning may need follow-up balancing for elite-dense encounters.

## Goals / Non-Goals

Goals:
- Keep support logic pure and testable.
- Integrate with minimal `GameScene` footprint.
- Preserve deterministic behavior from identical inputs.

Non-Goals:
- Autonomous drone movement/pathfinding.
- New render entities or heavy UI overlays.

## Decisions

### Decision: Pure support resolver first
- Implement cooldown/trigger logic in a dedicated module.
- Rationale: keeps simulation-style logic testable and reusable.

### Decision: Minimal scene integration
- Trigger support on enemy defeat and show bounded feedback hint.
- Rationale: validates player-facing value without broad refactors.

## Risks / Trade-offs

- Risk: Score bonus cadence may be too generous at high enemy density.
- Trade-off: Starting with score support is simpler than full utility behavior and easier to rebalance.

## Validation Plan

1. Add deterministic unit tests for cooldown tick and trigger gating.
2. Run `pnpm check` and `pnpm build`.
3. Verify in playtest that hints appear at cooldown cadence and do not spam.
