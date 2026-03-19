## Context

The project now has data-driven modifier infrastructure (Darkness + Ice). Sand should reuse this pipeline and remain predictable for balance.

## Goals / Non-Goals

**Goals:**

- Add a clear “slow zone” modifier with simple deterministic behavior.
- Keep behavior tuneable from centralized balance config.
- Provide quick smoke testing through dev scenario launcher.

**Non-Goals:**

- Dynamic terrain deformation.
- Per-segment friction simulation.
- New objective types tied to sand in this iteration.

## Decisions

1. Sand cells are non-blocking terrain overlays.
- They do not alter collision; they only adjust movement interval.

2. Slowdown applies while head is on sand.
- Effective move interval becomes `base + sandPenaltyMs` when current head cell is sand.

3. Sand generation mirrors ice strategy.
- Random safe placement with capped attempts and center avoidance.

4. HUD includes Sand in modifier tags.
- Keeps state transparent with no extra in-world text.

## Risks / Trade-offs

- [Risk] Stacked modifiers may overcomplicate readability.
  - Mitigation: keep sand visuals low-noise and distinct from ice.
- [Risk] Too strong slowdown can feel unresponsive.
  - Mitigation: conservative default penalty and centralized tuning knobs.
- [Risk] Dev scenario not representative if tiles are too sparse.
  - Mitigation: seed a short debug lane in front of player in forced sand scenario.
