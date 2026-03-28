## Context

This change introduces a small input domain split with a reusable gesture interpreter and explicit threshold constants.

## Key Points (Codex-style)

- What is changing
  - Create a gesture interpreter helper and shared input threshold constants.
  - Keep `input.ts` as orchestration glue.
- Why we are doing it
  - Clear boundaries make it easier to tune game feel and extend control schemes.
- Impacted areas
  - Input systems and touch behavior.
- Risks / unknowns
  - Gesture ambiguity tuning may need follow-up playtest calibration.

## Decisions

- Keep gesture computation pure and side-effect free.
- Keep DOM event wiring localized in `input.ts`.
- Prefer explicit constants over inlined magic numbers.
