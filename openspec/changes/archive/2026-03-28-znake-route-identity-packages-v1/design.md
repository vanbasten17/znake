## Context

The route system currently gives tactical outcomes (enemy/wall/tempo deltas) but communicates route identity mostly as safer/riskier text. Explicit identity packaging can make commitment clearer and establish a stable contract for future route expansions.

## Key Points (Codex-style)

- What is changing
  - Add package identity metadata and bounded package bonus behavior in route apply path.
- Why we are doing it
  - Clarify route decisions and align player expectation with applied effects.
- Impacted areas
  - Balance config shape, route apply logic, HUD status, telemetry.
- Risks / unknowns
  - Route score bonus could over-incentivize risk path if tuning is too aggressive.

## Goals / Non-Goals

**Goals:**
- Explicitly encode safer/riskier package identity.
- Keep route effects deterministic and bounded.
- Add telemetry visibility for package usage.

**Non-Goals:**
- Multi-package route draft UI redesign.
- New room types.

## Decisions

### Decision: Keep two packages mapped to existing safer/riskier routes
- Reuse existing route choice structure and attach identity metadata.
- Rationale: lowest-risk extension path.

### Decision: Apply bounded score bonus for both packages
- Keep non-zero score bonus for safer package but lower than riskier.
- Rationale: reinforce route identity without forcing one dominant path.

### Decision: Emit dedicated route package event context
- Track package id/tag and applied deltas at route resolution time.
- Rationale: helps balancing and retention analysis.

## Risks / Trade-offs

- [Risk] Bonus tuning distorts route choice fairness. -> Mitigation: bounded values + telemetry monitoring.
- [Risk] HUD label density increases. -> Mitigation: compact package label suffix in modifier list.

## Migration Plan

1. Extend route config metadata.
2. Integrate score bonus + package telemetry in route apply function.
3. Add package labels to active route modifier text.
4. Validate with check/smoke/strict validate/build.

Rollback strategy:
- Revert metadata and route bonus/telemetry additions; existing route deltas continue unchanged.

## Open Questions

- Should future versions make package identity visible directly inside route selection cards?
