## Context

The project already captures death reasons and recent run summaries, but recap currently surfaces only single-run context. Adding a trend block in the death scene can reinforce mastery learning loops and route decisions with minimal UI and architecture risk.

## Key Points (Codex-style)

- What is changing
  - Add bounded trend aggregation and recap block rendering.
- Why we are doing it
  - Give players immediate pattern feedback after failure.
- Impacted areas
  - DeathScene recap rendering and run-history consumption.
- Risks / unknowns
  - Weak-sample trend quality in early runs.

## Goals / Non-Goals

**Goals:**
- Compute a simple top failure-reason trend from bounded recent history.
- Keep the block readable and deterministic.

**Non-Goals:**
- Statistical confidence modeling.
- Full analytics dashboard in death scene.

## Decisions

### Decision: Use top-count reason over last six runs
- Keep algorithm intentionally simple and explainable.
- Rationale: robust enough for first-pass feedback, low cognitive overhead.

### Decision: Add explicit low-sample fallback text
- When history is too short, show current run reason plus guidance.
- Rationale: avoids misleading pseudo-trends.

## Risks / Trade-offs

- [Risk] Recent outlier dominates small sample trend. -> Mitigation: communicate sample size directly in value line.
- [Risk] Additional recap text increases clutter. -> Mitigation: single compact block and existing typography reuse.

## Migration Plan

1. Extend DeathScene recap composition with trend helper.
2. Read bounded history and compute top reason count.
3. Add fallback behavior for low history.
4. Validate with check/smoke/spec validation/build.

Rollback strategy:
- Remove trend block and helper; recap returns to prior behavior.

## Open Questions

- Should future iteration split trend by preset mode (standard/daily/weekly)?
