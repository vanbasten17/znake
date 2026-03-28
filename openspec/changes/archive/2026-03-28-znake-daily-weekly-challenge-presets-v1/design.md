## Context

Znake already resolves run seeds, mutators, and route/objective variance deterministically. The missing piece is a recurring challenge entry mode that maps a calendar period to stable preset context so players can replay comparable runs and designers can iterate on preset pressure safely.

## Key Points (Codex-style)

- What is changing
  - Introduce a deterministic challenge preset resolver and thread preset context through run bootstrap and telemetry.
  - Add first-pass forced mutator composition for daily/weekly presets.
- Why we are doing it
  - Increase retention via recurring challenge goals while preserving simulation determinism.
- Impacted areas
  - Core preset resolution, menu/death start orchestration, gameplay mutator merge, observability.
- Risks / unknowns
  - Forced mutator can over-stack pressure on some floors if not bounded by existing guardrails.

## Goals / Non-Goals

**Goals:**
- Deterministic daily/weekly preset seed resolution.
- Bounded preset modifier behavior using existing mutator taxonomy.
- Keep GameScene as orchestrator and preserve simulation ownership boundaries.
- Emit stable preset context in run telemetry.

**Non-Goals:**
- New backend challenge services.
- Full challenge UI shell redesign.
- Multi-mutator curated packs beyond first-pass one-mutator preset behavior.

## Decisions

### Decision: Resolve presets from UTC day/week buckets
- Daily preset derives from UTC day index; weekly preset derives from UTC week index.
- Rationale: stable cross-client determinism for a shared challenge period.
- Alternative considered: local-time bucket; rejected due to timezone divergence and harder reproducibility.

### Decision: Reuse existing mutator catalog for first-pass preset modifiers
- Presets select a deterministic mutator id from existing challenge-mutator catalog.
- Rationale: reuse balanced taxonomy and HUD readability contracts without inventing new rule systems.
- Alternative considered: custom preset-only modifier schema; rejected for higher maintenance and overlap.

### Decision: Keep standard run start unchanged, add keyboard preset entry points
- Enter/Space remains standard run; `D`/`W` start daily/weekly presets.
- Rationale: low-risk additive UX path with minimal DOM changes.
- Alternative considered: new menu buttons; deferred to a later polish pass.

### Decision: Preserve preset mode on death restart
- Restart inherits current preset id so retry comparisons remain fair.
- Rationale: challenge integrity and player learning clarity.

## Risks / Trade-offs

- [Risk] Forced mutator may feel too swingy on early floors. -> Mitigation: only apply when floor meets mutator minimum floor and respect existing mutator guardrails.
- [Risk] Keyboard-only entry path is less discoverable on touch. -> Mitigation: keep this as first-pass contract and follow with explicit UI surface later.
- [Risk] Calendar bucket boundaries can surprise users at rollover time. -> Mitigation: telemetry includes preset id and bucket-based seed context for debugging.

## Migration Plan

1. Add challenge preset resolver module and state fields.
2. Integrate menu/death run bootstrap to resolve preset seed + mutator id.
3. Merge preset mutator into existing mutator orchestration in `GameScene`.
4. Extend telemetry payload fields.
5. Add deterministic unit tests for preset resolution.
6. Validate with `pnpm check`, `pnpm smoke`, and strict OpenSpec validation.

Rollback strategy:
- Revert preset resolver integration points; standard seed flow remains intact.

## Open Questions

- Should daily/weekly presets become explicit touch UI controls in a follow-up change?
- Should weekly preset lock a small pack (2 mutators) once readability telemetry confirms fairness?
