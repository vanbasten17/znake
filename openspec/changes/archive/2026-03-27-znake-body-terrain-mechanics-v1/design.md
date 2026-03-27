## Context

Znake already treats body length as a shared deterministic economy, but tactical body placement (lanes, local control zones, trap states, and safe pockets) is currently implicit. This design adds a lightweight pure body-terrain snapshot model that can drive guardrails, readable cues, and telemetry without coupling gameplay rules to scene rendering.

## Key Points (Codex-style)

- **What is changing**
  - Add deterministic body-terrain snapshot helpers and recoverability guardrails for spend actions.
  - Add centralized body-terrain tuning thresholds.
  - Surface concise terrain cues in HUD and telemetry.
- **Why we are doing it**
  - To make body positioning first-class tactical play while preserving fairness and recoverability.
- **Impacted areas**
  - Simulation helpers, body spend flow, HUD status composition, observability payloads.
- **Risks / unknowns**
  - Guardrails could over-constrain advanced play if thresholds are too conservative.
  - HUD cue budget is tight in mobile portrait flows.
  - Terrain metrics may need per-room-type scaling in future revisions.

## Goals / Non-Goals

**Goals:**

- Produce deterministic body-terrain snapshots from existing run state.
- Apply recoverability guardrails before body-spend actions in risky low-agency states.
- Keep terrain and guardrail knobs centralized in balance config.
- Provide concise tactical readability cues in current HUD lanes.
- Emit stable body-terrain telemetry for tuning and fairness analysis.

**Non-Goals:**

- Boss encounter redesign.
- New run-map topology systems.
- Full combat objective family expansion.
- Large rendering or UI layout rewrites.

## Decisions

1. Use pure body-terrain snapshot helpers.
- Snapshot derives from deterministic state (snake, walls, enemies, head position) and bounded neighborhood checks.
- Alternative: ad hoc scene-side heuristics.
  - Rejected due to coupling and determinism drift.

2. Place recoverability guardrails in gameplay spend flow.
- Guardrails gate body-spend actions only in high-pressure low-agency states.
- Alternative: only post-hit forgiveness.
  - Rejected because prevention is more readable and less frustrating than delayed compensation.

3. Keep thresholds data-driven in `BALANCE`.
- Zone radius, lane distance, and minimum safe-pocket thresholds are centralized.
- Alternative: hardcoded helper constants.
  - Rejected to preserve iteration speed.

4. Keep HUD cue concise and composable.
- Add one compact terrain cue string in existing objective/status composition path.
- Alternative: dedicated new HUD panel.
  - Rejected as scope creep for v1.

5. Emit bounded terrain telemetry events.
- Snapshot/guardrail events include compact numeric fields and reason codes for tuning.
- Alternative: derive terrain from generic collision logs.
  - Rejected because attribution would be weak.

## Risks / Trade-offs

- [Risk] Guardrails can weaken aggressive body-economy strategies.
  - Mitigation: apply only in high-pressure + low-safe-pocket states and tune centrally.

- [Risk] Snapshot calculations could add loop overhead.
  - Mitigation: keep checks local, bounded, and allocation-light.

- [Risk] Additional text reduces HUD clarity.
  - Mitigation: cap cue length and reuse existing status lanes.

## Migration Plan

1. Add body-terrain knobs and reason taxonomy to central config/types.
2. Implement pure body-terrain snapshot and guardrail helpers.
3. Integrate guardrail checks into body-spend flow.
4. Surface concise terrain cue in objective/status HUD path.
5. Emit terrain snapshot/guardrail telemetry payloads.
6. Validate with deterministic tests, `pnpm check`, and `pnpm build`.

Rollback strategy:
- Keep terrain guardrail behavior config-driven so strict checks can be dialed down without code rollback.

## Open Questions

- Should safe-pocket thresholds differ between `combat` and `elite` rooms in v1?
- Should reward-overclock use a softer threshold than body-pulse to preserve reward agency?
- Do we eventually expose terrain cue details in death recap or keep telemetry-only for now?
