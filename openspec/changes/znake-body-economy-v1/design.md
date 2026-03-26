## Context

Znake recently established tail-as-health and objective-gated reward flow. That improved recoverability and pacing, but body length still behaves mostly as passive durability. This change introduces a constrained body economy so players can intentionally convert length into space control and progression quality while preserving deterministic simulation and clear scene/systems boundaries.

## Key Points (Codex-style)

- **What is changing**
  - Add deterministic body-spend state + two sinks (`body_pulse`, `reward_overclock`) with min-length protections and balance-driven limits.
- **Why we are doing it**
  - Reinforce Znake's gameplay identity: routing and pressure management through meaningful body tradeoffs.
- **Impacted areas**
  - Simulation spend resolver, run config/state contracts, reward flow hooks, and HUD/input messaging.
- **Risks / unknowns**
  - Risk of runaway failures from over-spending, and UX confusion between damage loss vs voluntary spend if feedback is weak.

## Goals / Non-Goals

**Goals:**
- Make body length a readable spendable resource without replacing tail-as-health.
- Keep sink behavior deterministic, balance-configurable, and simulation-owned.
- Integrate body spending with existing reward flow in a small, controlled scope.
- Keep GameScene as orchestration/feedback only.

**Non-Goals:**
- Adding a broad ability suite or many concurrent sinks.
- Reworking enemy combat model around body spend interactions.
- Binding body economy to shop/event route systems before route structure is finalized.

## Decisions

### Decision 1: Introduce a dedicated `body-economy` capability

- We add a focused capability to avoid scattering rules across unrelated specs.
- Existing capabilities are still modified where integration behavior changes.

Alternative considered:
- Only modifying existing specs without a dedicated capability.
- Rejected because this blurs ownership and makes future body-economy expansions harder to reason about.

### Decision 2: First-pass includes two sinks with tight gates

- `body_pulse` (combat sink): player-triggered spend with a fixed segment cost and cooldown to create immediate local space relief.
- `reward_overclock` (reward-flow sink): optional one-time spend per completed objective to reroll reward options before final selection.
- Both sinks are blocked below a shared minimum spendable length floor.

Alternative considered:
- A single auto-trigger safety sink.
- Rejected for v1 because player agency and readable risk decisions are central goals.

### Decision 3: Spend resolution remains simulation-owned

- Eligibility checks, segment subtraction, cooldown tracking, and reroll state are handled by pure simulation/domain helpers.
- Scene/input/HUD emits intent and visual/audio feedback only.

Alternative considered:
- Trigger spend decisions directly in scene logic.
- Rejected to protect determinism and testability.

### Decision 4: Shared segment pool with explicit loss attribution

- Damage and spending consume the same segment pool.
- System emits reason-tagged events (`damage`, `body_pulse_spend`, `reward_overclock_spend`) to keep HUD readable and support telemetry/debugging.

Alternative considered:
- Separate "energy" pool backed by body length.
- Rejected for v1 because it obscures the tradeoff and adds unnecessary complexity.

### Decision 5: Balance-driven tuning only

- Costs, minimum spend floor, pulse cooldown/tick duration, and reroll limits live in centralized balance config.
- No hardcoded gameplay constants in scene code.

Alternative considered:
- Hardcode values for faster first implementation.
- Rejected to keep iteration speed and consistency with existing balance architecture.

## Risks / Trade-offs

- [Risk] Players may accidentally over-spend and enter unwinnable states.
  - Mitigation: enforce non-spendable floor and deterministic blocked-reason messaging.
- [Risk] Body-pulse utility might collapse intended enemy pressure.
  - Mitigation: keep radius/effect and cooldown conservative in config; tune with short playtest loops.
- [Risk] Reward overclock could reduce reward identity variance if too cheap.
  - Mitigation: one reroll per objective completion and non-trivial segment cost.
- [Trade-off] Extra state and HUD messaging increase implementation complexity.
  - Mitigation: isolate state in domain contracts and reuse existing hint/emphasis channels.

## Migration Plan

1. Add `body-economy` run-config and deterministic state contract with safe defaults that preserve current behavior when disabled.
2. Add simulation helper entry points for spend validation and effect resolution.
3. Integrate `body_pulse` intent flow and cooldown updates through existing tick/update orchestration.
4. Integrate `reward_overclock` at reward draft time with one-reroll-per-objective guard.
5. Add HUD/input affordance and blocked-reason messaging.
6. Validate with deterministic seed replays and targeted gameplay checks (combat pressure, reward flow, low-length edge cases).

## Open Questions

- Should `body_pulse` scale with current snake length or remain fixed-effect in v1?
- Should `reward_overclock` reroll all options or only one selected slot in v1?
- Do we require explicit telemetry coverage in this change or rely on existing debug hooks first?
