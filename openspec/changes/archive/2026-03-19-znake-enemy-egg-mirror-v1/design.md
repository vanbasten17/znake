## Context

We already support normal/elite/boss enemies with deterministic tick movement. New archetypes should plug into existing enemy update loops and remain tuneable through balance config.

## Goals / Non-Goals

**Goals:**

- Add two new enemy behaviors with clear readability and low integration risk.
- Keep objective and progression flow unchanged.
- Keep spawn tuning centralized.

**Non-Goals:**

- New projectile systems.
- Complex animation states.
- Boss redesign.

## Decisions

1. Egg is a one-segment enemy with hatch countdown.
- It does not move before hatching.
- On hatch, it converts into a moving normal snake.

2. Mirror uses delayed player-path tracking.
- Scene records recent player head positions.
- Mirror moves toward delayed target each enemy tick.

3. Spawn is probabilistic by floor via balance table.
- If no special archetype is selected, existing elite/normal logic remains.

4. Dev scenario seeds one Egg and one Mirror.
- Allows fast verification of both behaviors in one run.

## Risks / Trade-offs

- [Risk] Mirror pathing may feel too punishing.
  - Mitigation: conservative delay and low spawn chance.
- [Risk] Egg hatch may create sudden difficulty spikes.
  - Mitigation: short but readable hatch countdown and limited spawn chance.
- [Risk] Added complexity in enemy kind handling.
  - Mitigation: isolate kind-specific logic in small helper branches.
