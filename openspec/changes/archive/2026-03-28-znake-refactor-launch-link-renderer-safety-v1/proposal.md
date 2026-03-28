## Why

Escape text used in launch links.

## Key Points (Codex-style)

- What is changing
  - Escape text used in launch links.
- Why we are doing it
  - Avoid accidental HTML injection.
- Impacted areas
  - launch/main.ts.
- Risks / unknowns
  - Escaping may alter text output.

## What Changes

- Scope this improvement as a minimal deterministic update.
- Keep simulation behavior unchanged unless explicitly stated.
