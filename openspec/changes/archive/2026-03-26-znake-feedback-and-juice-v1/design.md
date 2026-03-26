## Context

Znake already has three useful ingredients for a safe feedback pass:

- simulation owns gameplay outcomes
- `GameScene` already contains the key runtime event boundaries where damage and pickups resolve
- the project already has lightweight haptic/audio feedback plus scene-local flash/shake state

That means we do not need a large VFX system to improve feel. We need a thin feedback layer that translates meaningful events into short presentation reactions while respecting the project’s architecture: simulation decides what happened, scene orchestration decides when to trigger feedback, and rendering/HUD/audio decide how it is felt.

## Key Points (Codex-style)

### What is changing

- `GameScene` will route key gameplay moments through small reusable feedback helpers instead of scattering ad hoc flash/shake/tone code.
- Pickup, damage, and objective-win moments will gain distinct first-pass emphasis profiles.
- Timings and intensities will move into centralized balance config.

### Why we are doing it

- The player needs instant confirmation for success and danger to preserve readability under pressure.
- Reusable hooks reduce duplication and make future polish faster.
- Central tuning keeps game-feel iteration practical without broad refactors.

### Impacted areas

- Scene-local runtime feedback state, HUD emphasis, shared feedback tones, and balance config.

### Risks / unknowns

- A small effect budget means each cue must do real communication work.
- The best micro-pause duration may need one or two playtest iterations.
- Objective celebration cues must not obscure nearby hazards or reward choices.

## Goals / Non-Goals

**Goals:**

- Make damage, pickups, and objective completion immediately readable.
- Keep feedback lightweight, bounded, and cheap in the hot path.
- Centralize first-pass tuning for timings, flash strength, shake strength, and hit-stop windows.
- Identify scene-local event gaps that should become cleaner contracts later.

**Non-Goals:**

- No full VFX rewrite or heavy particle system.
- No new audio pipeline or asset-heavy sound pass.
- No gameplay rebalance beyond presentation timing/intensity.
- No broad scene architecture rewrite just to support feedback.

## Decisions

1. Use event-style feedback helper methods inside `GameScene`, not one-off inline reactions.

- Add small scene helpers for categories like `triggerDamageFeedback`, `triggerPickupFeedback`, and `triggerObjectiveFeedback`.
- Each helper will compose existing primitives: flash, shake, particles, HUD emphasis, haptic/audio cue, and optional micro-pause.
- Alternative considered: directly editing each event site with more inline flash/shake code.
  - Rejected because it would multiply magic numbers and make later tuning harder.

2. Keep hit-stop local and time-based rather than pausing Phaser globally.

- Add a tiny scene-local timer that temporarily skips advancing core update loops for a few milliseconds on meaningful impact/success moments.
- This keeps the effect deterministic enough for feel while avoiding scene pause/resume complexity.
- Alternative considered: using Phaser scene pause or camera-only effects.
  - Rejected because full pause is too blunt, and camera-only feedback does not create the same readable impact.

3. Reuse existing render channels before adding new ones.

- Prioritize:
  - whole-screen flash tint
  - camera shake
  - existing particles
  - marker/objective pulse scaling or halo
  - HUD/hint emphasis
- Alternative considered: introducing new sprite sheets or particle emitters.
  - Rejected because the requested scope is clarity-first and performance-light.

4. Put feedback profiles in balance config.

- Define compact config buckets for damage, pickups, and objective/reward moments.
- Each bucket can specify flash color/duration, shake duration, hit-stop duration, and particle count multiplier or pulse duration.
- Alternative considered: storing these constants in `GameScene`.
  - Rejected because game-feel iteration would stay too coupled to scene code.

5. Document event-contract gaps instead of over-abstracting in this pass.

- If some moments still require scene-local knowledge, keep implementation pragmatic and note the gap in the change summary.
- Alternative considered: building a full event bus first.
  - Rejected because it expands scope far beyond the requested first-pass juice work.

## Risks / Trade-offs

- [Feedback overload] -> Keep each category visually distinct and cap critical/high-intensity overlap.
- [Micro-pause harms responsiveness] -> Use very small durations, disable stacking, and skip large pauses under reduced-effects mode.
- [Scene-local hooks become sticky] -> Concentrate them in helper methods and explicitly call out missing contracts for later cleanup.
- [Extra per-frame work accumulates] -> Use a tiny amount of transient state, reuse existing graphics paths, and avoid new per-entity allocations.

## Migration Plan

1. Add OpenSpec deltas for gameplay/scenes/input-hud/balance-config.
2. Add centralized feedback tuning config.
3. Implement scene-local feedback helpers and minimal transient state for hit-stop/emphasis.
4. Wire damage, pickup, and objective moments into those helpers.
5. Validate with `openspec validate`, `pnpm check`, and `pnpm build`.

Rollback is straightforward because the change is additive and localized to feedback rules rather than gameplay ownership.

## Open Questions

- Whether floor-objective completion should use the same celebration profile as room-objective reward readiness or a slightly lighter variant.
- Whether pickup HUD emphasis should remain hint-bar based or evolve into a dedicated transient run-status channel later.
