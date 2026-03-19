## Context

Znake now has stable scene/UI architecture and improved readability, so adding one high-impact core mechanic is timely.

Timed portal flow should be introduced with minimal systemic risk:

- no new scene types
- no additional UI framework
- preserve boss floor loop

## Goals / Non-Goals

**Goals:**

- Add clear non-boss objective pressure with countdown and squeeze escalation.
- Keep implementation contained to GameScene + balance + i18n copy.
- Maintain stable transition behavior using existing scene flow helper.
- Introduce objective variety per non-boss floor with predictable rotation and low cognitive load.

**Non-Goals:**

- Dual portal branching.
- Time gain/loss interactions from kills/items (future iteration).
- New biome generation in this change.

## Decisions

1. Portal objective applies only to non-boss floors.
- Boss floors keep existing “defeat boss to advance” objective.

2. Replace non-boss auto-advance-by-length with portal-entry advance.
- Length remains useful for survival/combat depth but not direct floor completion trigger in non-boss floors.

3. Implement squeeze as shrinking boundary inset.
- Reuse `isWall` checks by extending wall bounds with dynamic inset.
- No separate dynamic wall entity system needed.

4. Keep all timings configurable via `BALANCE.portal`.
- Enables quick tuning through apply iterations.

5. Rotate non-boss objectives in a deterministic cycle.
- Cycle: `portal -> score -> kills`, then repeat.
- Index source: non-boss progression index plus a run-level random offset.
- Keeps player expectation clear while still adding variety.
- The offset is rolled once per run start/restart, so objective order is stable during the run.

6. Keep objective targets conservative in early floors.
- Score objective: starts low and scales gradually by floor.
- Kill objective: starts at `1`, then `2` in early cycle steps before larger values.
- Timers should be slightly more forgiving on early floors to avoid frustration spikes.

7. Apply squeeze fallback uniformly when countdown/grace expires.
- Portal objective: squeeze continues while portal remains available.
- Score/Kills objective: squeeze pressure remains active until objective is completed (or death).
- This preserves the “time pressure” identity across all objective types.

## Risks / Trade-offs

- [Risk] Early floors may feel too hard if countdown is short.
  - Mitigation: conservative default timers and future tuning in balance.
- [Risk] Removing length-goal completion may reduce incentive to eat.
  - Mitigation: keep scoring growth value and iterate with time bonuses in next step.
- [Risk] Squeeze can create unfair spawns.
  - Mitigation: portal spawn uses safe-cell picking and squeeze starts only after grace period.
- [Risk] Objective rotation may feel inconsistent if players cannot read current goal fast.
  - Mitigation: objective text in top status line with concise, localized format.
- [Risk] Kills objective can deadlock if no enemies remain/spawn.
  - Mitigation: guarantee minimum alive enemy pool and spawn refill while kills objective is active.
