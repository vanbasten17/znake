## Context

Boss floors already exist with deterministic phase hooks, support pickups, and elite/miniboss readability instrumentation, but boss identity is still mostly implicit and spread across ad-hoc scene cues. This change tightens boss encounter depth by formalizing identity + counterplay contracts in simulation-owned state and config, while keeping `GameScene` on orchestration/presentation responsibilities.

## Key Points (Codex-style)

- **What is changing**: We add explicit boss identity descriptors, bounded phase/counterplay readability state, and boss-specific telemetry summaries on top of existing boss-floor contracts.
- **Why we are doing it**: Boss fights should teach and test skill through readable intent and fair windows, not opaque pressure spikes.
- **Impacted areas**: `BALANCE` boss tables, simulation/readability helpers, `GameScene` HUD cue plumbing, run-end telemetry payload mapping, deterministic tests.
- **Risks / unknowns**: Too many cues can reduce readability; boss-depth additions must not leak gameplay ownership into presentation code.

## Goals / Non-Goals

**Goals:**
- Define deterministic boss-identity and counterplay metadata in centralized balance and simulation-owned state.
- Surface concise boss phase/counterplay cues in scene HUD without scene-owned sequencing.
- Emit stable boss encounter telemetry summaries aligned with existing elite/miniboss observability patterns.
- Preserve deterministic behavior and existing progression contracts.

**Non-Goals:**
- New large boss roster or major content expansion.
- Rewriting encounter architecture beyond focused additions.
- Broad telemetry schema overhaul outside boss encounter context.

## Decisions

1. **Reuse elite/miniboss readability pipeline, extend for boss identity**
   - Decision: Extend current elite/miniboss phase tracking with boss identity metadata rather than introducing a separate encounter framework.
   - Why: Keeps architecture lean, deterministic, and low-risk.
   - Alternative considered: New boss-only subsystem; rejected due to coupling and migration cost.

2. **Balance-first boss identity descriptors**
   - Decision: Add boss identity/readability descriptor fields under centralized balance knobs.
   - Why: Supports data-driven tuning and avoids scattering constants in scene logic.
   - Alternative considered: Hardcoded scene labels; rejected for maintainability and consistency.

3. **Scene remains thin with payload consumption only**
   - Decision: `GameScene` consumes resolved boss phase/identity/readability payload and renders cues only.
   - Why: Maintains simulation-vs-presentation boundary required by project architecture.
   - Alternative considered: Scene computing encounter logic; rejected for determinism and testability risk.

4. **Telemetry extension via bounded additive fields**
   - Decision: Emit additive boss encounter summary fields/events that align with existing retention tracking payloads.
   - Why: Keeps dashboards stable while enabling boss-depth diagnostics.
   - Alternative considered: Replacing existing elite/miniboss events; rejected to avoid regression risk.

## Risks / Trade-offs

- **[Risk] Cue overload in busy encounters** → Mitigation: Keep one concise boss cue with bounded priority over other helper cues.
- **[Risk] Determinism regressions from new phase metadata updates** → Mitigation: Derive updates from existing deterministic encounter state transitions and cover with fixed-input tests.
- **[Risk] Telemetry bloat** → Mitigation: Use bounded counters/reason enums only; no unbounded free-form payloads.

## Migration Plan

1. Add boss identity/readability tuning knobs to centralized balance with safe defaults.
2. Wire boss encounter readability/identity summary in simulation-owned state updates.
3. Update `GameScene` HUD cue selection to consume new payload without taking logic ownership.
4. Extend run-end telemetry mapping and reset paths for boss encounter summary fields.
5. Add/adjust deterministic tests for cue/summary behavior and regressions.

Rollback strategy: revert additive boss-depth fields and cue wiring while preserving existing elite/miniboss baseline flow.

## Open Questions

- Should future boss variants map to identity descriptors through run-map room metadata, or remain floor-driven in this iteration?
- Do we need a separate boss-only failure-reason taxonomy later, or can shared elite/miniboss reasons stay sufficient after this follow-up?
