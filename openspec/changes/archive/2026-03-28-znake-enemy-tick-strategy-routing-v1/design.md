## Context

This change introduces a lightweight strategy-routing layer in enemy ticking, preserving deterministic behavior while reducing complexity.

## Key Points (Codex-style)

- What is changing
  - Use a strategy lookup for special enemy kinds (`egg`, `mirror`, `ambusher`).
  - Normalize fallback construction for idle/no-op outcomes.
- Why we are doing it
  - Improve readability and reduce risk when introducing new enemy variants.
- Impacted areas
  - Enemy simulation tick logic.
- Risks / unknowns
  - Must preserve exact branch precedence for deterministic parity.

## Decisions

- Keep strategy map local to `enemy.ts` for now.
- Preserve previous branch order and fallback semantics.
- Avoid gameplay tuning in this refactor.
