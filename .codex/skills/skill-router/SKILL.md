---
name: skill-router
description: Automatically select the correct Znake execution skill (explore-safe, bugfix-safe, gameplay-change, rendering-only, test-and-verify) using deterministic trigger and conflict rules.
---

# skill-router

## Purpose
Route each request to one safe, specific skill with minimal ambiguity.
Enforce deterministic selection, conflict resolution, and fallback behavior.

## Triggers
- Keyword triggers: `fix`, `bug`, `issue`, `error`, `gameplay`, `mechanic`, `rules`, `UI`, `HUD`, `render`, `visual`, `test`, `verify`, `validate`, `explore`, `analyze`.
- Intent-based triggers: user asks for coding work, debugging, gameplay updates, rendering/UI updates, or validation and a safe skill choice is needed.

## Priority
high

## When to use
- Default entry point for ambiguous or broad engineering requests.
- Any request that could match multiple skills.
- Any request that needs strict architecture-safe routing before edits.

## When NOT to use
- User explicitly names one exact skill and scope is already clear.
- Task is outside this skill family and requires another domain-specific skill.

## Where to look
- Routing and architecture rules: `AGENTS.md`, `README.md`.
- Shared conflict rules: `../references/conflict-policy.md`.
- Candidate skills:
  - `../explore-safe/SKILL.md`
  - `../bugfix-safe/SKILL.md`
  - `../gameplay-change/SKILL.md`
  - `../rendering-only/SKILL.md`
  - `../test-and-verify/SKILL.md`
- Codebase routing targets:
  - `src/game/core/**`
  - `src/game/simulation/**`
  - `src/game/scenes/**`
  - `src/game/systems/**`
  - `tools/**`
  - `tests/**/*.test.ts`

## Steps
1. Read `AGENTS.md`.
2. For architecture/flow/dependency/"where is X handled" questions, run `pnpm graph:query -- "<question>"` first and summarize graph output before any file inspection.
3. For behavior-change requests, route to OpenSpec-first flow: consult `openspec/specs/**` and active `openspec/changes/**`, then run `pnpm graph:query -- "<topic>"`.
4. Apply routing guide to identify likely layers and risk class.
5. Match request against each candidate skill `Triggers`.
6. Resolve conflicts using `../references/conflict-policy.md`.
7. Select exactly one implementation skill (`explore-safe`, `bugfix-safe`, `gameplay-change`, or `rendering-only`), then append `test-and-verify` only when validation is requested/required.
8. Execute the selected skill’s `Steps` with smallest safe scope.
9. Run required validation tier and report selected skill + reason.

## Validation
- Small/localized changes: `pnpm check`.
- Logic/gameplay changes: `pnpm check && pnpm test`.
- Risky/systemic changes: `pnpm check && pnpm test && pnpm build`.

## What to avoid
- Running multiple implementation skills on the same change without need.
- Skipping conflict-policy tiebreaks.
- Bypassing routing constraints or cross-layer guardrails.
- Editing unrelated files or expanding scope during routing.
- Starting architecture answers by broad file scanning without graph query context.

## Conflict resolution
Apply `../references/conflict-policy.md` exactly.

## Fallback behavior
If no skill is a clear match:
- choose `explore-safe`
- do not modify code until context is clear
