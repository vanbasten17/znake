## Why

Lock selector purity constraints.

## Key Points (Codex-style)

- What is changing
  - Lock selector purity constraints.
- Why we are doing it
  - Protect deterministic draws.
- Impacted areas
  - contentSelectors.ts.
- Risks / unknowns
  - Hidden mutable state.

## What Changes

- Scope this improvement as a minimal deterministic update.
- Keep simulation behavior unchanged unless explicitly stated.
