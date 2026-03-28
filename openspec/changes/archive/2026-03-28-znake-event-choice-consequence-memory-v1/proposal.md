## Why

Event choices currently resolve immediately, which weakens longer-horizon planning. Adding bounded delayed consequences (1-3 floors later) creates strategic memory without breaking deterministic flow or fairness guardrails.

## Key Points (Codex-style)

- What is changing
  - Add deterministic delayed consequence definitions for selected event options.
  - Queue consequences in run state with trigger floors.
  - Apply due consequences automatically when the trigger floor starts.
- Why we are doing it
  - Increase strategic planning and run texture across floors.
- Impacted areas
  - Event choice simulation, `GameState` run memory, `GameScene` floor-start flow, telemetry.
- Risks / unknowns
  - Too many delayed penalties could feel unfair if not bounded.
  - Trigger ordering must stay deterministic across equivalent seeds.

## What Changes

- Add centralized consequence-memory config under `BALANCE.eventChoices` with bounded pending-cap and deterministic delay windows.
- Add simulation helpers to draft, partition, and resolve delayed consequences.
- Persist pending consequences in `GameState` and clear them on new run starts.
- Schedule consequences when a qualifying event option is selected and apply due consequences on floor entry.
- Emit schedule/apply telemetry events for consequence memory.

## Capabilities

### New Capabilities

- `event-choice-consequence-memory`: Deterministic delayed event-choice consequences across subsequent floors.

### Modified Capabilities

- `event-choices`: Adds delayed-consequence scheduling hooks tied to option ids.
- `balance-config`: Adds bounded consequence-memory config and delay windows.
- `gameplay`: Applies due consequences at floor start in deterministic order.
- `observability`: Emits delayed consequence schedule/apply telemetry.

## Impact

- Affected code:
  - `src/game/core/balance.ts`
  - `src/game/core/types.ts`
  - `src/game/core/state.ts`
  - `src/game/simulation/eventChoices.ts`
  - `src/game/scenes/GameScene.ts`
  - `src/game/scenes/MenuScene.ts`
  - `src/game/scenes/DeathScene.ts`
  - `tests/event-choices-simulation.test.ts`
- No dependency changes.
