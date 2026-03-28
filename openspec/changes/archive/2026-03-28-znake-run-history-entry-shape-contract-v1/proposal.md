## Why

Document required persisted fields.

## Key Points (Codex-style)

- What is changing
  - Document required persisted fields.
- Why we are doing it
  - Safer migrations.
- Impacted areas
  - runHistory.ts.
- Risks / unknowns
  - Schema evolution friction.

## What Changes

- Scope this improvement as a minimal deterministic update.
- Keep simulation behavior unchanged unless explicitly stated.
