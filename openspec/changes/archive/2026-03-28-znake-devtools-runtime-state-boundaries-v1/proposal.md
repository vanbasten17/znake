## Why

Clarify isolation boundaries.

## Key Points (Codex-style)

- What is changing
  - Clarify isolation boundaries.
- Why we are doing it
  - Prevent accidental gameplay mutation.
- Impacted areas
  - devtools/runtime.ts.
- Risks / unknowns
  - Debug hooks leakage.

## What Changes

- Scope this improvement as a minimal deterministic update.
- Keep simulation behavior unchanged unless explicitly stated.
