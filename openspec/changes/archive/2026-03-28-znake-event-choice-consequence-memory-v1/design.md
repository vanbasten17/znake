## Context

Event-choice outcomes are deterministic but only immediate, so choices do not influence medium-term run planning. We add a bounded delayed-consequence queue owned by simulation state and consumed at floor start.

## Key Points (Codex-style)

- What is changing
  - Introduce a data-driven delayed consequence contract for specific event options.
  - Store pending consequences in shared run state with deterministic trigger floors.
  - Resolve due entries at floor setup before room-specific setup.
- Why we are doing it
  - Strengthen strategic continuity between decisions and future pressure/reward states.
- Impacted areas
  - Balance config schema, event-choice simulation helpers, `GameScene` create path, telemetry.
- Risks / unknowns
  - Potential fairness drift if delayed penalties stack.
  - Need strict bounded queue size and deterministic ordering.

## Goals / Non-Goals

**Goals:**
- Deterministic scheduling (same seed/state => same trigger floor).
- Bounded queue and bounded effects.
- Minimal scene coupling (simulation-first helpers).

**Non-Goals:**
- New event overlay UX.
- Narrative text rendering for delayed outcomes.
- Large expansion of event-choice content set.

## Decisions

### Decision: Keep delayed-consequence definitions in central balance config
- Reference by `sourceOptionId` and include min/max trigger delay windows.
- Rationale: data-driven tuning and low coupling.

### Decision: Queue ownership lives in `GameState`
- Persist pending consequences across scene transitions until trigger.
- Rationale: predictable cross-floor continuity.

### Decision: Apply due consequences during `GameScene.create`
- Run after route package apply and before room type setup.
- Rationale: consistent floor-start state composition.

## Risks / Trade-offs

- [Risk] Consequence stacking feels punitive. -> Mitigation: `maxPending` cap and bounded multipliers.
- [Risk] Hidden effects reduce readability. -> Mitigation: telemetry and conservative first-pass definitions.

## Migration Plan

1. Add consequence-memory config and types.
2. Add simulation draft/partition/resolve helpers + tests.
3. Integrate schedule/apply lifecycle in scene flow.
4. Validate with check/smoke/strict validate/build.

Rollback strategy:
- Remove consequence scheduling/apply calls and config section; event choices remain immediate-only.

## Open Questions

- Should a future pass expose concise HUD copy when delayed consequences are pending?
