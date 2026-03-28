## Context

Lifecycle auto-pause already protects simulation integrity, but current resume behavior lacks contextual orientation. A short deterministic hint can communicate what changed and what remains pending.

## Key Points (Codex-style)

- What is changing
  - Resume hint now includes floor, objective preview, and pending context bits.
- Why we are doing it
  - Improve return-to-run readability and confidence.
- Impacted areas
  - Lifecycle resume hook, objective helper usage, localized hint catalog.
- Risks / unknowns
  - Overly verbose hints may crowd high-pressure moments.

## Goals / Non-Goals

**Goals:**
- Keep message deterministic and bounded.
- Reuse existing objective contracts.
- Avoid scene-level branching complexity.

**Non-Goals:**
- New UI panels/modals.
- Persistent resume history timeline.
- Telemetry schema changes.

## Decisions

### Decision: Build resume context from existing run state only
- Use `gameState` and floor objective helpers.
- Rationale: deterministic, low-risk, no new state ownership.

### Decision: Keep cue in hint bar
- Reuse existing HUD hint surface rather than adding new overlays.
- Rationale: minimal complexity and consistent interaction model.

## Risks / Trade-offs

- [Risk] Hint can interrupt a user’s expected move hint. -> Mitigation: concise one-line format and reuse hint channel.

## Migration Plan

1. Add resume-context helper in lifecycle.
2. Add i18n strings.
3. Validate with check/smoke/strict validate/build.

Rollback strategy:
- Revert lifecycle resume hint enrichment and i18n keys.
