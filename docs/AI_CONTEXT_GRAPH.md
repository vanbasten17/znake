# AI Context Graph (OpenSpec + Graphify)

This repository uses a lightweight "Option A" context model:

- OpenSpec remains the source of truth for intent and behavior changes.
- Graphify provides a fast, queryable map of the codebase so Codex can avoid blind full-repo scanning.

## Why Both

- OpenSpec captures what should change and why (`openspec/specs/**`, active `openspec/changes/**`).
- Graphify captures where things are connected (`graphify-out/GRAPH_REPORT.md`, `graphify-out/graph.json`).
- Together they reduce context-loading cost while preserving behavior traceability.

## Role Split (Source of Truth vs Navigation)

- OpenSpec = functional intent and behavior-change truth.
- Graphify = structure, dependency, and flow navigation.
- AI agents = disciplined consumers of context (not broad repo scanners).

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

## Which Context First

Consult OpenSpec first when:
- changing behavior/rules/flows
- implementing features
- making product-functional decisions

Consult Graphify first when:
- understanding architecture
- tracing a technical flow
- answering "where/how is X handled?"
- finding the minimum set of files to inspect

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

Rebuild is strongly recommended:
- after adding/moving systems
- after adding trace annotations
- before architecture-heavy queries
- before large PRs

Run a query:

```bash
pnpm graph:query -- "input rendering"
pnpm graph:query -- "collision handling"
pnpm graph:query -- "game loop"
```

Technical-understanding protocol:
1. `pnpm graph:query -- "<question>"`
2. summarize graph output
3. inspect only 2-5 files
4. answer

Behavior-change protocol:
1. review OpenSpec (`openspec/specs/**` + active `openspec/changes/**`)
2. run `pnpm graph:query -- "<topic>"`
3. identify minimal touchpoints
4. change minimal code
5. rebuild graph when structure/flow changed

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
  - `@component <name>`
  - optional: `@flow <name>`

Example:

```ts
/**
 * @spec player-movement
 * @component physics
 * @flow input-to-motion
 */
```

Apply annotations only to key files (not the whole repo), especially:
- input
- movement
- collision
- rendering
- HUD
- entrypoints
- key tests

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
