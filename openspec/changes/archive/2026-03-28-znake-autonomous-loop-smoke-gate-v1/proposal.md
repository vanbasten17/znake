## Why

El cicle `next-steps -> propose/apply -> check -> verify/archive -> commit` encara depèn de massa passos manuals i interrupcions, cosa que redueix throughput i introdueix errors d'ordre. Necessitem un loop autònom, deterministic-friendly i amb consum d'IA mínim que només activi IA on aporta valor real (proposta/aplicació), mantenint gates tècnics i de gameplay.

## What Changes

- Add a repo-level autonomous loop orchestrator that sequences quality gates and OpenSpec lifecycle steps with resumable state.
- Add a deterministic headless smoke playtest runner that executes bot-driven matches and emits heuristic metrics.
- Insert smoke playtest gate between `pnpm check` and OpenSpec verification/archive actions.
- Add low-IA execution mode where prompt generation and workflow decisions are templated/cached instead of ad-hoc conversational loops.
- Add a commit-message output artifact so post-archive commit step can be done in one command.

## Key Points (Codex-style)

- **What is changing**
  - The team gets an executable `autoloop` pipeline that can run the OpenSpec cycle with deterministic smoke gating and archive/commit assistance.
- **Why we are doing it**
  - To reduce operator overhead, enforce correct order of operations, and keep AI usage focused on creative/spec implementation work only.
- **Impacted areas**
  - Tooling scripts, package scripts, OpenSpec task flow, and deterministic simulation smoke checks.
- **Risks / unknowns**
  - A first MVP smoke simulation may not cover all runtime interactions from Phaser scene orchestration; thresholds may need tuning with baseline data.

## Capabilities

### New Capabilities

- `autonomous-dev-loop`: deterministic, resumable orchestration of next-step selection, quality gates, OpenSpec validation/archive readiness, and commit prep.

### Modified Capabilities

- `tooling`: add smoke playtest gate contract and autonomous loop command workflow requirements.

## Impact

- New tooling scripts under `tools/` for autonomous loop orchestration and smoke playtest metrics.
- Updates to `package.json` scripts for `smoke`, `autoloop`, and gate commands.
- New change-level specs in `openspec/changes/znake-autonomous-loop-smoke-gate-v1/specs/tooling/spec.md` and `specs/autonomous-dev-loop/spec.md`.
- No gameplay rule changes in production scene flow for MVP; this is tooling and validation-path focused.
