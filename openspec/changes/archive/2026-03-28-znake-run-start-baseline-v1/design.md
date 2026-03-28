## Context

Run-start length is currently composed by adding centralized baseline data (`BALANCE.run.baseSnakeLength`) to progression-driven additive modifiers (`cfg.bonusStartLength`). Multiple systems already mutate `bonusStartLength` (talents, relics, rewards, upgrades), so the safest implementation path is to adjust baseline data only and strengthen deterministic tests around composition.

## Key Points (Codex-style)

- What is changing
  - Set baseline run-start length to `3` and preserve additive composition (`base + bonus`).
- Why we are doing it
  - Improve early-run fairness/readability while protecting progression value from regressions.
- Impacted areas
  - Balance config defaults, run-start spawn composition checks, deterministic tests.
- Risks / unknowns
  - Small tuning shift in floor-1 survivability; potential hidden coupling if any path assumes baseline `4`.

## Goals / Non-Goals

**Goals:**
- Keep run-start composition deterministic and data-driven.
- Preserve existing talent/relic/reward bonus stacking behavior.
- Add deterministic regression checks for baseline + bonus composition.

**Non-Goals:**
- No broad progression rebalance.
- No new relic/talent systems.
- No scene-level orchestration redesign.

## Decisions

1. Keep composition formula unchanged (`baseSnakeLength + bonusStartLength`) and only retune baseline value.
- Rationale: Lowest-risk path that preserves existing additive stacking semantics.
- Alternative considered: introducing a new composed helper field. Rejected to avoid unnecessary indirection for a single baseline retune.

2. Validate behavior through deterministic unit checks in core paths rather than scene-centric integration changes.
- Rationale: deterministic, fast, and aligned with simulation-first architecture.
- Alternative considered: adding visual/playback assertions. Rejected for fragility and lower signal for composition math.

3. Express the contract in both `gameplay` and `balance-config` spec deltas.
- Rationale: behavior and ownership both change at requirement level.
- Alternative considered: only one capability delta. Rejected because central config ownership and gameplay semantics are both normative.

## Risks / Trade-offs

- [Early pressure drift] Baseline reduction can slightly reduce floor-1 pressure.
  - Mitigation: deterministic checks and explicit mention in testing guidance.
- [Hidden assumptions] Some code may have implicitly tuned around baseline `4`.
  - Mitigation: run `pnpm check` and verify impacted tests/build behavior.
