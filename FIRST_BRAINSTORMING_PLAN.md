# FIRST BRAINSTORMING PLAN

## Goal

Ship the highest-impact gameplay improvements with the best difficulty-to-development ratio, while keeping current stability and polish.

## Selection Criteria

- High impact on tension/replayability
- Low to medium implementation risk
- Reuses current architecture (Phaser gameplay + DOM shell)
- Can be validated incrementally with OpenSpec loops

## Completed (Archived)

1. Timed Portal + Squeeze Pressure
2. Accessibility Mode + Voice Commands (MVP)
3. Floor Modifiers: Darkness + Ice (MVP)
4. New Enemy Set A: Egg + Mirror Snake
5. Dual Portal Destination Choice
6. Core Biome (Passive Feeding Pressure)
7. Room-Based Procedural Template
8. Boss Floor v1 (Giant Snake)

## Pending (Next)

### 9. Tail as Health + Power-up Segments
- Why: excellent long-term identity mechanic.
- Scope:
  - Damage model by collision type
  - Segment-as-buffer logic
  - Stored power-up segment behavior
- Risk:
  - Deep systemic change touching balance, UI feedback, and progression.

### 10. Elimination Run Type + Venom
- Why: high variety and combat-oriented objective mode.
- Scope:
  - Kill-target floor variant
  - Projectile/venom mechanic
- Risk:
  - Requires robust enemy combat tuning and objective UX.

## Suggested OpenSpec Order (Pending Only)

1. `znake-tail-health-power-segments-v1`
2. `znake-elimination-run-venom-v1`

## Definition of Done per Step

- OpenSpec proposal/design/tasks + spec deltas completed
- Behavior behind clear floor config/balance knobs
- `pnpm check` + `pnpm build` green
- Manual smoke pass:
  - menu -> relic -> game -> upgrade/death transitions
  - no stale input
  - no layout regressions
- Archive completed and base specs synced

## Assumptions

- We prioritize gameplay depth over adding more menu systems right now.
- Accessibility and alternative input support are treated as product-critical, not optional polish.
- We keep monetization-related UX iteration separate from core gameplay mechanics in this plan.
- We maintain mobile-first constraints and current shell architecture as-is during these phases.
