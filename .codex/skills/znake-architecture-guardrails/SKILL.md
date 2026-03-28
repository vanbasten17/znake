---
name: znake-architecture-guardrails
description: Enforce Znake architecture, reuse, and iteration-speed guardrails for feature and refactor work. Use when planning, reviewing, or implementing changes in scenes, simulation, systems, core balance, telemetry, i18n, or UI overlays; when deciding whether to extract modules; when checking duplication risk; or when validating that changes preserve deterministic simulation boundaries and OpenSpec-first workflow expectations.
---

# Znake Architecture Guardrails

## Overview
Apply explicit guardrails that keep the codebase modular, deterministic, and fast to iterate.
Prefer extraction and shared adapters over adding complexity to scene files.

## Skill Relations
- Use with `znake-brainstorming-openspec-apply` when converting ideas into actionable, architecture-safe directions.
- Use with `znake-brainstorming-openspec-apply` when selecting next items and generating execution prompts.
- Use with `znake-autoloop-next-steps` during autonomous cycles as a mandatory boundary check layer.

## Workflow
1. Classify touched files by layer: `simulation`, `core/config`, `systems`, `scenes`, `ui`.
2. Run boundary checks from [references/module-boundaries.md](references/module-boundaries.md).
3. Run the relevant checklist from [references/checklists.md](references/checklists.md).
4. If any trigger is hit, propose the smallest extraction-first change.
5. Keep gameplay behavior unchanged unless explicitly requested.
6. For behavior-affecting work, route through OpenSpec workflow artifacts before apply.

## Hard Rules
- Keep `simulation/*` deterministic and side-effect free.
- Keep `scenes/*` as orchestrators, not rule engines.
- Keep cross-cutting behavior behind shared adapters in `systems/*`.
- Prefer data-driven tuning in `core/balance` and config modules, not scene-local constants.
- If logic appears in 2 places, plan extraction before introducing a 3rd copy.
- If `GameScene.ts` (or similar oversized scene orchestrators) is near guardrail limits, default to extraction/compaction before adding inline feature logic.

## Trigger Conditions
When any condition is true, force explicit simplification planning in the response:
- Scene file exceeds 1200 lines.
- Scene file imports exceed 20.
- New DOM overlay/card construction is added in a scene with existing similar builders elsewhere.
- New telemetry event payload shape is added directly in a scene.
- New gameplay tuning constants are introduced in scenes instead of balance/config.
- Scene file is close to architecture limit (for example within 100 lines of the enforced ceiling).

## Gate Hygiene Rules
- For JS/TS work, run pre-gate normalization before strict checks:
  1) `pnpm exec biome check --write --unsafe .`
  2) `pnpm format`
  3) `pnpm check`
- Do not run strict gate checks immediately after edits without this normalization path.
- Treat repeated format/import/line-wrap failures as workflow design problems; recommend script automation instead of discipline reminders.

## Output Contract
For architecture-sensitive tasks, include these sections in your response:
1. `Boundary Check`
2. `Reuse/Extraction Opportunities`
3. `Risk to Iteration Speed`
4. `Minimal Safe Plan`

## References
- Use [references/module-boundaries.md](references/module-boundaries.md) for allowed dependencies and anti-patterns.
- Use [references/checklists.md](references/checklists.md) for quick pre-apply and review checklists.
