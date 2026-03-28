# Next Steps

## Summary

Znake now has solid contracts for release gates, packaging, launch surfaces, gameplay fairness, and progression readability. The next cycle should push from "launch-ready foundation" into "high-retention game": stronger long-term run variety, clearer mastery goals, and lower repeat-run fatigue while keeping deterministic simulation and fast iteration.

Target outcome for this cycle:
- improve replayability without sacrificing fairness or readability
- add progression hooks that reward mastery across many runs
- expand content depth through data-driven systems, not scene-level hacks

## High Impact / Low Cost

1. Run-seed challenge presets and daily modifiers.
Add a bounded preset layer (daily/weekly seeds + modifier packs) on top of existing deterministic run setup to create recurring goals without new rendering complexity.

2. Post-run "why you died" insight panel.
Extend death recap with concise failure attribution trends (for example pressure stacking, route greed, late dodge timing) based on existing telemetry fields.

3. Mastery goal tracks in menu.
Add small rotating mastery goals (survive X floors with Y constraint, clear without body break, etc.) using current objective and observability primitives.

4. Upgrade draft readability heatmap.
Surface simple contextual hints on upgrade cards (synergy/conflict badges) using existing upgrade family metadata so choices are faster and less opaque.

5. Lightweight run-history timeline.
Add recent-run summaries in menu (seed, depth, dominant family, death cause) to support deliberate learning loops.

## High Impact / Medium Cost

1. Enemy composition director v1.
Create a data-driven encounter director that controls role composition windows per depth band so runs feel varied but still readable/fair.

2. Event-choice consequence memory.
Allow selected event choices to create bounded delayed consequences 1-3 floors later, improving strategic planning and narrative texture.

3. Route identity packages.
Introduce route-specific reward/pressure identities (safe economy path, high-risk power path, tempo path) with explicit telegraphing before commitment.

4. Upgrade family mini-set expansions.
Add 2-3 new upgrades per family designed around distinct playstyle pivots, including anti-snowball guardrails.

5. Boss phase remix contracts.
Expand boss encounters with deterministic phase variants tied to biome/depth context while preserving counterplay windows.

6. Session continuity polish.
Improve resume continuity cues (what changed while paused, current pressure state, pending objective context) for mobile and desktop return flows.

## Very High Impact / Higher Cost

1. Meta-progression board v2 (branching).
Add a branching, identity-first long-term progression board with meaningful tradeoffs, not just linear stat inflation.

2. Content pack framework for live updates.
Define a stable content pack schema (enemy sets, event pools, mutator bundles, reward sets) so new content ships quickly and safely.

3. Replay and ghost infrastructure.
Add deterministic replay snapshots and optional ghost lanes for personal best comparison and debugging.

4. Social challenge layer.
Introduce async challenge sharing (seed + rule set + score context) with integrity checks and anti-cheat assumptions.

5. Adaptive onboarding rails.
Build a non-intrusive adaptive onboarding layer that detects repeated early failures and offers opt-in tactical hints.

## Medium Impact / Low Cost

1. Accessibility presets expansion.
Add tuned presets for reduced flash, stronger silhouette contrast, and reaction-window assist copy.

2. Audio mix profiles.
Provide selectable audio profiles (focused, balanced, low-fatigue) with consistent loudness targets.

3. Input confidence cues.
Improve touch/keyboard intent confirmation cues for tight moments (subtle directional commit and cooldown readability).

4. Menu information architecture cleanup.
Refine menu grouping so "start run", "build planning", and "history/learning" are clearly separated.

5. Dev balancing cookbook.
Write a concise balancing playbook linking telemetry signals to tuning actions for faster, safer iteration cycles.

## Recommended First Iteration

If we execute one tight depth-and-retention sprint first:

1. Ship deterministic run-seed challenge presets (daily/weekly).
2. Add post-run failure insight panel and recent-run timeline.
3. Implement enemy composition director v1 for early/mid depth bands.
4. Add route identity packages with clear pre-choice telegraphing.
5. Expand one upgrade family with mini-set additions plus guardrails.
6. Validate with check + smoke + focused fairness playtests on fixed seeds.

This creates immediate player-facing replayability while preserving architectural boundaries and deterministic behavior.

## One-Week Prototype Scope

1. Add one daily challenge preset and one weekly challenge preset backed by deterministic seeds.
2. Implement recap insight panel with 3 bounded failure reason buckets.
3. Build enemy composition tables for floors 1-12 with role diversity caps.
4. Add two route identity packages and deterministic payout/pressure hooks.
5. Add 2 new upgrades for a single family, including one risk-reward pick.
6. Run fixed-seed prototype validation and capture telemetry deltas for comparison.

## Suggested Next Step

Run `znake-next-steps-openspec-sync` to map this refreshed backlog against current specs, mark unmatched items, and generate the safest `propose + apply` execution prompts.

## OpenSpec Match Status

Generated: 2026-03-28

### Implemented or Archived

- Prior high-impact content-depth cluster remains archived and reflected in base specs, including encounter/route/event/upgrade/boss depth passes.
- Operational polish set is archived and reflected in base specs:
  - session continuity cues, input confidence cues, menu IA cleanup, accessibility presets expansion, dev balancing cookbook.
- Audio mix profiles are archived in [2026-03-28-znake-audio-mix-profiles-v1](/Users/mrabat/Desktop/znake/openspec/changes/archive/2026-03-28-znake-audio-mix-profiles-v1), reflected in [scenes/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/scenes/spec.md) and [ui-foundation/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/ui-foundation/spec.md).

### Specced in Base Specs

- Core fairness/readability/progression contracts remain well-covered in base specs.

### In Active Change

- None currently (`openspec list --json` reports no active changes).

### Unmatched

- Remaining roadmap items are large strategic initiatives (meta-progression board v2, content pack framework, replay/ghost infrastructure, social challenge layer, adaptive onboarding rails) and are not practical autoloop-sized apply tasks.

### Collapse Note

- No implementable unmatched items remain for this autoloop mode under the current 3-6 task scoped-change policy.
- Next practical step is a fresh brainstorming/prioritization pass to split strategic items into smaller implementable slices.
