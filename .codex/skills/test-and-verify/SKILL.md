---
name: test-and-verify
description: Deterministic verification skill that selects the minimum required validation gates by risk tier and reports pass/fail clearly.
---

# test-and-verify

## Purpose
Run risk-tiered validation deterministically and report trustworthy outcomes.
Enforce required gates from `AGENTS.md` without under-testing.

## Triggers
- Keyword triggers: `test`, `verify`, `validate`, `checks`, `gate`, `CI`, `pass/fail`.
- Intent-based triggers: user asks to confirm correctness, run commands, or prove change safety before handoff.

## Priority
high

## When to use
- After implementation, before handoff/archive.
- When regressions are suspected.
- When user explicitly asks for command-based verification.

## When NOT to use
- Request is analysis-only with no execution needed.
- Implementation scope is unclear and routing is unresolved.

## Where to look
- Validation policy and done criteria: `AGENTS.md`, `README.md`.
- Tests and contracts: `tests/**/*.test.ts`.
- Touched logic layers: `src/game/core/**`, `src/game/simulation/**`, `src/game/systems/**`, `src/game/scenes/**`.
- Validation scripts: `tools/architecture-guardrails.mjs`, `tools/fairness-validation.ts`, other `tools/**` scripts.
- Behavior intent: active `openspec/changes/<change>/*`, `openspec/specs/**`.

## Steps
1. Read `AGENTS.md`.
2. Apply routing guide to classify the touched layers and risk tier.
3. Inspect existing tests/patterns for the changed paths.
4. Identify minimal required validation scope.
5. Run required commands by tier and capture pass/fail output.
6. Avoid cross-layer code changes during verification unless fixing a blocking check is explicitly requested.
7. Report results, residual risks, and any manual verification needed.

## Validation
- Small/localized changes: `pnpm check`.
- Logic/gameplay changes: `pnpm check && pnpm test`.
- Risky/systemic changes: `pnpm check && pnpm test && pnpm build`.

## What to avoid
- Declaring success if required gates failed.
- Skipping required tier commands.
- Ignoring deterministic test expectations for gameplay logic.
- Touching unrelated files while running verification.

## Conflict resolution
Apply shared policy first: `../references/conflict-policy.md`.

If multiple skills match:
1. Prefer higher Priority.
2. Prefer explicit validation intent triggers (`test`, `verify`, `validate`).
3. If validation follows implementation, keep implementation skill for code edits and use `test-and-verify` for gate execution.
4. If still ambiguous, start with `explore-safe`.

## Fallback behavior
If validation scope is unclear:
- Fall back to `explore-safe` to classify risk tier before running commands.
