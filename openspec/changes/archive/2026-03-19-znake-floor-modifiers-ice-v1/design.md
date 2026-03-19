## Context

The game now supports modifier cadence through centralized floor setup (Darkness). Ice should follow the same model to keep behavior data-driven and easy to tune.

## Goals / Non-Goals

**Goals:**

- Add an Ice modifier with predictable movement impact.
- Keep implementation local to floor setup + GameScene runtime.
- Preserve existing objective/combat/transition behavior.

**Non-Goals:**

- New biome art pipeline or authored tilesets.
- Friction/physics simulation.
- Input remapping changes for Ice.

## Decisions

1. Ice is represented as non-blocking floor cells.
- These cells only alter movement behavior and do not affect collision checks directly.

2. Sliding is deterministic and bounded.
- Landing on Ice triggers a fixed number of immediate extra forward steps (`slideSteps`), capped by balance.

3. Ice generation uses safe random placement per floor.
- Tiles avoid walls and central spawn-safe zone to reduce unfair starts.

4. HUD modifier status lists Ice when active.
- Keeps player informed without adding in-world textual clutter.

## Risks / Trade-offs

- [Risk] Extra steps can feel punishing at high speed.
  - Mitigation: start with conservative default (`slideSteps=1`) and tune in balance config.
- [Risk] Procedural placement could create awkward clusters.
  - Mitigation: use capped random attempts and minimum spacing fallback.
- [Risk] Modifier stacking with Darkness may reduce readability.
  - Mitigation: keep Ice visuals high-contrast and lightweight.
