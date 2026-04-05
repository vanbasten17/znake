## Context

The current onboarding path teaches controls but does not consistently explain why a danger is urgent right now. This change formalizes deterministic intent cues to improve fairness and comprehension.

## Key Points (Codex-style)

- What is changing
  - Add first-run intent cues that highlight immediate danger and next best objective action.
- Why we are doing it
  - Improve early-run clarity and reduce avoidable first-session frustration.
- Impacted areas
  - Gameplay readability, onboarding flow, HUD cue timing.
- Risks / unknowns
  - Over-cueing can reduce mastery expression for experienced players.

## Goals / Non-Goals

Goals:
- Teach threat and objective intent without pausing play.
- Keep cue logic deterministic and simulation-driven.
- Keep cue UI optional or attenuated after onboarding.

Non-Goals:
- Rework full tutorial content tree.
- Add reactive voice-over guidance.

## Decisions

### Decision: State-tagged intent cue triggers
- Cue triggers are derived from existing simulation state tags (threat spike, objective urgency).
- Rationale: preserves deterministic behavior and testability.

### Decision: First-run tapering window
- Cues taper after a bounded number of runs.
- Rationale: avoids clutter for returning players.

## Risks / Trade-offs

- Risk: Cue cadence may become noisy in high-density rooms.
- Trade-off: Better first-run clarity with a small HUD complexity cost.
