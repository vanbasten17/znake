---
name: graphify
description: Build or refresh the local Graphify knowledge graph and use GRAPH_REPORT first to keep repo context reads minimal.
---

# graphify

## Purpose
Keep Graphify usage intrinsic to this repo for Codex workflows.
Use `graphify-out/GRAPH_REPORT.md` as the first context map before broad file reads.

## Triggers
- Explicit command: `$graphify`
- User asks to build, refresh, or verify the repository knowledge graph
- User asks for graph-first context flow before edits

## Steps
1. Read `AGENTS.md` first.
2. Try `graphify .` from repo root.
3. If CLI returns `unknown command '.'`, run `graphify update .`.
4. Verify outputs:
   - `graphify-out/` exists
   - `graphify-out/GRAPH_REPORT.md` exists
5. Print a short summary from the first lines of `graphify-out/GRAPH_REPORT.md`.

## Rules
- Do not scan the whole repo blindly when `graphify-out/GRAPH_REPORT.md` exists.
- For behavior changes, use OpenSpec as source of truth:
  - `openspec/specs/**`
  - active `openspec/changes/**`
- Keep changes minimal and preserve architecture guardrails.
