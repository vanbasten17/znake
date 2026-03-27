## Context

Current mutator availability is computed from a single hardcoded goal (`floor_5`) in `isChallengeMutatorsUnlocked`, while balance already owns progression knobs. This creates drift risk and reduces unlock breadth. We will align unlock policy with centralized config and ensure menu progression surfaces communicate readiness clearly.

## Key Points (Codex-style)

- **What is changing**: Unlock policy moves to balance-driven goal-threshold mapping, menu UI surfaces readiness status, and deterministic tests lock behavior.
- **Why we are doing it**: Keep unlock-first progression coherent, tunable, and readable for players and designers.
- **Impacted areas**: Balance availability policy, meta unlock helper, menu goals title/status rendering, and tests.
- **Risks / unknowns**: Policy changes may unlock mutators earlier/later than expected; UI copy must stay compact.

## Goals / Non-Goals

**Goals:**
- Remove hardcoded mutator unlock gate logic from meta helpers.
- Support breadth unlock by evaluating multiple progression goals through centralized config.
- Present unlock readiness state consistently in menu progression context.
- Add deterministic tests for unlock policy decisions.

**Non-Goals:**
- Introducing new economy currencies or progression systems.
- Reworking talent/relic systems.
- Expanding mutator catalog itself.

## Decisions

1. **Use centralized unlock policy map in balance config**
   - Decision: Express mutator unlock thresholds as a goal-progress map and evaluate with explicit mode (`any` for this iteration).
   - Why: Data-driven tuning without code edits, and broader unlock paths.
   - Alternative considered: Keep one hardcoded goal; rejected as brittle and narrow.

2. **Keep unlock evaluation pure/deterministic in meta helper**
   - Decision: `isChallengeMutatorsUnlocked` resolves from profile goal progress and balance policy only.
   - Why: Deterministic behavior and testability.
   - Alternative considered: Scene-derived heuristics; rejected due to coupling.

3. **Surface unlock readiness in existing menu progression title**
   - Decision: Append concise unlock readiness label in goals section title.
   - Why: Clear, low-cost visibility without layout rewrite.
   - Alternative considered: New dedicated panel; rejected as scope creep.

## Risks / Trade-offs

- **[Risk] Unlocks happen earlier than previous behavior** → Mitigation: conservative thresholds and deterministic tests.
- **[Risk] Menu text clutter** → Mitigation: short localized labels and existing title line reuse.
- **[Risk] Config drift in future edits** → Mitigation: tests assert behavior against policy map.

## Migration Plan

1. Introduce unlock policy map fields in centralized balance config.
2. Update meta helper to evaluate configured goals deterministically.
3. Update menu refresh path to show unlock readiness label.
4. Add/adjust deterministic tests and run validation.

Rollback strategy: revert to previous single-goal gating while retaining tests for baseline behavior.

## Open Questions

- Should future unlock policies support `all` mode for stricter progression beats?
- Should unlock readiness also be echoed in pre-run relic draft in a later UX pass?
