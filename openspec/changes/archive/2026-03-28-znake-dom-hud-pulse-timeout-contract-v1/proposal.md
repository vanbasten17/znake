## Why

Document timer clearing contract.

## Key Points (Codex-style)

- What is changing
  - Document timer clearing contract.
- Why we are doing it
  - Avoid stale pulse state.
- Impacted areas
  - domHud.ts.
- Risks / unknowns
  - Timeout race edge cases.

## What Changes

- Scope this improvement as a minimal deterministic update.
- Keep simulation behavior unchanged unless explicitly stated.
