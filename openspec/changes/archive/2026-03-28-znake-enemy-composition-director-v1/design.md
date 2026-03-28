## Context

Znake currently applies a single role policy per depth band. That guarantees broad progression shifts but not intra-band pacing texture. We need lightweight deterministic sub-windows that alternate composition emphasis without breaking readability, fairness, or deterministic replay behavior.

## Key Points (Codex-style)

- What is changing
  - Introduce per-band composition windows that modulate role weights/caps by spawn cadence index.
- Why we are doing it
  - Increase role variety and tactical rhythm inside each depth band.
- Impacted areas
  - Balance config shape, role policy resolution helper, GameScene spawn path, telemetry context.
- Risks / unknowns
  - Window multipliers may require tuning to avoid role over-representation.

## Goals / Non-Goals

**Goals:**
- Deterministic role window selection from floor + spawn index.
- Bounded multipliers/cap overrides that respect existing anti-frustration patterns.
- Stable telemetry visibility for director windows.

**Non-Goals:**
- New enemy archetypes.
- Dynamic ML/adaptive composition.
- Non-deterministic live tuning.

## Decisions

### Decision: Window selection by fixed spawn cadence buckets
- Use `windowSizeSpawns` and spawn index bucket to pick active window.
- Rationale: deterministic and simple to reason about during tuning.

### Decision: Window behavior as multiplicative role-weight overlay
- Start from existing depth-band base policy and apply per-window multipliers/cap overrides.
- Rationale: incremental extension with low migration risk.

### Decision: Emit active window id in existing composition telemetry
- Add `roleWindowId` to existing `encounter_role_composition` events.
- Rationale: allows balancing analysis without creating new event families.

## Risks / Trade-offs

- [Risk] Overly strong multipliers make windows feel unfair. -> Mitigation: keep first-pass multipliers near 1.0 and preserve existing spawn guardrails.
- [Risk] Additional config complexity slows tuning. -> Mitigation: keep just two windows per band in v1.

## Migration Plan

1. Add role-composition director config shape under depth balance.
2. Add window-aware policy resolver helper.
3. Integrate helper in GameScene spawn + composition telemetry.
4. Add deterministic tests.
5. Validate with check/smoke/strict validate/build.

Rollback strategy:
- Revert helper usage and remove director config; base role policy remains intact.

## Open Questions

- Should future windows adapt to objective type (survive/kills/portal) as a second-stage contract?
