## Context

The current objective/reward loop is functional and deterministic, but the transition from in-room objective tracking to reward decision can become visually crowded:

- Objective HUD text may compete with secondary cues (elite, pacing, terrain) during completion windows.
- Reward cards surface tradeoffs but rely on color-only separation for upside/downside scanning.
- Telemetry captures clean-play resolution but lacks a first-class event pair for objective completion and reward pick moments.

This design keeps simulation behavior intact and targets clarity/readability through HUD priority, overlay framing, and bounded event additions.

## Key Points (Codex-style)

- **What is changing**
  - Reward-pending state gains explicit message priority in objective HUD/run hint behavior.
  - Reward overlay copy and card structure become easier to scan with explicit framing and labels.
  - Telemetry emits stable `objective_completed` and `reward_picked` events tied to visible loop moments.
- **Why we are doing it**
  - Preserve challenge while making player intent and decisions legible under pressure.
  - Increase fairness perception by clarifying consequences before pick confirmation.
  - Improve analysis fidelity for objective loop tuning.
- **Impacted areas**
  - `GameScene` HUD refresh and reward draft/pick hooks.
  - i18n strings for reward framing labels.
  - Reward overlay CSS for contrast/readability.
  - Telemetry payload composition for objective/reward loop events.
- **Risks / unknowns**
  - Priority changes might hide useful advanced cues in edge pacing states.
  - Extra telemetry must remain stable and low-noise.
  - Card contrast improvements must avoid over-bright visual fatigue.

## Goals / Non-Goals

**Goals:**

- Increase objective-complete and reward-ready readability in active gameplay.
- Make reward cards faster to parse (benefit/cost distinction and decision framing).
- Align event instrumentation with objective completion and reward pick milestones.
- Keep deterministic behavior and existing objective/reward mechanics unchanged.

**Non-Goals:**

- Introducing new objective archetypes.
- Redesigning full HUD shell layout or scene chrome.
- Rebalancing reward economy or adding many new rewards.

## Decisions

1. Prioritize objective message during reward-pending windows.
- Decision: when reward is pending, objective HUD favors objective-complete context and suppresses secondary cue concatenation.
- Why: objective clarity should win over advanced tactical cues during discrete decision windows.
- Alternative considered: keep all cues and only pulse color longer. Rejected because clutter remains and can obscure the primary call-to-action.

2. Add explicit reward framing and labels instead of structural redesign.
- Decision: add concise framing subtitle plus per-card upside/downside labels and contrast tuning in existing overlay.
- Why: low-risk readability improvement with minimal layout churn.
- Alternative considered: multi-column compare table or expanded modal. Rejected as out of scope and too heavy for mobile-first footprint.

3. Emit objective/reward loop milestone telemetry at scene-level hooks.
- Decision: emit `objective_completed` when reward drafting begins, and `reward_picked` when a reward selection is confirmed.
- Why: these hooks map directly to player-visible moments and remain deterministic.
- Alternative considered: infer from existing `objective_clean_play_resolved` and downstream state. Rejected due to ambiguity and harder analytics joins.

## Risks / Trade-offs

- [Secondary cues become less visible during reward-ready] -> Keep suppression scoped to reward-pending/objective-complete windows only.
- [Telemetry cardinality grows] -> Emit bounded fields only (objective kind, reward id/index, floor, score, clean-play flags).
- [Visual contrast shifts look too loud] -> Use incremental token-aligned CSS adjustments rather than hard palette swaps.
