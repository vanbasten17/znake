# AGENTS.md

## Project
Znake is a roguelite Snake game built with TypeScript and Phaser.

Priorities:
- deterministic gameplay logic
- fast iteration
- clear separation between simulation and rendering
- data-driven systems over hardcoded logic

## Architecture
- Keep simulation logic pure and testable when possible
- Keep Phaser code focused on presentation
- Treat GameScene as an orchestrator, not the home of gameplay rules
- Do not mix rendering and simulation unless the task explicitly requires it

## Routing guide
- Gameplay rules, progression, economy, unlock logic -> `src/game/core/**`
- Deterministic run simulation, spawning, pathing, RNG flow -> `src/game/simulation/**`
- Scene orchestration, update-loop wiring, lifecycle coordination -> `src/game/scenes/**` and `src/game/scenes/gameScene/**`
- UI state adapters, DOM/HUD bridges, input command mapping, telemetry gateways -> `src/game/systems/**`
- Rendering assets/utilities, marker/shader drawing paths -> `src/game/render/**` and `src/game/visual/**`
- Shared constants/IDs used across layers -> `src/game/shared/**` and `src/game/config/**`
- Bootstrap and app entry wiring -> `src/game/phaser.ts` and `src/main.ts`
- Validation/automation/playtest scripts -> `tools/**`
- Behavior and regression checks -> `tests/**/*.test.ts`
- OpenSpec source of truth for behavior changes -> `openspec/specs/**` and active `openspec/changes/<change>/*`

## Routing constraints
- Put gameplay decisions in `core`/`simulation`, not in `scenes`.
- Treat `scenes` as orchestration only: wiring, lifecycle, and presentation triggers.
- Prefer changing the lowest valid layer first (`core`/`simulation` -> `systems` -> `scenes`).
- Keep rendering and UI work in `systems`/`render`/`styles`; do not embed rule logic there.
- Minimize cross-layer edits; touch only the layers required by the task.
- Reuse existing modules before adding new files or abstractions.
- Do not change balance constants in `src/game/core/balance.ts` unless explicitly requested.
- For behavior changes, route through active OpenSpec artifacts before apply.

## Commands
Use:
- pnpm build
- pnpm check

Run them before finishing significant code changes.
For tiny edits or exploratory work, use judgment.

## Change rules
- Keep changes minimal and focused
- Do not change gameplay behavior unless requested
- Do not introduce large rewrites without explicit instruction
- Avoid new dependencies unless necessary

## OpenSpec workflow
- For implementation (`apply`), use current base specs in `openspec/specs/` as the source of truth.
- Do not read `openspec/changes/archive/` by default during implementation.
- Only consult `openspec/changes/archive/` when historical intent is required (for example conflict resolution, unclear requirement lineage, or explicit user request).
- Prefer the smallest context needed to complete the current change safely.

## Execution profile
- Proposal/design work: prefer higher reasoning depth.
- Apply implementation work: prefer low reasoning depth by default.
- Raise apply reasoning depth only for core simulation, determinism-sensitive logic, or architectural refactors.

## Task sizing
- Keep each change scoped to 3-6 implementation tasks where possible.
- Keep tasks small and single-purpose to improve throughput and reviewability.
- Prefer incremental apply iterations over large one-shot implementations.

## Context discipline
- During apply, read only what is needed: current `tasks.md`, relevant files in `openspec/specs/`, and touched code paths.
- Avoid broad planning-document reads unless the task is explicitly planning-oriented; prefer active `openspec/changes/*` context.

## Validation policy
- JS/TS pre-gate normalization (mandatory before strict checks):
  1) `pnpm exec biome check --write --unsafe .`
  2) `pnpm format`
  3) `pnpm check`
- Do not run strict checks immediately after edits without running the formatter/import-normalization path first.
- Small/localized changes: run `pnpm check`.
- Significant behavior or architecture changes: run both `pnpm check` and `pnpm build`.

## Testing
Prefer deterministic tests for pure logic.
Use fixed seeds when randomness is involved.

## Large changes
For large or risky changes, propose a short plan/spec before implementation.

## Failure memory loop
- Treat `FAIL_MEMORY.md` as an active process-improvement input, not a passive history log.
- When a task fails or is blocked, append one short entry with:
  - Date
  - Task
  - What failed
  - Root cause
  - Prevention rule
  - System fix (`none` | `agents_rule` | `script`)
- Before starting substantial work, scan the most relevant recent entries and apply any matching prevention rules.
- If the same failure class appears 3+ times, it must trigger a system fix in the same session:
  - mechanically preventable (`format/import/order/wrap`-style) -> prefer `script`
  - workflow/architecture/process -> use `agents_rule`
- Repeated formatting, import-order, and line-wrap failures are process design issues; do not classify them as discipline-only misses.
- Escalation rule: when repeats persist, update guidance or tooling (or both), not just `FAIL_MEMORY.md`.

## Scene size guardrail behavior
- When `src/game/scenes/GameScene.ts` (or similar oversized orchestrator files) is near architecture guardrails, default feature work to extraction/compaction.
- Do not add new inline feature branches in near-threshold scene files unless extraction is explicitly blocked.

## Fast map
- Entrypoint app: `src/main.ts`
- Phaser bootstrap: `src/game/phaser.ts`
- Main orchestrator scene: `src/game/scenes/GameScene.ts`
- Pure gameplay/domain logic: `src/game/core/**`
- Input/UI bridge: `src/game/systems/**`
- Tests: `tests/**/*.test.ts`
- Automation/scripts: `tools/**`

## Safe change zones
- UI/HUD tweaks: prefer `src/game/systems/**` and `src/styles/**`
- Gameplay rules: prefer `src/game/core/**`
- Avoid adding new gameplay logic directly into Phaser scene files unless unavoidable
- Avoid changing balancing constants unless task explicitly asks for it

## Definition of done
- Small refactor/bugfix: `pnpm check` + targeted tests if relevant
- Gameplay change: `pnpm check && pnpm test`
- Risky/systemic change: `pnpm check && pnpm test && pnpm build`
- Rendering/UX changes: include a short manual verification note

## Prompting conventions for Codex
- Prefer minimal diffs
- Preserve current architecture guardrails
- When uncertain, inspect existing patterns before inventing new ones
- Summarize changed files and residual risks at the end

## graphify

This project has a graphify knowledge graph at graphify-out/.

Maintenance:
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)

Codex-local skill:
- `graphify` skill file: `.codex/skills/graphify/SKILL.md`
- Trigger from Codex: `$graphify`

## Mandatory Graph Query Workflow

For architecture, flow, dependency, and “where/how is X handled?” questions:

1. You MUST run the local graph query workflow first:
   - `pnpm graph:query -- "<question>"`
2. You MUST summarize the graph query output first.
3. Only then may you inspect source files.
4. You MUST inspect the smallest possible set of files (ideally ≤5).
5. You MUST NOT begin with broad file scanning.

Fallback:
- If the graph query workflow fails, you MUST read `graphify-out/GRAPH_REPORT.md` before opening files.

For behavior changes:

- You MUST consult `openspec/specs/**` and active `openspec/changes/**` before modifying code.

## Execution Protocol

When answering a question, follow this order:

1. Read `AGENTS.md`
2. Run `pnpm graph:query -- "<question>"`
3. Analyze graph query results
4. (Fallback) Read `graphify-out/GRAPH_REPORT.md` if needed
5. Inspect minimal set of files
6. Answer
7. Ensure clarity
