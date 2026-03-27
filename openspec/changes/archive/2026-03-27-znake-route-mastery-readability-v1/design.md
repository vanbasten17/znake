## Context

Znake's run-map decisions are deterministic, but player-facing feedback currently emphasizes immediate room labels rather than route quality trends. This design adds a compact simulation-owned route-mastery summary that updates on deterministic route decisions and is surfaced in both in-run HUD and death recap for learning.

## Key Points (Codex-style)

- **What is changing**
  - Add deterministic route-mastery summary metrics and decision-capture helpers.
  - Add concise run HUD and death-recap readouts.
  - Add route-mastery telemetry and run-end summary fields.
- **Why we are doing it**
  - To explain route quality and route-linked failure causes without heavy tutorialization.
- **Impacted areas**
  - Run-map decision flow, scene readability composition, observability payloads.
- **Risks / unknowns**
  - Metric design may overfit current room taxonomy.
  - Readout copy can crowd existing HUD/recap surfaces.
  - Correlation to failure causes is informative, not fully causal.

## Goals / Non-Goals

**Goals:**

- Define deterministic route-mastery metrics and capture points.
- Keep metrics lightweight and seed-stable.
- Surface concise route-mastery readouts in HUD and death recap.
- Emit stable telemetry aligned with run-map/objective context.

**Non-Goals:**

- Full tutorial or coaching system.
- New combat objective families.
- Rework of run-map generation topology.
- Expansive analytics pipeline redesign.

## Decisions

1. Keep route mastery as deterministic summary state.
- Capture only bounded counters and trend values from explicit route decisions.
- Alternative: infer mastery from broad runtime event streams.
  - Rejected due to noisy attribution.

2. Bind capture to route decision commits.
- Update summary when a route choice is committed, not continuously every frame.
- Alternative: update per movement/combat tick.
  - Rejected for performance/noise reasons.

3. Reuse existing scene readability lanes.
- Add compact route-mastery string to existing run status + death recap block.
- Alternative: new dedicated mastery panel.
  - Rejected as out of scope.

4. Emit one decision event plus run-end summary fields.
- Keep event family compact and dashboard-friendly.
- Alternative: granular event-per-submetric.
  - Rejected for unnecessary volume.

## Risks / Trade-offs

- [Risk] Readout can be misunderstood as strict grading.
  - Mitigation: present as concise trend context, not pass/fail labels.

- [Risk] Metrics may miss nuanced pathing quality.
  - Mitigation: start with bounded v1 counters and iterate using telemetry.

- [Risk] Added text can reduce readability.
  - Mitigation: cap cue length and only show key fields.

## Migration Plan

1. Add route-mastery summary types and deterministic helper functions.
2. Add route-mastery state resets at run-start boundaries.
3. Capture metrics on committed route choices.
4. Surface compact HUD/death-recap route mastery readouts.
5. Emit route-mastery decision telemetry and run-end summary fields.
6. Validate with deterministic tests, `pnpm check`, and `pnpm build`.

Rollback strategy:
- Route-mastery readouts can be disabled by removing display calls while preserving state capture for later tuning.

## Open Questions

- Should elite picks count as risk always, or should biome/objective context modulate risk scoring?
- Should recap emphasize trend label or raw counts first?
- Do we want per-biome route mastery splits in a later iteration?
