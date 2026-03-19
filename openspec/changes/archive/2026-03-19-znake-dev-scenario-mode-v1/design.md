## Context

We already have a stable scene flow and DOM-based menu overlay. We need a fast, low-risk way to launch reproducible gameplay states without polluting production UX.

## Goals / Non-Goals

**Goals:**

- Provide one-tap scenario launch for smoke tests in dev sessions.
- Keep standard player flow untouched by default.
- Reuse existing scene transition and virtual input safety behavior.

**Non-Goals:**

- Full QA tooling, scriptable replay system, or deterministic RNG harness.
- Shipping this launcher as a visible production feature.
- Rebalancing scenarios for gameplay progression.

## Decisions

1. Gate developer launcher behind query param `?dev=1`.
- Prevents accidental exposure in normal play while keeping activation trivial.

2. Represent scenarios as typed presets in a small core module.
- Keeps scenario definitions centralized and maintainable.

3. Start scenarios directly in `GameScene` with optional overrides.
- Avoids relic draft/menu friction for smoke tests.

4. Keep run bootstrap reset consistent with normal `startRun`.
- Prevents stale progression/input state from contaminating scenario tests.

## Risks / Trade-offs

- [Risk] Dev mode might be mistaken for a user-facing feature.
  - Mitigation: hard gate via query param only, no default visibility.
- [Risk] Scenario overrides may diverge from standard progression over time.
  - Mitigation: keep presets minimal and focused on regression-critical cases.
- [Risk] Direct start could bypass some menu/relic bugs.
  - Mitigation: preserve normal start path and test both paths when needed.
