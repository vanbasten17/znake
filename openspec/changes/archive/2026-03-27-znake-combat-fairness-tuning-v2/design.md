## Context

Combat fairness already uses centralized knobs for grace windows, telegraph timing, and spawn fairness filters. The cheapest and safest v2 iteration is to tune those knobs rather than introducing new runtime branches.

## Key Points (Codex-style)

- **What is changing**
  - Increase key telegraph windows and short invulnerability/breathing windows.
  - Increase spawn distance and escape-space thresholds.
  - Keep all adjustments in `BALANCE` and role knobs.
- **Why we are doing it**
  - Reduce unavoidable damage chains while preserving intended room pressure rhythm.
- **Impacted areas**
  - `BALANCE.combatFairness`, `BALANCE.enemyRoles.roleKnobs`, `BALANCE.eliteMiniboss.fairness`.
- **Risks / unknowns**
  - Excessive easing could reduce encounter threat density.
  - Stricter spawn fairness can trigger fallback selection more often.

## Goals / Non-Goals

**Goals:**

- Reduce unfair damage events in regular combat and elite pressure moments.
- Preserve pacing and challenge by making only bounded numeric changes.
- Keep GameScene logic unchanged where possible.

**Non-Goals:**

- Adding new enemy classes.
- Rewriting biome or encounter architecture.

## Decisions

1. Prefer balance-table tuning over logic rewrites.
- Decision: adjust fairness numbers in `BALANCE` instead of adding new control flow.
- Why: preserves determinism and keeps GameScene orchestration thin.
- Alternative considered: new dynamic anti-burst runtime rules. Rejected for scope and complexity.

2. Tune both regular and elite fairness thresholds together.
- Decision: nudge elite fairness minima alongside base combat fairness to avoid mismatch in late-run perception.
- Why: fairness spikes are often concentrated in elite-like windows.
- Alternative considered: regular-combat-only tuning. Rejected as incomplete against reported pain points.

3. Preserve challenge by using incremental increases.
- Decision: apply small-to-moderate threshold changes, not large multipliers.
- Why: retains pacing identity and avoids overcorrection.
- Alternative considered: aggressive reaction-window inflation. Rejected due to likely pacing drift.

## Risks / Trade-offs

- [Challenge drops too much] -> Use moderate increments and validate feel through focused testing.
- [Fallback spawns increase] -> Keep spawn thresholds strict but not extreme; monitor fallback telemetry.
- [Late-run pressure loses identity] -> Limit role telegraph increases to high-risk actions only.
