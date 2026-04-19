---
name: explore-safe
description: Safe-first investigation skill that gathers minimal context, routes work to the right layer, and avoids edits until scope is clear.
---

# explore-safe

## Purpose
Diagnose and scope tasks safely before implementation.
Produce a minimal, deterministic plan that avoids wrong-layer edits.

## Triggers
- Keyword triggers: `explore`, `understand`, `analyze`, `investigate`, `triage`, `debug context`, `where to change`.
- Intent-based triggers: user asks for analysis first, asks for root-cause discovery, or request is ambiguous/risky and implementation target is unclear.

## Priority
high

## When to use
- Problem source is unclear and code changes are not yet safe.
- Multiple layers could be involved and routing must be resolved first.
- Request is broad and needs narrowing to smallest safe scope.

## When NOT to use
- User explicitly requests immediate implementation with clear scope and layer.
- Task is purely validation execution (`test`, `verify`, `run checks`) with no analysis need.
- Task is a well-scoped rendering-only or gameplay-change implementation.

## Where to look
- Rules and routing: `AGENTS.md`, `README.md`.
- Gameplay/domain: `src/game/core/**`, `src/game/simulation/**`.
- Orchestration: `src/game/scenes/**`, `src/game/scenes/gameScene/**`.
- UI/input/bridges: `src/game/systems/**`.
- Scripts and automation: `tools/**`.
- Contracts/regressions: `tests/**/*.test.ts`.
- Behavior intent: `openspec/specs/**`, active `openspec/changes/<change>/*`.

## Steps
1. Read `AGENTS.md`.
2. For architecture/flow/dependency questions, run `pnpm graph:query -- "<question>"` and summarize components/files/relationships.
3. If behavior change is involved, consult `openspec/specs/**` and active `openspec/changes/<change>/*` before source inspection.
4. Apply the routing guide from `AGENTS.md` to identify the likely layer.
5. Inspect existing patterns in the smallest relevant set of files (target: `<=5`).
6. Identify minimal change scope (1-3 files) and likely risk points.
7. Propose the smallest safe change plan; do not implement yet unless explicitly asked.
8. Avoid cross-layer modifications in the proposed plan.
9. If implementation is requested, hand off to the matching execution skill and run required validation.

## Validation
- Exploration-only: no commands required.
- Small implementation follow-up: `pnpm check`.
- Logic-impact follow-up: `pnpm check && pnpm test`.
- Risky/systemic follow-up: `pnpm check && pnpm test && pnpm build`.

## What to avoid
- Modifying code before scope is clear.
- Opening source files before graph query on architecture/flow-style questions.
- Jumping directly to `src/game/scenes/**` for gameplay behavior fixes.
- Reading `openspec/changes/archive/**` by default.
- Touching `src/game/core/balance.ts` unless explicitly requested.
- Proposing broad refactors without direct evidence.

## Conflict resolution
Apply shared policy first: `../references/conflict-policy.md`.

If multiple skills match:
1. Prefer higher Priority.
2. Prefer more specific trigger match.
3. Prefer safer skill: `explore-safe > bugfix-safe > rendering-only > gameplay-change`.
4. If still ambiguous, stay in `explore-safe` and analyze before acting.

## Fallback behavior
If no skill matches:
- Default to `explore-safe`.
- Do not modify code until routing and scope are explicit.
