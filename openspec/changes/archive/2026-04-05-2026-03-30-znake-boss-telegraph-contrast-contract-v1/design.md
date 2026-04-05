## Context

Boss phases are intended to feel threatening but fair. Telegraph clarity is a fairness contract and should not depend on ambient VFX density.

## Key Points (Codex-style)

- What is changing
  - Define stronger telegraph contrast and timing contracts for boss attacks.
- Why we are doing it
  - Increase reaction fairness while preserving encounter intensity.
- Impacted areas
  - Boss cue timing, visual language, accessibility profiles.
- Risks / unknowns
  - Over-long telegraphs may reduce challenge depth.

## Goals / Non-Goals

Goals:
- Guarantee readable telegraph signals at all supported visual profiles.
- Maintain deterministic telegraph states across replays.
- Keep per-frame rendering overhead bounded.

Non-Goals:
- Full boss move-set redesign.
- New shader dependency rollout.

## Decisions

### Decision: Telegraph lead-time tiers by attack class
- Heavy attacks require longer lead-time than light attacks.
- Rationale: preserves depth while reducing unfair hits.

### Decision: Contrast floor per accessibility profile
- Enforce minimum contrast thresholds for telegraph overlays.
- Rationale: protects readability under variable backgrounds.

## Risks / Trade-offs

- Risk: Timing shifts can affect existing difficulty curves.
- Trade-off: Slightly slower boss cadence for improved perceived fairness.
