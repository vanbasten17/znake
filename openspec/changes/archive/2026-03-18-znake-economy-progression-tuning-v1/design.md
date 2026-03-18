## Context

Current reward/cost values are centralized, but there is no explicit mid-term objective layer and limited telemetry to explain progression friction.

## Goals / Non-Goals

**Goals:**
- Improve early-to-mid run currency pacing without making first unlocks trivial.
- Smooth talent unlock cadence to reduce dead runs.
- Reduce early frustration by giving a clearer non-boss floor-clear target based on snake length.
- Add lightweight mid-term goals with one-time rewards.
- Track enough telemetry to support next balancing pass.

**Non-Goals:**
- Full quest system with complex branching.
- Remote-config/live-ops balancing.
- Backend analytics pipeline integration.

## Decisions

- Keep all tunables in `BALANCE` as single source of truth.
- Add profile-backed `goalProgress` + `claimedGoals` for one-time milestones.
- Start with exactly two goals:
  - Reach target floor in a run.
  - Defeat target number of elite enemies cumulatively.
- Emit explicit telemetry at reward and goal transitions:
  - `run_reward_breakdown`
  - `goal_progressed`
  - `goal_claimed`

## Risks / Trade-offs

- [Risk] New profile fields may invalidate older saved payloads. -> Mitigation: safe migration defaults.
- [Risk] Over-rewarding can collapse progression curve. -> Mitigation: conservative defaults and telemetry review.
- [Risk] UI noise in menu. -> Mitigation: compact goal strip with top-2 goals only.
