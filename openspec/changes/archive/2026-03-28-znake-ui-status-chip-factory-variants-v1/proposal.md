## Why

Add optional tone variant class mapping.

## Key Points (Codex-style)

- What is changing
  - Add optional tone variant class mapping.
- Why we are doing it
  - Reduce repetitive class joins.
- Impacted areas
  - StatusChip.ts, overlayController.ts.
- Risks / unknowns
  - Variant naming drift.

## What Changes

- Scope this improvement as a minimal deterministic update.
- Keep simulation behavior unchanged unless explicitly stated.
