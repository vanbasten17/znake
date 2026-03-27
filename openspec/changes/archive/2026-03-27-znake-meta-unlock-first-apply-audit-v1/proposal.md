## Why

Unlock-first progression already exists in base specs, but current implementation still has a hardcoded mutator unlock gate and limited player-facing visibility for unlock readiness. We should close those gaps so progression breadth is consistent, deterministic, and clearly surfaced.

## Key Points (Codex-style)

- **What is changing**: Meta unlock gating becomes fully balance-driven and breadth-aware across progression goals, with consistent menu surfacing and deterministic tests.
- **Why we are doing it**: Unlock-first progression should expand possibilities (mutators/choices) instead of relying on opaque or hardcoded gates.
- **Impacted areas**: Meta progression helpers, challenge mutator availability policy, menu progression surface text, and progression tests.
- **Risks / unknowns**: Over-permissive unlock thresholds could shift difficulty too early; unlock messaging must remain concise on mobile.

## What Changes

- Replace hardcoded mutator unlock checks with centralized, data-driven goal-threshold policy.
- Expand unlock breadth so progression can unlock through multiple tracked goals under deterministic policy.
- Surface unlock readiness consistently in menu progression UI without changing run-start flow ownership.
- Add deterministic tests for unlock gating policy and progression-surface consistency.

## Capabilities

### New Capabilities

- `meta-unlock-audit`: Deterministic audit and closure of unlock-first progression gating/surface gaps.

### Modified Capabilities

- `meta-progression`: Mutator availability gating is aligned with centralized unlock policy and progression breadth.
- `game-core`: Shared progression-related runtime contracts include deterministic unlock policy shape consumed by gameplay.
- `scenes`: Menu progression surface communicates unlock readiness consistently.

## Impact

- Affected modules: `src/game/core/balance.ts`, `src/game/core/meta.ts`, `src/game/scenes/MenuScene.ts`, `src/game/systems/i18n.ts`.
- Affected tests: mutator/meta progression deterministic coverage in `tests/`.
- No new dependencies expected.
