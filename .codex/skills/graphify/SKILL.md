---
name: graphify
description: Run local graph-first query/build workflow (`pnpm graph:query`, `pnpm graph:build`) before broad file reads.
---

# graphify

## Purpose
Keep Graphify usage intrinsic to this repo for Codex workflows.
Use the local wrapper first for architecture/flow/dependency questions.

## Triggers
- Explicit command: `$graphify`
- User asks to build, refresh, or verify the repository knowledge graph
- User asks architecture/flow/dependency/"where is X handled" questions

## Steps
1. Read `AGENTS.md` first.
2. For architecture/flow/dependency questions, run:
   - `pnpm graph:query -- "<question>"`
3. Summarize relevant components/files/relationships from query output.
4. If query fails or Graphify is unavailable, read `graphify-out/GRAPH_REPORT.md` and state fallback usage.
5. For graph refresh requests, run:
   - `pnpm graph:build`
6. Verify `graphify-out/GRAPH_REPORT.md` exists after build.

## Rules
- Do not scan the whole repo blindly when graph outputs exist.
- Prefer `pnpm graph:query` over raw `graphify query` for repo-local workflow consistency.
- Inspect minimal files only after graph summary (target: `<=5`).
- For behavior changes, use OpenSpec as source of truth:
  - `openspec/specs/**`
  - active `openspec/changes/**`
- Keep changes minimal and preserve architecture guardrails.
