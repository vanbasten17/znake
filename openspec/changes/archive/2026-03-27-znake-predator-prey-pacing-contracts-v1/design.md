## Context

Znake already exposes deterministic enemy telegraphs and role composition contracts, but room-level pressure cadence still lacks a shared pacing contract that distinguishes intentional hunt windows from escape/recovery windows. This design introduces deterministic encounter pacing as a simulation-owned state machine, then lets `GameScene` present concise cues without owning pacing logic.

## Key Points (Codex-style)

- **What is changing**
  - Add a deterministic pacing phase state machine (`hunt`, `escape`, `reset`) with bounded transition reasons.
  - Add anti-overlap pressure guardrails tied to centralized thresholds.
  - Surface pacing readability and telemetry from simulation-owned state.
- **Why we are doing it**
  - To improve fairness, readability, and tension rhythm without broad content or roster rewrites.
- **Impacted areas**
  - Encounter simulation helpers, balance config, `GameScene` HUD/status cues, and telemetry payloads.
- **Risks / unknowns**
  - Tuning risk between too-chaotic and too-passive pacing.
  - Potential overlap with existing elite/miniboss phase telemetry taxonomy.
  - Need to keep HUD cues concise on mobile.

## Goals / Non-Goals

**Goals:**

- Define deterministic pacing phases and deterministic phase transitions.
- Enforce anti-overlap pressure guardrails during high-pressure windows.
- Keep pacing knobs fully config-driven in centralized balance tables.
- Surface concise pacing state to players via scene orchestration only.
- Emit stable pacing telemetry with bounded reason codes.

**Non-Goals:**

- New biome content expansion.
- Full enemy roster redesign.
- Replacing existing role taxonomy or elite/miniboss phase systems.
- Large UI overhauls beyond concise readability hooks.

## Decisions

1. Add pacing as a simulation-level state machine, not scene-authored timers.
- Introduce a small pure helper that advances pacing phase from deterministic inputs (tick index, recent pressure events, guardrail interventions).
- Alternative considered: scene-side pacing timers.
  - Rejected to preserve determinism and avoid logic/presentation coupling.

2. Use bounded anti-overlap guardrails before pressure actions resolve.
- Pressure-intense actions consult guardrail thresholds and can defer/escalate deterministically with reason codes.
- Alternative considered: post-hit softening only.
  - Rejected because fairness needs prevention, not just post-failure mitigation.

3. Keep all pacing knobs centralized in `BALANCE`.
- Phase durations, cooldown/recovery minima, and overlap budget thresholds live in balance config.
- Alternative considered: constants inside enemy/scene loops.
  - Rejected due to tuning friction and drift risk.

4. Expose concise scene-facing pacing payloads.
- Scene reads current phase plus time-to-transition and renders short status cues; no phase-authoring in scene code.
- Alternative considered: no player-facing cues.
  - Rejected because readability goal requires explicit communication.

5. Extend observability with pacing lifecycle events and summaries.
- Emit transition/intervention events with reason taxonomy and run-end aggregates for tuning.
- Alternative considered: infer pacing indirectly from existing events.
  - Rejected because inference loses causality around guardrail interventions.

## Risks / Trade-offs

- [Risk] Strong guardrails can reduce encounter intensity.
  - Mitigation: allow bounded fallback actions and tune thresholds via config.

- [Risk] New pacing cues may compete with existing status text.
  - Mitigation: keep a single concise pacing label and reuse current HUD status channel.

- [Risk] Additional telemetry may duplicate elite/miniboss signals.
  - Mitigation: use separate pacing event names and bounded reason fields.

## Migration Plan

1. Add pacing policy knobs and reason-code taxonomy to central balance/types.
2. Implement deterministic pacing state helper with pure transition logic.
3. Integrate pacing updates into encounter loop and apply anti-overlap guardrails.
4. Surface pacing-readable status in `GameScene` via orchestration hooks.
5. Add pacing lifecycle/intervention telemetry and run-end summary fields.
6. Validate with deterministic tests, then `pnpm check` and `pnpm build`.

Rollback strategy:
- Keep pacing policy behind defaults that can effectively disable new transitions/guardrails by config while retaining prior encounter behavior.

## Open Questions

- Should phase windows scale by room type (`combat` vs `elite`) in v1 or remain global first-pass knobs?
- Do we need distinct guardrail reason codes for role-overlap vs elite-overlap at launch?
- Should pacing recap be surfaced in death summary this iteration or telemetry-only first?
