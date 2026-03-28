## Why

Harden locale normalization path.

## Key Points (Codex-style)

- What is changing
  - Harden locale normalization path.
- Why we are doing it
  - Prevent unsupported locale copy breaks.
- Impacted areas
  - launch/main.ts.
- Risks / unknowns
  - Locale edge cases.

## What Changes

- Scope this improvement as a minimal deterministic update.
- Keep simulation behavior unchanged unless explicitly stated.
