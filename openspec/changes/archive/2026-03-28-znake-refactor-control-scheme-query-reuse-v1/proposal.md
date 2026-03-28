## Why

Reuse media query objects.

## Key Points (Codex-style)

- What is changing
  - Reuse media query objects.
- Why we are doing it
  - Reduce duplicated query setup.
- Impacted areas
  - controlScheme.ts.
- Risks / unknowns
  - Listener lifecycle handling.

## What Changes

- Scope this improvement as a minimal deterministic update.
- Keep simulation behavior unchanged unless explicitly stated.
