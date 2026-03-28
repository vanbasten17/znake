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
