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
