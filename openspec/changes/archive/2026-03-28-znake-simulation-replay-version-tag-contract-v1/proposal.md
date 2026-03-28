## Why

Codify version tag expectation.

## Key Points (Codex-style)

- What is changing
  - Codify version tag expectation.
- Why we are doing it
  - Supports forward-compatible replay parsing.
- Impacted areas
  - replay.ts + store.
- Risks / unknowns
  - Version bump overhead.

## What Changes

- Scope this improvement as a minimal deterministic update.
- Keep simulation behavior unchanged unless explicitly stated.
