## Context

Znake already has a strong architectural direction: deterministic simulation logic defines outcomes, while `GameScene` orchestrates rendering/feedback and never owns core rules. Existing combat-readability and fairness work established telegraph and spawn-safety baselines, but tactical prioritization still depends on per-enemy memorization rather than explicit room-level role language.

This design introduces a first-pass enemy role taxonomy so players can classify threats quickly ("who pressures lane", "who scales board", "who taxes economy") and make better routing decisions under pressure.

## Key Points (Codex-style)

- **What is changing**
  - Introduce explicit role contracts for `sniper`, `blocker`, `summoner`, `charger`, and `leech`.
  - Define role-specific telegraph/counterplay and fairness guardrails.
  - Move role knobs and spawn cadence constraints into centralized balance config.
- **Why we are doing it**
  - To improve tactical readability and room-level decision quality without needing a full enemy roster rewrite.
- **Impacted areas**
  - Simulation role-state outputs, spawn composition policy, scene readability orchestration, balance config tables, and telemetry payloads.
- **Risks / unknowns**
  - Role identity overlap can reduce readability.
  - Over-constrained role mixes can flatten encounter variety.
  - Cadence tuning may need iteration to avoid pressure spikes in tight rooms.

## Goals / Non-Goals

**Goals:**

- Define deterministic role contracts for `sniper`, `blocker`, `summoner`, `charger`, and `leech`.
- Guarantee each role has readable telegraph and practical counterplay opportunities.
- Add fairness guardrails that prevent unavoidable multi-role pressure spikes.
- Keep role behavior knobs and spawn cadence data-driven in shared balance configuration.
- Preserve simulation/presentation boundaries: simulation resolves role behavior; scene orchestrates cues.

**Non-Goals:**

- Full enemy roster expansion.
- Biome redesign or room-template rewrite.
- Full visual-art overhaul beyond readability-oriented signaling hooks.
- Replacing existing deterministic movement/collision architecture.

## Decisions

1. Introduce role contracts as a simulation-level abstraction, not scene tags.
- Each enemy variant maps to a declared role contract that specifies intent class, telegraph window, commitment window, and counterplay affordances.
- Role state is emitted as deterministic simulation output and consumed by presentation.
- Alternative considered: defining roles as HUD-only labels.
  - Rejected because labels without simulation contract drift from real behavior and do not enforce fairness.

2. Model fairness guardrails at role-composition level.
- Add deterministic composition guardrails (for example, max simultaneous high-burst roles, minimum recovery gap between major threats, and local anti-pincer safeguards where feasible).
- Guardrails run in spawn/cadence policy, not ad hoc scene checks.
- Alternative considered: per-role standalone fairness only.
  - Rejected because unfairness usually emerges from role combinations, not isolated enemies.

3. Keep role knobs and cadence fully data-driven.
- Role timing, cooldown, pressure weight, spawn caps, and cadence intervals come from centralized balance config.
- Simulation reads a single source of truth so tuning does not require scene edits.
- Alternative considered: role constants embedded in enemy simulation modules.
  - Rejected due to iteration friction and drift risk.

4. Preserve orchestrator boundaries in `GameScene`.
- Scene receives role telegraph/counterplay state and triggers readable cues.
- Scene does not decide role intent, cadence eligibility, or fairness overrides.
- Alternative considered: scene-side fallback fairness logic.
  - Rejected due to coupling and determinism risk.

5. Add role telemetry focused on decision quality and fairness outcomes.
- Emit role composition context at encounter start and role-pressure outcomes at key events.
- Use structured payloads for balancing and regression detection without adding noisy duplicate event families.

## Risks / Trade-offs

- [Risk] Role kits may converge and blur tactical readability.
  - Mitigation: enforce distinct telegraph shapes and counterplay verbs per role in spec contracts.

- [Risk] Strict fairness guardrails may reduce encounter variety.
  - Mitigation: apply tiered deterministic fallback policies and tune thresholds via config, not code rewrites.

- [Risk] Additional role-state outputs could increase scene complexity.
  - Mitigation: expose a compact role-readability payload and keep transformation logic in simulation/helpers.

- [Risk] Telemetry volume growth could create analysis noise.
  - Mitigation: emit role events only at composition/resolution checkpoints, not every frame.

## Migration Plan

1. Add role taxonomy config schema and default knobs for five roles.
2. Map current enemy variants to role contracts in deterministic simulation modules.
3. Introduce role-aware spawn cadence/composition guardrails with deterministic fallback behavior.
4. Expose role telegraph/counterplay state to scene orchestration interfaces.
5. Add role-focused telemetry payloads.
6. Validate with deterministic simulation tests plus `pnpm check` and `pnpm build`.

Rollback strategy:
- Keep role taxonomy behind config-level disable toggles and fallback to prior cadence/composition behavior if regression risk appears during tuning.

## Open Questions

- Should `leech` pressure target pickups only, or also body-economy resources when present in a run?
- Which anti-stack rule is primary for v1 tuning: burst-role cap, cadence gap, or both with soft fallback?
- Do we want role IDs surfaced in UI copy now, or keep role semantics presentation-only for first pass?
