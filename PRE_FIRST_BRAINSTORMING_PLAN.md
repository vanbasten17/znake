# PRE-FIRST BRAINSTORMING PLAN

## Goal

Ship the next highest-impact improvements for ZNAKE with a pragmatic OpenSpec-first loop, keeping stability while increasing gameplay clarity, variety, and tuning confidence.

## Scope (4-point block)

1. Gameplay readability pass (sprites/items clarity)
2. Floor modifiers MVP (`darkness` first)
3. Minimal balancing telemetry
4. Voice controls UX polish

## Delivery Strategy

- Keep each point as a small vertical slice.
- Use one OpenSpec change per point.
- Validate each slice with `openspec validate`, `pnpm check`, `pnpm build`, and targeted manual smoke.
- Archive each slice once stable before moving to the next.

## Point 1: Gameplay Readability (Sprites/Items)

### Why

Immediate player-facing quality gain. Better differentiation reduces cognitive load and unfair-feeling deaths.

### Target Outcomes

- Core entities are instantly distinguishable by shape + color + motion cue:
  - food orb
  - enemy heads/bodies
  - powerups by type
  - hazard/rift/portal elements
- Improve clarity without changing core mechanics.

### OpenSpec Change

`znake-readability-sprites-items-v1`

### Validation Focus

- Fast recognition under movement pressure.
- No regressions in collision/hitbox behavior.

## Point 2: Floor Modifiers MVP (Darkness First)

### Why

Adds run variety with moderate implementation risk and good replay value.

### Target Outcomes

- Add `darkness` modifier on selected floors via config flag.
- Limited visibility radius around snake head.
- Fairness guardrails (readable hazards/objective pathing).

### OpenSpec Change

`znake-floor-modifier-darkness-v1`

### Validation Focus

- Modifier is challenging but readable.
- Works across menu → relic → game → upgrade/death flows.

## Point 3: Minimal Telemetry for Balance

### Why

Needed for confident difficulty tuning instead of subjective guessing.

### Target Outcomes

- Track minimal run/floor metrics:
  - floor start/end timestamps
  - death reason
  - objective type + fail/success
  - score/kills at floor transition
- Keep event schema lightweight and stable.

### OpenSpec Change

`znake-balance-telemetry-min-v1`

### Validation Focus

- Events emitted exactly once per relevant lifecycle step.
- No performance or flow side effects.

## Point 4: Voice Controls UX Polish

### Why

Voice input now works, but perceived responsiveness and confidence cues can improve.

### Target Outcomes

- Improve recognition confidence UX (without changing control philosophy).
- Add clear, subtle in-game feedback for accepted voice command.
- Keep voice optional and fallback-safe.

### OpenSpec Change

`znake-voice-ux-polish-v1`

### Validation Focus

- Reduced confusion when command is accepted/rejected.
- Touch/keyboard always remain unaffected.

## Suggested Execution Order

1. `znake-readability-sprites-items-v1`
2. `znake-floor-modifier-darkness-v1`
3. `znake-balance-telemetry-min-v1`
4. `znake-voice-ux-polish-v1`

## Definition of Done per Step

- OpenSpec artifacts complete (proposal/design/tasks/spec deltas).
- Implementation merged for that slice.
- `openspec validate <change>` passes.
- `pnpm check` passes.
- `pnpm build` passes.
- Manual smoke for affected flows.
- Archive done and base specs synced.

## Notes

- Keep monetization-facing changes out of this block.
- Keep changes mobile-first and readability-first.
- If a step causes instability, pause and run a stabilization apply before proceeding.
