## Why

Runs currently have pressure and progression, but the short-term ask in each room is still too implicit. Players need a clearer objective at a glance and a reward moment that turns success into an interesting tradeoff instead of a generic power bump.

## Key Points (Codex-style)

### What is changing

- Add a room-level objective loop with one active objective at a time.
- Add objective completion tracking and a post-objective reward draft.
- Introduce first-pass reward options with explicit upside/downside tradeoffs.
- Surface the current objective and reward choice through minimal HUD/overlay hooks.

### Why we are doing it

- Give each room a clearer moment-to-moment purpose.
- Make successful play feel directed and rewarding.
- Strengthen run identity through meaningful tradeoff picks instead of only flat upgrades.

### Impacted areas

- Gameplay objective flow and floor progression orchestration.
- DOM HUD status text and reward overlay presentation.
- Centralized balance/config data for objective declarations and reward pools.

### Risks / unknowns

- New objective types must stay readable and reliably completable in existing rooms.
- Tradeoff rewards can accidentally create dominant picks if downsides are too soft.
- A terminal-style objective needs a minimal interaction model without growing into a broader room puzzle system.

## What Changes

- Add data-driven room objective definitions for a first-pass set of short-term goals:
  - survive for a configured duration
  - collect a configured number of cores
  - defeat a configured number of elites
  - activate a configured number of terminals
- Add objective state models and lifecycle helpers for start, progress, completion, and reward gating.
- Add a reward draft flow that triggers immediately after objective completion and offers three tradeoff rewards.
- Add a first reward pool with tradeoffs such as:
  - more health with slower movement
  - more damage with higher speed pressure
  - more body length with worse turning responsiveness
- Add minimal HUD support for active objective text/progress and a lightweight reward-choice overlay.
- Keep objective/reward tuning in centralized config so room declarations and reward values remain easy to iterate.

## Capabilities

### New Capabilities

- `objective-reward-loop`: Data-driven room objectives, completion tracking, and reward-choice flow for run segments.

### Modified Capabilities

- `gameplay`: Floor progression requirements expand to support room objective variants and reward gating before the next segment starts.
- `input-hud`: HUD requirements expand to display the active objective and present a minimal reward-choice prompt.
- `balance-config`: Central balance config expands to own objective declarations, progress targets, and reward-pool tuning.

## Impact

- Affected specs:
  - `gameplay`
  - `input-hud`
  - `balance-config`
  - `objective-reward-loop`
- Affected runtime:
  - `src/game/core/types.ts`
  - `src/game/core/balance.ts`
  - `src/game/simulation/objectives.ts`
  - `src/game/scenes/GameScene.ts`
  - `src/game/systems/domHud.ts`
  - reward overlay scene or existing upgrade-flow overlay integration
