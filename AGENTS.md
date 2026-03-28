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
- Small/localized changes: run `pnpm check`.
- Significant behavior or architecture changes: run both `pnpm check` and `pnpm build`.

## Testing
Prefer deterministic tests for pure logic.
Use fixed seeds when randomness is involved.

## Large changes
For large or risky changes, propose a short plan/spec before implementation.

## Failure memory loop
- Track execution failures in `FAIL_MEMORY.md` so recurring mistakes become explicit process improvements.
- When a task fails or is blocked, append one short entry with:
  - Date
  - Task
  - What failed
  - Root cause
  - Prevention rule
  - AGENTS.md update candidate (yes/no + one sentence)
- Before starting substantial work, scan the most relevant recent entries and apply any matching prevention rules.
- Promote only repeated or high-impact prevention rules into `AGENTS.md` to keep guidance concise and useful.
