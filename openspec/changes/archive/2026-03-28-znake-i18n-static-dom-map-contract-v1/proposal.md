## Why

Document adapter mapping contract.

## Key Points (Codex-style)

- What is changing
  - Document adapter mapping contract.
- Why we are doing it
  - Avoid silent copy gaps.
- Impacted areas
  - i18nDomAdapter.ts.
- Risks / unknowns
  - Forgotten IDs.

## What Changes

- Scope this improvement as a minimal deterministic update.
- Keep simulation behavior unchanged unless explicitly stated.
