## Context

This change adds a focused improvement contract for znake-voice-input-status-copy-contract-v1.

## Key Points (Codex-style)

- What is changing
  - Clarify copy/state mapping.
- Why we are doing it
  - Reduce UX ambiguity.
- Impacted areas
  - voiceInput.ts.
- Risks / unknowns
  - Localization gaps.

## Decisions

- Keep changes additive and reversible.
- Preserve deterministic simulation boundaries.
- Prefer reusable helpers over one-off patterns.
