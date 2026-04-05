## Why

Pause/resume during hectic moments can create state ambiguity, reducing trust in deterministic runs.

## Key Points (Codex-style)

- What is changing
  - Add explicit pause/resume state snapshot contracts for gameplay-critical systems.
- Why we are doing it
  - Ensure fairness and reproducibility when sessions are interrupted.
- Impacted areas
  - Scene lifecycle, simulation tick integrity, overlay coordination.
- Risks / unknowns
  - Snapshot boundaries may miss transient VFX-only state.

## What Changes

- Define which simulation state must snapshot at pause boundary.
- Define restore order for scene and overlay systems.
- Add validation requirements for deterministic resume.

## Capabilities

### Modified Capabilities

- affected spec: scenes

## Impact

- Affected code (expected):
  - src/game/scenes/
  - src/game/scenes/gameScene/
  - src/game/core/
  - tests/
