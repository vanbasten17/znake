# AI Context Graph (OpenSpec + Graphify)

This repository uses a lightweight "Option A" context model:

- OpenSpec remains the source of truth for intent and behavior changes.
- Graphify provides a fast, queryable map of the codebase so Codex can avoid blind full-repo scanning.

## Why Both

- OpenSpec captures what should change and why (`openspec/specs/**`, active `openspec/changes/**`).
- Graphify captures where things are connected (`graphify-out/GRAPH_REPORT.md`, `graphify-out/graph.json`).
- Together they reduce context-loading cost while preserving behavior traceability.

## Local Query Wrapper

This repo includes a local wrapper at `tools/graph-query.sh`.

What it does:
- Accepts a free-form question string.
- Runs `graphify query "<question>"`.
- Prints query output directly.
- If Graphify is missing or query execution fails, it tells you to consult `graphify-out/GRAPH_REPORT.md`.

## Expected Workflow

1. Read `AGENTS.md` first.
2. If behavior is involved, read current OpenSpec context in:
   - `openspec/specs/**`
   - active `openspec/changes/**`
3. Run `pnpm graph:query -- "<question>"`.
4. Summarize graph query results (components, files, relationships).
5. If query fails, read `graphify-out/GRAPH_REPORT.md`.
6. Open only the smallest relevant set of files before editing (ideally ≤5).

## Install Graphify (Manual)

```bash
pip install graphifyy && graphify install
```

or

```bash
pipx install graphifyy && graphify install
```

## Build / Refresh the Graph

From repo root:

```bash
pnpm graph:build
pnpm graphify:report
```

Run a query:

```bash
pnpm graph:query -- "input rendering"
pnpm graph:query -- "collision handling"
pnpm graph:query -- "game loop"
```

Optional cleanup:

```bash
pnpm graphify:clean
```

## Intentionally Included in Graph Context

These are intentionally not excluded from graph extraction:

- `openspec/`
- `docs/`
- `src/`
- `tests/`
- `AGENTS.md`

## Lightweight Traceability Conventions (Docs-Only)

For future changes, keep traceability lightweight and stable:

- Use stable OpenSpec change IDs for new change folders.
- When relevant, touched code/tests may include:
  - `@spec <change-id>`
  - `@capability <name>`

This is documentation guidance only; it does not change runtime behavior.

## Quick Shell Snippet

```bash
# 1) install (pick one)
pip install graphifyy && graphify install
# or: pipx install graphifyy && graphify install

# 2) build graph
pnpm graph:build

# 3) query graph first before opening source files
pnpm graph:query -- "input rendering"

# 4) fallback report when query fails/unavailable
pnpm graphify:report
```
