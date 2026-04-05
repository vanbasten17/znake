---
name: rendering-only
description: Presentation-only implementation skill for UI/HUD/render updates that preserve gameplay logic and deterministic behavior.
---

# rendering-only

## Purpose
Implement visual and UI changes without changing gameplay rules.
Keep rendering concerns isolated from simulation and core logic.

## Triggers
- Keyword triggers: `UI`, `HUD`, `render`, `visual`, `animation`, `VFX`, `CSS`, `overlay`, `readability`.
- Intent-based triggers: user asks for presentation polish, UI behavior, or feedback improvements without changing mechanics.

## Priority
medium

## When to use
- Change is presentation-only (UI/HUD/feedback/visual clarity).
- No gameplay rule or balance changes are intended.
- Scene edits are limited to orchestration/presentation wiring.

## When NOT to use
- Request modifies game mechanics, progression, or spawn/combat rules.
- Request is primarily a bugfix in gameplay logic.
- Task is validation-only.

## Where to look
- Presentation bridges: `src/game/systems/**`.
- Styles: `src/styles/**`.
- Render and visual modules: `src/game/render/**`, `src/game/visual/**`.
- Scene wiring only: `src/game/scenes/**`, `src/game/scenes/gameScene/**`.
- Visual contracts/tests: `tests/**/*.test.ts`.
- Visual tooling: `tools/visual-language-check.ts`, `tools/marker-pipeline-check.ts`.

## Steps
1. Read `AGENTS.md`.
2. Apply routing guide and confirm non-goal: no gameplay rule changes.
3. Inspect existing UI/render patterns in target modules.
4. Identify minimal change scope and manual-check expectations.
5. Implement the smallest safe presentation change in `systems/render/styles`.
6. Avoid cross-layer modifications into `core/simulation`.
7. Add/update relevant tests and run required validation.

## Validation
- Small presentation change: `pnpm check`.
- Rendering/UI logic impact: `pnpm check && pnpm test`.
- Risky/systemic presentation wiring: `pnpm check && pnpm test && pnpm build`.
- If applicable: `pnpm validate:visual-language` and/or `pnpm validate:markers`.

## What to avoid
- Modifying gameplay rules or deterministic simulation behavior.
- Editing `src/game/core/balance.ts`.
- Coupling rendering decisions with gameplay rule logic.
- Touching unrelated files.

## Conflict resolution
Apply shared policy first: `../references/conflict-policy.md`.

If multiple skills match:
1. Prefer higher Priority.
2. Prefer specific rendering/UI trigger matches.
3. Prefer safer skill order: `explore-safe > bugfix-safe > rendering-only > gameplay-change`.
4. If ambiguous between rendering and gameplay, default to `explore-safe` first.

## Fallback behavior
If request may affect gameplay logic:
- Switch to `explore-safe` to clarify boundaries before edits.
