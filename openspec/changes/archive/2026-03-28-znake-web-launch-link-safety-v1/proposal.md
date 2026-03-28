## Why

Normalize outbound link attrs through helper.

## Key Points (Codex-style)

- What is changing
  - Normalize outbound link attrs through helper.
- Why we are doing it
  - Reduce web security footguns.
- Impacted areas
  - launch/main.ts.
- Risks / unknowns
  - May alter manual link rendering.

## What Changes

- Scope this improvement as a minimal deterministic update.
- Keep simulation behavior unchanged unless explicitly stated.
