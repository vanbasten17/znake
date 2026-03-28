## Why

Codify transition call contract.

## Key Points (Codex-style)

- What is changing
  - Codify transition call contract.
- Why we are doing it
  - Reduce inconsistent shell state.
- Impacted areas
  - sceneFlow.ts + scene callers.
- Risks / unknowns
  - Missed transition args.

## What Changes

- Scope this improvement as a minimal deterministic update.
- Keep simulation behavior unchanged unless explicitly stated.
