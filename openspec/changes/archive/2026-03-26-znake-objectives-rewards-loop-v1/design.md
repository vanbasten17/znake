## Context

The current run loop already contains floor objectives (`portal`, `score`, `kills`, `boss`) and an existing between-floor choice overlay for upgrades. That gives us good scaffolding, but the active objective model is still tied to floor progression rather than a reusable room-level state machine, and the reward moment is tuned around permanent upgrade cards rather than explicit tradeoff picks.

This change needs to improve player clarity without turning `GameScene` into a larger gameplay owner. The cleanest path is to add a data-driven objective/reward state model in core/simulation, then let the scene orchestrate runtime events and HUD/overlay updates.

## Key Points (Codex-style)

### What is changing

- Introduce a dedicated objective/reward loop model with one active objective and one pending reward draft.
- Extend runtime config with objective declarations, terminal counts, and reward definitions.
- Reuse the existing scene/DOM overlay pattern for the reward choice instead of a large UI rewrite.

### Why we are doing it

- The player needs a stronger short-term purpose in each run segment.
- The reward moment should reinforce build identity through tradeoffs, not only additive upgrades.
- Data-driven definitions keep iteration speed high for future balance passes.

### Impacted areas

- Objective simulation helpers, runtime state types, `GameScene` orchestration, HUD text, and centralized balance config.

### Risks / unknowns

- Existing floor objective flow and new room objective flow can overlap awkwardly if responsibilities are not clearly separated.
- Negative reward modifiers need to feel meaningful without making picks feel punitive.
- Terminal activation must remain deterministic and low-friction on both keyboard and touch play.

## Goals / Non-Goals

**Goals:**

- Support one active objective per room/run segment using data-driven declarations.
- Keep objective evaluation in pure helpers and keep `GameScene` responsible for event wiring and transitions.
- Trigger a reward draft reliably on objective completion before moving to the next segment.
- Ship a first reward pool whose options create visible tradeoffs.
- Add minimal HUD and overlay support so the objective and reward choice are understandable at a glance.

**Non-Goals:**

- No full biome/map progression redesign.
- No new meta-progression system.
- No large HUD overhaul or bespoke scene stack for rewards.
- No broad enemy/content expansion beyond minimal support needed to exercise the objective types.

## Decisions

### 1. Add a dedicated objective-reward capability instead of stretching existing floor objective enums

We will introduce explicit data types for:

- objective definition
- objective runtime state
- reward definition
- reward choice draft

These types live in core/config and simulation helpers, not as scene-local booleans and counters.

Why:

- Existing `FloorObjectiveKind` is tuned for current floor-clear rules, not for generic room tasks like terminals or core collection.
- A dedicated model keeps objective authoring data-driven and reduces future branching in `GameScene`.

Alternative considered:

- Reusing the existing floor objective enums and adding more scene-local special cases. Rejected because it would keep objective logic tightly coupled to floor-clear flow and make the scene harder to extend.

### 2. Reuse the current overlay interaction pattern for reward choice

The reward draft will use a lightweight DOM overlay, similar to the current upgrade draft, but fed by reward definitions with upside/downside text and effect application.

Why:

- It keeps scope small and familiar for players.
- It avoids introducing another heavy scene/UI framework just for the first pass.

Alternative considered:

- Rendering reward choice inline in Phaser or fully embedding it in the HUD. Rejected for v1 because it adds more UI implementation cost with little design gain.

### 3. Track objective progress through event-style scene updates into pure reducers

`GameScene` will translate runtime events into objective reducer inputs such as:

- elapsed time tick
- core collected
- elite defeated
- terminal activated

The simulation layer returns updated progress/completion state, and the scene performs side effects such as feedback, pausing progression, and opening the reward draft.

Why:

- Preserves separation between simulation logic and presentation/runtime effects.
- Keeps progress logic deterministic and testable.

Alternative considered:

- Directly mutating counters inside `GameScene`. Rejected because it hides progression rules inside scene flow and makes deterministic testing harder.

### 4. Model reward tradeoffs as run modifiers with paired positive/negative effects

Each reward definition will describe:

- display title and description
- positive modifiers
- negative modifiers
- application hook to `RunConfig` and runtime state where needed

Why:

- The user goal explicitly calls for tradeoffs.
- Centralized reward data allows balancing without scattering constants across scene code.

Alternative considered:

- Using only existing permanent upgrade cards. Rejected because most existing upgrades are additive and do not express the desired tension.

### 5. Keep terminal objectives minimal and deterministic

Terminal objectives will use a small count of spawned interactables placed on safe cells. Activation occurs on player contact rather than an extra interact button.

Why:

- It keeps the loop readable and avoids new control complexity.
- Contact activation is deterministic and works across input modes.

Alternative considered:

- Requiring a separate interaction input. Rejected for v1 because it would add control complexity and extra HUD teaching.

## Risks / Trade-offs

- [Objective overlap with existing floor-clear flow] -> Treat room objectives as the gating condition for reward draft and segment completion, while preserving boss-specific flow as a separate branch.
- [Terminal objectives can feel like disguised fetch quests] -> Keep counts low, placement safe, and status text explicit so the task reads instantly.
- [Reward downsides may be either ignorable or oppressive] -> Store values in balance config and keep the first pool intentionally small for tuning.
- [Runtime modifiers may need both config-time and live-state application] -> Separate reward effect categories so static run-config changes and immediate state changes are explicit.

## Migration Plan

1. Add objective/reward type definitions and config tables.
2. Extend pure objective helpers to initialize, advance, and complete room objectives.
3. Wire `GameScene` to spawn any required room props, forward progress events, and block progression on pending reward choice.
4. Add HUD/overlay copy and reward selection handling.
5. Validate with `openspec validate`, `pnpm check`, and `pnpm build`.

Rollback is straightforward because the change is additive and centered in one new objective/reward flow. Reverting the new config and scene wiring returns the game to current floor objective behavior.

## Open Questions

- Whether “damage” should be expressed as venom potency, enemy hit damage, or a more general offensive scalar in this first pass.
- Whether the reward draft should replace or coexist with the current upgrade draft for the affected run segments.
- Whether terminal visuals should reuse an existing marker tone or add a dedicated one in a follow-up.
