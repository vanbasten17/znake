---
name: gameplay-change
description: OpenSpec-aligned gameplay implementation skill for intentional rule/mechanic updates with deterministic tests and strict layer routing.
---

# gameplay-change

## Purpose
Implement intentional gameplay and mechanic changes safely.
Keep rule logic deterministic and out of scene presentation layers.

## Triggers
- Keyword triggers: `gameplay`, `mechanic`, `rules`, `progression`, `economy`, `difficulty`, `fairness`, `feature`.
- Intent-based triggers: user explicitly requests behavior change, new mechanic, or system-level gameplay adjustment.

## Priority
low

## When to use
- Task changes player-facing gameplay behavior intentionally.
- Mechanics, progression, rewards, or game rules must be added/updated.
- OpenSpec change context exists or should be created for behavior changes.

## When NOT to use
- Task is a defect fix with no intended behavior expansion.
- Task is presentation-only (UI/HUD/rendering).
- Task is verification-only.

## Where to look
- Rule logic and state: `src/game/core/**`, `src/game/simulation/**`.
- Configuration and shared contracts: `src/game/config/**`, `src/game/shared/**`.
- Bridges/wiring: `src/game/systems/**`.
- Orchestration only: `src/game/scenes/**`, `src/game/scenes/gameScene/**`.
- Behavior specs: `openspec/specs/**`, active `openspec/changes/<change>/{proposal,design,tasks}.md`.
- Regression coverage: `tests/**/*.test.ts`.

## Steps
1. Read `AGENTS.md`.
2. Apply routing guide and confirm behavior scope in active OpenSpec artifacts.
3. Inspect existing mechanic patterns in `core/simulation` and related tests.
4. Identify minimal change scope and explicit non-goals.
5. Implement smallest safe rule change in `core/simulation`; wire through `systems`, then `scenes` only if required.
6. Avoid cross-layer modifications and inline scene complexity.
7. Add deterministic tests (fixed seeds where randomness exists) and run required validation.

## Validation
- Small change with limited impact: `pnpm check`.
- Gameplay logic change: `pnpm check && pnpm test`.
- Risky/systemic gameplay change: `pnpm check && pnpm test && pnpm build`.

## What to avoid
- Implementing gameplay rules directly inside `src/game/scenes/**`.
- Editing `src/game/core/balance.ts` unless explicitly required.
- Broad architectural rewrites not required by scope.
- Touching unrelated files.

## Conflict resolution
Apply shared policy first: `../references/conflict-policy.md`.

If multiple skills match:
1. Prefer higher Priority.
2. Prefer specific gameplay-intent triggers over generic wording.
3. Prefer safer skill order: `explore-safe > bugfix-safe > rendering-only > gameplay-change` when ambiguity remains.
4. If still ambiguous, start with `explore-safe`.

## Fallback behavior
If gameplay intent is uncertain:
- Use `explore-safe` first.
- Do not implement until scope is explicit.
