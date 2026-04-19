---
name: bugfix-safe
description: Deterministic, minimal-diff bugfix skill for targeted corrections without behavior drift or architecture violations.
---

# bugfix-safe

## Purpose
Fix defects with the smallest safe change.
Preserve gameplay intent, determinism, and architecture boundaries.

## Triggers
- Keyword triggers: `fix`, `bug`, `issue`, `error`, `broken`, `regression`, `unexpected behavior`.
- Intent-based triggers: user wants a correction, not a feature; scope implies behavior should remain the same except for defect removal.

## Priority
high

## When to use
- Defect is reproducible and expected behavior is known.
- Change should not alter gameplay balance or feature scope.
- A focused patch plus regression test is sufficient.

## When NOT to use
- Request is an intentional gameplay/rules change.
- Request is purely visual/HUD/rendering polish.
- Request is only to run checks and report results.

## Where to look
- Gameplay/domain bug sources: `src/game/core/**`, `src/game/simulation/**`.
- Adapter and integration points: `src/game/systems/**`.
- Orchestration glue only (if unavoidable): `src/game/scenes/**`, `src/game/scenes/gameScene/**`.
- Regressions and contracts: `tests/**/*.test.ts`.
- Behavior intent/source: `openspec/specs/**`, active `openspec/changes/<change>/*`.

## Steps
1. Read `AGENTS.md`.
2. If the bug question is architectural/flow-oriented, run `pnpm graph:query -- "<question>"` and summarize relevant nodes/files.
3. For behavior-sensitive bugfixes, consult `openspec/specs/**` and active `openspec/changes/<change>/*` before edits.
4. Apply the routing guide and locate the lowest valid fix layer.
5. Inspect existing patterns in adjacent files/tests with minimal file reads (target: `<=5` when feasible).
6. Identify the minimal change scope and non-goals.
7. Implement the smallest safe fix in `core/simulation` first; use `systems/scenes` only when required.
8. Avoid cross-layer modifications beyond required wiring.
9. Add/update deterministic regression tests and run required validation.

## Validation
- Small/localized bugfix: `pnpm check`.
- Logic-affecting bugfix: `pnpm check && pnpm test`.
- Risky/systemic bugfix: `pnpm check && pnpm test && pnpm build`.

## What to avoid
- Changing `src/game/core/balance.ts` unless explicitly required.
- Mixing gameplay rule logic into scene rendering/orchestration code.
- Introducing new dependencies or large refactors for a narrow fix.
- Touching unrelated files.
- Starting with broad repo scanning instead of graph/OpenSpec context where applicable.

## Conflict resolution
Apply shared policy first: `../references/conflict-policy.md`.

If multiple skills match:
1. Prefer higher Priority.
2. Prefer the most specific defect-oriented trigger.
3. Prefer safer skill order: `explore-safe > bugfix-safe > rendering-only > gameplay-change`.
4. If still ambiguous, run `explore-safe` first.

## Fallback behavior
If bug intent is unclear:
- Fall back to `explore-safe`.
- Diagnose before editing.
