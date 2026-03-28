## Context

Current menu surfaces all goals, but the player has no single prioritized "next mastery" cue. A compact focus row can increase clarity without new progression systems by reusing existing goal progress and status strings.

## Key Points (Codex-style)

- What is changing
  - Add one deterministic rotating mastery-focus row.
- Why we are doing it
  - Reduce decision friction and increase progression clarity.
- Impacted areas
  - Menu UI composition and refresh logic.
- Risks / unknowns
  - Rotation may feel arbitrary without future explanatory affordances.

## Goals / Non-Goals

**Goals:**
- Show one concise focus goal row in menu.
- Keep selection deterministic and low-maintenance.

**Non-Goals:**
- New goal types.
- Dynamic difficulty adaptation from focus selection.

## Decisions

### Decision: Rotate focus by UTC day over existing goals
- Reuse existing goal list and map day index to one focus goal.
- Rationale: deterministic and simple with no additional persistence.

### Decision: Reuse existing goal status copy
- Reuse claimed/ready/progress wording from existing goal UI.
- Rationale: consistency and lower localization risk.

## Risks / Trade-offs

- [Risk] Daily rotation may hide an unfinished preferred goal. -> Mitigation: keep full goals list visible below focus row.
- [Risk] Focus text can be visually noisy. -> Mitigation: compact typographic treatment and single-line emphasis.

## Migration Plan

1. Add mastery-focus UI element in menu overlay.
2. Compute deterministic daily focus from existing goals.
3. Reuse existing status formatting for focus line.
4. Validate with check/smoke/spec validation/build.

Rollback strategy:
- Remove focus row and helper; goals list remains unchanged.

## Open Questions

- Should future iteration allow pinning one focus goal instead of strict rotation?
