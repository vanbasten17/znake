## Why

Use CSS token fallback for min target sizing.

## Key Points (Codex-style)

- What is changing
  - Use CSS token fallback for min target sizing.
- Why we are doing it
  - Consistency across overlays.
- Impacted areas
  - ActionButton.ts, tokens.css.
- Risks / unknowns
  - Token fallback mismatch.

## What Changes

- Scope this improvement as a minimal deterministic update.
- Keep simulation behavior unchanged unless explicitly stated.
