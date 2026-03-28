## Why

Guard re-registration in setup.

## Key Points (Codex-style)

- What is changing
  - Guard re-registration in setup.
- Why we are doing it
  - Avoid redundant listeners.
- Impacted areas
  - accessibility.ts.
- Risks / unknowns
  - Legacy browser listener branch.

## What Changes

- Scope this improvement as a minimal deterministic update.
- Keep simulation behavior unchanged unless explicitly stated.
