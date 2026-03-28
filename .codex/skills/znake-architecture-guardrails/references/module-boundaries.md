# Module Boundaries

## Allowed Responsibilities
- `src/game/simulation/*`
- Implement deterministic gameplay calculations and pure state transitions.
- Depend on `core/types` and deterministic helpers only.

- `src/game/core/*`
- Define data contracts, balance data, progression rules, and pure helpers.
- Keep tuning and domain definitions centralized.

- `src/game/systems/*`
- Implement adapters for DOM, input, telemetry, lifecycle, i18n, and external/runtime APIs.
- Expose small functions for scenes to call.

- `src/game/scenes/*`
- Orchestrate flow, call simulation/core/systems modules, render via Phaser/DOM.
- Avoid embedding business-rule math that can live in simulation/core.

## Forbidden Patterns
- `simulation/*` importing or using `document`, `window`, `localStorage`, Phaser classes, or console telemetry side effects.
- Scene-local duplicated overlay/card builders across scenes.
- Scene-local duplicated objective preview/copy formatting logic.
- Raw telemetry payload definitions spread across scenes when shared helper can own shape.
- New gameplay/balance constants in scenes when balance/config can own them.

## Extraction Targets
Prioritize extraction of:
- Shared overlay/card builder helpers.
- Objective preview and room-type copy presenter helpers.
- Telemetry event helper functions/types.
- Scene flow reducers/state transition helpers for large scene methods.

## Determinism Guard
For behavior-impacting extraction:
- Preserve seeded RNG usage.
- Keep equivalent outputs for equivalent seed/input streams.
- Prefer simulation-level tests for extracted logic.
