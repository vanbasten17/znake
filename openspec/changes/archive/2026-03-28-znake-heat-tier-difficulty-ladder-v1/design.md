## Context

Heat tiers should extend challenge presets through deterministic stacking rather than introducing ad-hoc randomness.

## Key Points (Codex-style)

- What is changing
  - Introduce a bounded `0..3` heat tier and deterministic mutator stack builder.
- Why we are doing it
  - Creates an optional mastery ladder while protecting stable daily/weekly baseline contracts.
- Impacted areas
  - Challenge preset composition and mutator sequencing semantics.
- Risks / unknowns
  - Repeated pressure-domain stacks may need follow-up tuning.

## Goals / Non-Goals

Goals:
- Keep logic pure and deterministic.
- Keep tier semantics explicit and testable.
- Avoid scene-level refactors for this iteration.

Non-Goals:
- Full menu UI for selecting heat tiers.
- Runtime rebalance of all mutator values.

## Decisions

### Decision: Bounded heat tier clamp
- Cap tiers at `0..3`.
- Rationale: limits combinatorial explosion and keeps balancing manageable.

### Decision: Rotation-based stack derivation
- Build stack by rotating from forced mutator position in the canonical pool.
- Rationale: deterministic, transparent, and simple to reason about.

## Validation Plan

1. Deterministic tests for clamp and stack output.
2. `pnpm check` + `pnpm build`.
3. Playtest smoke check with preset baseline unaffected at tier 0.
