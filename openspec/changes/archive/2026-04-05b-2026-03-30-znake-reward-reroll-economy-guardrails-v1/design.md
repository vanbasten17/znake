## Context

Rerolls are a key expression mechanic but can become punishing when economy pressure and bad variance align. Guardrails can protect fairness without flattening decision value.

## Key Points (Codex-style)

- What is changing
  - Introduce economy guardrails for reward rerolls to smooth risk/reward pacing.
- Why we are doing it
  - Preserve excitement while reducing dead-end economy outcomes.
- Impacted areas
  - Reward loop, resource economy, progression fairness.
- Risks / unknowns
  - Too many safeguards could remove meaningful reroll tension.

## Goals / Non-Goals

Goals:
- Keep rerolls costly but not run-killing by default.
- Ensure deterministic reroll-cost progression.
- Preserve late-run strategic tradeoffs.

Non-Goals:
- Free reroll systems.
- Rework full reward-generation taxonomy.

## Decisions

### Decision: Soft cap + rebound window
- Costs scale up to a soft cap, then gain limited rebound after key objectives.
- Rationale: reduces spiral failure while preserving cost signal.

### Decision: Stage-aware guardrail multipliers
- Apply modest multipliers by run stage.
- Rationale: aligns pressure with expected player agency.

## Risks / Trade-offs

- Risk: Guardrail tuning may require multiple balance passes.
- Trade-off: More predictable progression at slight complexity increase.
