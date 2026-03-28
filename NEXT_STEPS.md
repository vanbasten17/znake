# Next Steps

## Summary

This refresh captures a gameplay-first balancing pass focused on fairness, readability, and cleaner progression pacing.

Current pain points to address:
- Difficulty spikes too hard around floor transitions (notably 3 -> 4) due to stacked pressure sources.
- Start-of-run snake identity should feel genre-consistent (head + 2 body segments baseline).
- Relic identity is unclear and some relic effects can feel too determinant.
- In-run pickup economy needs better risk/reward clarity (score items, biome items, enemy/object count pressure).

Grounded context from current config:
- `BALANCE.run.baseSnakeLength` is currently `4`.
- Boss cadence is currently every `3` floors (`BALANCE.biome.boss.floorInterval = 3`).
- Food is `10` score and biome core item is `45` score + `2` growth.

## High Impact / Low Cost

- Smooth floor-to-floor pressure deltas in existing balance tables:
  cap wall count jumps, enemy interval drops, and combined modifier stacking for non-boss floors.
- Change default run start snake length from `4` to `3` (head + 2) while preserving talent/relic bonuses.
- Add relic tooltip clarity pass:
  each relic explicitly states role (`tempo`, `safety`, `economy`) and tradeoff.
- Add immediate anti-snowball relic guardrails:
  no single relic should guarantee trivial clears without route/objective execution.
- Add floor transition telemetry checkpoints:
  capture deaths and hit reasons by floor band to validate tuning impact.

## High Impact / Medium Cost

- Introduce biome runway pacing model in config:
  each biome has 9 regular floors (ramp) + floor 10 miniboss, then biome shift.
- Split difficulty into separate deterministic budgets per floor:
  obstacle budget, enemy pressure budget, and objective pressure budget.
- Tune room template cadence and terrain modifier cadence so new hazards do not stack too abruptly.
- Rebalance item availability windows by depth band:
  keep early floors cleaner, increase complexity progressively.

## Very High Impact / Higher Cost

- Build a unified progression director that composes:
  biome phase, floor depth, pressure budget, encounter role caps, and terrain modifiers.
- Expand relic system into a structured catalog:
  deterministic power budget, downside classes, and synergy/anti-synergy metadata.
- Add automated fairness validation suite:
  seed-based simulations checking reaction windows, recoverability, and no-cheap-hit thresholds per depth.

## Medium Impact / Low Cost

- Pickup economy tuning pass:
  keep apple at `10`, test star/high-risk pickup around `25/50` with explicit spawn rules and counterplay.
- Review `biome.starCount` and decorative/readability noise so pickups and threats remain legible.
- Tune enemy and obstacle counts for early floors to improve onboarding without removing challenge curve.
- Prepare a shortlist of removable/replaceable markers/items and confirm deletions before implementation.

## Concrete Gameplay Concepts

- Biome pacing example:
  Biome 1 floors 1-9 (light -> medium pressure), floor 10 miniboss.
  Biome 2 floors 11-19 (medium -> high pressure), floor 20 miniboss, and so on.
- Relic framing rule:
  relics should open a playstyle lane, not auto-solve floor success conditions.
- Economy framing:
  higher score pickups should require positional risk, timing commitment, or objective pressure tradeoff.

## Recommended First Iteration

Create one OpenSpec change focused on run pacing and baseline fairness:
- title: `znake-progression-pacing-and-economy-v1`
- scope:
  1) smooth floor difficulty ramp,
  2) set base snake length to 3,
  3) relic clarity + anti-snowball constraints,
  4) first pass pickup economy rebalance.

Success criteria for this slice:
- fewer abrupt deaths on floor transitions,
- no relic with dominant near-auto-win behavior in early/mid depth,
- clearer player understanding of what relic choice implies,
- pickup economy supports meaningful route decisions.

## One-Week Prototype Scope

- Day 1-2: OpenSpec proposal/design/tasks and spec deltas (`gameplay`, `balance-config`, `meta-progression`).
- Day 3-4: apply tuning tables + baseline snake length update + relic copy/metadata updates.
- Day 5: deterministic tests for floor setup guardrails and relic budget constraints.
- Day 6-7: playtest sweep, telemetry readout review, and second tuning pass.

## Suggested Next Step

Run `openspec-propose` for `znake-progression-pacing-and-economy-v1`, then execute an `apply` iteration limited to the first tuning slice above.
