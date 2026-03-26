## Why

Runs now communicate the current room objective more clearly, but route planning is still opaque because the player cannot read what kinds of rooms are coming next. A lightweight run map with explicit room types adds strategic readability and creates a stable contract for future shops, rests, and events without forcing a full progression rewrite first.

## Key Points (Codex-style)

### What is changing

- Add a first-pass run map capability with explicit node types: `combat`, `elite`, `shop`, `rest`, and `event`.
- Define deterministic, data-driven branching so the player can preview upcoming room choices before committing to a route.
- Connect room types to the existing objective/reward flow instead of replacing current progression rules.
- Establish stable room-type contracts for future content while keeping v1 intentionally lightweight.

### Why we are doing it

- Make route planning readable enough that players can form short-term strategy, not just react room by room.
- Give future event/shop/rest content a durable structural foundation before bespoke content multiplies.
- Preserve iteration speed by keeping map generation and room semantics data-driven.

### Impacted areas

- Run-map generation and room-type metadata.
- Gameplay progression rules that decide how each room type resolves and what rewards it feeds into.
- Game scene orchestration for showing map state and entering the selected next room.
- HUD/overlay presentation for upcoming route choices.
- Balance/config ownership for deterministic room-type templates and branch rules.

### Risks / unknowns

- Too much route visibility can reduce tension if the preview horizon is too generous.
- Elite/shop/rest/event semantics can become muddy if v1 tries to imply more content than actually exists yet.
- The map contract must stay deterministic per seed while still feeling varied across runs.

## What Changes

- Add a data-driven run-map model where each node declares a room type, depth, outbound connections, and resolution metadata.
- Define a first-pass room-type roster:
  - `combat`: standard objective/reward segment
  - `elite`: higher-risk combat segment with stronger reward intent
  - `shop`: deterministic economy-oriented stop with its own future-facing contract
  - `rest`: deterministic recovery-oriented stop with its own future-facing contract
  - `event`: deterministic choice-oriented stop with its own future-facing contract
- Define a limited preview rule so the player can see the next branching options and their room types without a full meta-progression or world-map rewrite.
- Define how node selection feeds into current objective/reward flow:
  - combat and elite rooms use the existing room objective loop
  - shop, rest, and event rooms reserve explicit non-combat resolution hooks and rejoin map progression cleanly
- Keep room map templates, node distributions, and branch rules centralized so seeds and tuning remain reproducible.

## Capabilities

### New Capabilities

- `run-map`: Data-driven run-map structure, explicit room-type nodes, deterministic route previews, and stable room-type progression contracts.

### Modified Capabilities

- `gameplay`: Floor progression and room-loop requirements expand so room-type selection cleanly routes into objective/reward flow or future non-combat room resolution.
- `scenes`: Game-scene requirements expand to orchestrate run-map presentation and room entry without absorbing room-logic ownership.
- `input-hud`: HUD requirements expand to present upcoming room choices and current route context in a readable, minimal overlay.
- `balance-config`: Central balance config expands to own room-type distributions, branching templates, and route-preview tuning.

## Impact

- Affected specs:
  - `run-map`
  - `gameplay`
  - `scenes`
  - `input-hud`
  - `balance-config`
- Affected runtime:
  - `src/game/core/types.ts`
  - `src/game/core/balance.ts`
  - `src/game/simulation/objectives.ts`
  - `src/game/simulation` run-progression or map helpers
  - `src/game/scenes/GameScene.ts`
  - `src/game/systems/domHud.ts`
  - route-selection overlay or existing DOM shell helpers
