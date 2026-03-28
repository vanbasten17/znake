# FAIL_MEMORY.md

Purpose: capture execution failures and blockers so we can continuously improve process and AGENTS guidance.

## Usage
- Append entries; do not rewrite history.
- Keep each entry brief and concrete.
- Add an entry when a task fails, stalls, or needs retries due to avoidable process issues.

## Entry Template

### YYYY-MM-DD - short task label
- Task: <what we were trying to do>
- What failed: <clear failure or blocker>
- Root cause: <why it happened>
- Prevention rule: <specific rule to avoid repeat>
- AGENTS.md update candidate: <yes/no> - <one sentence>

## Entries

<!-- Append new entries below this line -->

### 2026-03-28 - pre-loop formatting gate failure
- Task: Seed 30 OpenSpec changes and prepare first apply cycle.
- What failed: `pnpm check` failed on Biome formatting in newly edited files.
- Root cause: Manual patches introduced style drift without running formatter before gate.
- Prevention rule: Run `pnpm check:fix` immediately after multi-file patches and before first strict loop gate.
- AGENTS.md update candidate: no - Existing guidance already covers running checks; this is execution discipline.

### 2026-03-28 - shared-id-registry format gate failure
- Task: Apply shared gameplay ID registry and run strict loop gate.
- What failed: `pnpm check` failed due Biome formatting drift in edited files.
- Root cause: Applied multi-file refactor without formatter pass before gate.
- Prevention rule: After introducing new shared modules/constants, run `pnpm check:fix` before strict `pnpm check`.
- AGENTS.md update candidate: no - Existing check guidance is sufficient; this is execution discipline.

### 2026-03-28 - enemy-strategy gate format failure
- Task: Validate enemy tick strategy routing refactor.
- What failed: `pnpm check` failed due formatter shape for a long union type line.
- Root cause: Manual patch introduced line wrapping that Biome enforces differently.
- Prevention rule: After large TS patches, run `pnpm check:fix` before strict gate.
- AGENTS.md update candidate: no - This is repeated formatting hygiene, not policy gap.
