## Context

Boss depth contracts already expose identity and phase readability, but repeated runs can still feel static when boss escalation rules are fixed. A floor-ordinal deterministic remix keeps encounters fresh while preserving deterministic simulation.

## Key Points (Codex-style)

- What is changing
  - Introduce deterministic remix profiles with bounded knobs for rage threshold and support cadence.
  - Rotate remix profile by boss-floor ordinal, not runtime randomness.
  - Thread remix id into boss observability payloads.
- Why we are doing it
  - Increase replay variety without sacrificing fairness contracts.
- Impacted areas
  - Boss balance config, boss setup/escalation logic, telemetry schemas.
- Risks / unknowns
  - Overtuned remix profiles can compress reaction windows.

## Goals / Non-Goals

**Goals:**
- Deterministic remix resolution.
- Bounded tuning knobs only.
- No scene-owned boss randomness.

**Non-Goals:**
- New boss sprites/visual assets.
- Multi-boss roster system.
- Major encounter logic rewrites.

## Decisions

### Decision: Rotate remix by boss-floor ordinal
- Uses `floorInterval` and stable rotation array.
- Rationale: deterministic, data-driven, and transparent.

### Decision: Keep remix knobs bounded to existing mechanics
- Only adjust rage threshold and support respawn interval in v1.
- Rationale: minimize risk while still adding meaningful variety.

### Decision: Include remix id in boss telemetry
- Add `phaseRemixId` to key boss telemetry events.
- Rationale: allows fairness/regression comparison across remix profiles.

## Risks / Trade-offs

- [Risk] Remix escalates too early on lower-skill runs. -> Mitigation: bounded threshold values and existing fairness guardrails.
- [Risk] Added telemetry fields drift from existing schema. -> Mitigation: additive bounded fields only.

## Migration Plan

1. Add remix config and deterministic resolver helper.
2. Integrate helper into boss floor setup and boss-phase escalation path.
3. Add remix context to boss telemetry events.
4. Validate with check/smoke/strict validate/build.

Rollback strategy:
- Remove remix fields/helper and restore fixed boss rage/support constants.

## Open Questions

- Should future passes map remix rotation to biome identity once multi-biome boss sets are live?
