## Context

Route choice already exposes deterministic room metadata, but cognitive load remains high during commit moments. A compact risk forecast can increase readability while keeping the decision model data-driven and simulation-safe.

## Key Points (Codex-style)

- What is changing
  - Add deterministic risk classification for route cards from existing preview data.
- Why we are doing it
  - Strengthen player confidence and fairness in high-tempo route commits.
- Impacted areas
  - `GameScene` route overlay composition, i18n route keys, route simulation helper tests.
- Risks / unknowns
  - Threshold tuning might require adjustment after playtesting.

## Goals / Non-Goals

**Goals:**
- Preserve deterministic behavior and simulation/render separation.
- Reuse existing run-map preview payloads (no new generation fields required).
- Keep UI changes minimal and localized.

**Non-Goals:**
- No new route outcomes or balance changes.
- No additional overlays or map screens.
- No telemetry schema expansion in this pass.

## Decisions

### Decision: Pure risk helper in simulation layer
- Add `resolveRouteRiskForecast(choice)` that returns score and bounded level.
- Rationale: deterministic and unit-testable; scene only presents results.

### Decision: Lightweight room-type weighted scoring
- Base score from selected room type, then add preview composition pressure weights.
- Rationale: readable heuristic that reflects immediate/future pressure without opaque math.

### Decision: Localized card line
- Render a compact `Risk forecast: <level> (<score>)` line per route card.
- Rationale: explicit readability cue with no interaction overhead.

## Risks / Trade-offs

- [Risk] Forecast may overstate danger for some event/shop branches.
  - Mitigation: keep thresholds simple and tune after focused playtests.

## Migration Plan

1. Add OpenSpec run-map delta for forecast readability requirement.
2. Implement pure helper + deterministic tests.
3. Integrate line in route overlay card copy.
4. Validate with `pnpm check`.

Rollback strategy:
- Remove helper usage and new i18n keys; route cards return to current detail/future-only view.
