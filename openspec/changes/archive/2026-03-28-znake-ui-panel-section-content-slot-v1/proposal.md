## Why

Allow content class injection in panel primitive.

## Key Points (Codex-style)

- What is changing
  - Allow content class injection in panel primitive.
- Why we are doing it
  - Improve composition reuse.
- Impacted areas
  - PanelSection.ts, overlayController.ts.
- Risks / unknowns
  - ClassName misuse.

## What Changes

- Scope this improvement as a minimal deterministic update.
- Keep simulation behavior unchanged unless explicitly stated.
