## Why

Tail-as-health improved survivability, but body length is still mostly passive. A first-pass body economy makes length a readable decision resource, so runs feel more about space control, risk, and intentional recovery.

## Key Points (Codex-style)

- **What is changing**
  - Introduce two controlled body-spend sinks in-run: one simulation-driven active sink for immediate space pressure, and one reward-flow sink that trades body for a stronger reward draft.
- **Why we are doing it**
  - Strengthen Znake identity around movement-space decisions where body length is both survivability and spendable tempo.
- **Impacted areas**
  - Gameplay simulation rules, deterministic run config, balance tuning data, and HUD/input readability.
- **Risks / unknowns**
  - Over-spending could create sharp fail states, and under-tuned costs could trivialize tradeoffs; both need tight min-length guards and balance iteration.

## What Changes

- Add a first-pass deterministic body spending system with explicit minimum-length safeguards.
- Define two controlled sinks:
  - `body_pulse`: player-triggered spend that creates short-range space relief.
  - `reward_overclock`: reward-selection spend that rerolls drafted reward options once per objective completion.
- Keep spend logic in simulation/domain helpers; scene/HUD only present eligibility, intent, and feedback.
- Define coexistence rules with tail-as-health:
  - enemy damage and body spending both remove segments from the same pool.
  - spending cannot drop length below a configured survivability floor.
- Keep all costs/cooldowns/limits in centralized balance config.

## Capabilities

### New Capabilities

- `body-economy`: Deterministic body-segment spending model for controlled in-run sinks.

### Modified Capabilities

- `gameplay`: adds spend resolution rules, floor guards, and reward-flow integration.
- `balance-config`: adds tunable costs, cooldowns, and gating values for body spending.
- `game-core`: extends run config/domain state for body economy policies and deterministic sink state.
- `input-hud`: surfaces spend affordances, blocked reasons, and reward-overclock interaction.

## Impact

- Affected specs:
  - `openspec/specs/gameplay/spec.md`
  - `openspec/specs/balance-config/spec.md`
  - `openspec/specs/game-core/spec.md`
  - `openspec/specs/input-hud/spec.md`
  - new capability spec: `openspec/specs/body-economy/spec.md`
- Affected runtime areas (expected):
  - simulation helpers for body spend validation/resolution
  - run-config defaults and balance data tables
  - reward draft flow and HUD prompt states
