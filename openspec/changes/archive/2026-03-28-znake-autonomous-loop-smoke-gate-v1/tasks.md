## 1. OpenSpec and command surface

- [x] 1.1 Add OpenSpec deltas for autonomous loop orchestration and tooling smoke-gate requirements.
- [x] 1.2 Add package scripts for `smoke`, `autoloop`, and loop report commands.

## 2. Deterministic smoke playtest harness

- [x] 2.1 Implement a headless deterministic smoke runner using pure simulation primitives and heuristic bot decisions.
- [x] 2.2 Add threshold-based pass/fail evaluation and JSON artifacts for per-seed and aggregate metrics.

## 3. Autonomous loop orchestrator

- [x] 3.1 Implement `.autoloop` state handling and strict stage order (`check -> smoke -> openspec validate`).
- [x] 3.2 Add low-IA prompt/commit-message artifact generation for next actions.
- [x] 3.3 Add optional `--autoarchive` and `--autocommit` flags with safe defaults.

## 4. Verification

- [x] 4.1 Run `pnpm check` and fix issues.
- [x] 4.2 Run `pnpm build` and confirm integration passes.
