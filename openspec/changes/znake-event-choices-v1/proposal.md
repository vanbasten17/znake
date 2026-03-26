## Why

Route choices are becoming visible through run-map work, but players still lack short, high-clarity decisions that trade safety for upside outside standard combat rewards. A lightweight deterministic event-choice layer adds meaningful risk/reward decisions now without requiring a large narrative pool or a full map redesign.

## Key Points (Codex-style)

### What is changing

- Add a first-pass event-choice framework for concise, two-to-three option decisions such as risky trades, curse offers, and safe-vs-dangerous route outcomes.
- Define event outcomes as data-driven deterministic effects resolved from seed + run state, not ad hoc scene logic.
- Add fairness constraints so event options communicate risk clearly and avoid no-win traps.
- Integrate event choices with existing objective/reward identity instead of replacing upgrade flow.

### Why we are doing it

- Make route decisions feel strategically meaningful beyond combat-room completion.
- Preserve deterministic simulation and iteration speed by keeping options and outcomes centralized in config.
- Reinforce build identity by ensuring event outcomes connect to existing reward families and tradeoff language.

### Impacted areas

- Gameplay progression contracts for entering and resolving event-choice decisions.
- Objective/reward loop contracts for how event resolutions differ from standard reward drafts and how they rejoin progression.
- Scene orchestration and DOM overlays for presenting concise event options and player-facing risk copy.
- Balance/config ownership for deterministic event-choice definitions and fairness limits.

### Risks / unknowns

- Event options can feel punitive if downside communication is weak or probability expectations are unclear.
- Too-frequent high-risk events can crowd out upgrade identity and flatten pacing.
- If event outcomes are too deterministic without enough variety, choices may feel solved after few runs.

## What Changes

- Define first-pass event-choice definitions with explicit fields for trigger context, option text, upside, downside, and deterministic outcome payloads.
- Add a deterministic event-choice draft contract that selects options from centralized data using run seed and progression state.
- Define resolution rules for first-pass event patterns:
  - risky trade (pay resource now for immediate gain)
  - curse offer (accept persistent downside for stronger upside)
  - safe-vs-dangerous route decision (modifies near-term node risk/reward intent without redesigning map generation)
- Define fairness and readability constraints:
  - every option exposes explicit risk and explicit reward in player-facing copy
  - no option can apply hidden, unannounced penalties
  - event outcomes must preserve recoverability expectations for non-boss flow
- Define how event-choice completion returns to normal progression and keeps objective/reward identity signals coherent.

## Capabilities

### New Capabilities

- `event-choices`: Deterministic, data-driven short event decisions with explicit risk/reward tradeoffs and fairness constraints.

### Modified Capabilities

- `gameplay`: Add progression requirements for entering, resolving, and exiting event-choice decisions in non-boss run flow.
- `objective-reward-loop`: Extend reward-loop contracts to coexist with deterministic event-choice resolutions while preserving identity-forward tradeoffs.
- `scenes`: Add scene/overlay requirements for clear event-choice presentation, option confirmation, and deterministic resolution feedback.

## Impact

- Affected specs:
  - `event-choices` (new)
  - `gameplay`
  - `objective-reward-loop`
  - `scenes`
- Affected runtime areas (expected in apply phase):
  - shared run progression and choice state types
  - balance/config modules for event definitions and deterministic draft rules
  - simulation helpers for drafting and resolving event outcomes
  - `GameScene` orchestration + DOM overlay components for event-choice UI
