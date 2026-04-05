## Why

Overlay transitions can race scene updates, causing temporary control ambiguity and UX inconsistency.

## Key Points (Codex-style)

- What is changing
  - Define explicit overlay lifecycle state contracts with ownership handoff rules.
- Why we are doing it
  - Improve UI consistency, control clarity, and scene orchestration safety.
- Impacted areas
  - Scene overlays, input ownership, UI state transitions.
- Risks / unknowns
  - Added lifecycle states can increase orchestration complexity.

## What Changes

- Define canonical overlay lifecycle states and transitions.
- Define input/control ownership at each overlay state.
- Add deterministic transition validation requirements.

## Capabilities

### Modified Capabilities

- affected spec: scenes

## Impact

- Affected code (expected):
  - src/game/scenes/gameScene/overlayController.ts
  - src/game/systems/uiViewModelPresenter.ts
  - src/game/systems/menuNavigation.ts
  - tests/
