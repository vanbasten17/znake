## Context

Znake already keeps enemy movement and spawn picking in pure simulation helpers, while `GameScene` orchestrates runtime side effects. That architecture is a good fit for fairness work because the dangerous moments are concentrated in a few places:

- enemy intent resolution in `src/game/simulation/enemy.ts`
- candidate cell selection in `src/game/simulation/spawn.ts`
- collision, room start, and damage handling in `src/game/scenes/GameScene.ts`

The design goal is to improve readability and reaction time without turning fairness into broad invulnerability or introducing frame-heavy continuous checks.

## Key Points (Codex-style)

- **What is changing**
  - Enemy intent gains explicit pre-impact telegraph state.
  - Spawn selection gains fairness filters for distance and escape-space.
  - Player recovery gains brief, targeted grace timers.
- **Why we are doing it**
  - Fairness should come from legible intent and valid reaction windows, not from hidden mercy systems.
- **Impacted areas**
  - Simulation state shape, spawn helper APIs, balance knobs, scene collision gating, and enemy rendering cues.
- **Risks / unknowns**
  - We need enough telegraph clarity to matter, but not so much that aggressive enemies lose identity.
  - Spawn fairness must degrade gracefully when the board is crowded.

## Goals / Non-Goals

**Goals:**

- Make burst enemy danger readable before impact.
- Prevent obviously unfair enemy seed positions through deterministic pre-checks.
- Give the player a short recovery window on room entry and after nonlethal damage.
- Keep fairness values centralized and easily tunable.

**Non-Goals:**

- New enemy families or a full combat rebalance.
- Broad visual polish beyond lightweight readability cues.
- Expensive pathfinding or per-frame flood-fill checks across all enemies.

## Decisions

1. Represent telegraphs as lightweight enemy state, not ad hoc scene timers.
- Add per-enemy telegraph metadata in the simulation type so dangerous actions can announce themselves before execution.
- Initial scope will focus on ambusher dash readiness and egg hatch countdown readability because those create the sharpest “surprise hit” moments in the current kit.
- Alternative considered: scene-only warning overlays.
  - Rejected because intent belongs with simulation state and would be harder to keep deterministic.

2. Keep spawn fairness as candidate filtering inside `pickOpenCell` helpers.
- Extend spawn helpers with reusable fairness options such as minimum Manhattan distance from the player head, exclusion from the player’s immediate forward lane, and a minimum local escape-neighbor count.
- This preserves the existing data flow: scene assembles occupancy and fairness context, simulation returns a legal candidate.
- Alternative considered: spawn first, then repair unfair positions in scene code.
  - Rejected because it creates scattered edge handling and makes tests weaker.

3. Use short contact-grace timers instead of broad invulnerability.
- Add a room-entry grace timer and a post-hit grace timer that only suppress enemy/rift contact damage for a brief period.
- Movement, pressure, and board state still continue normally, so the player gets agency rather than a full pause.
- Alternative considered: freeze enemies on room entry.
  - Rejected because it changes pacing more dramatically and risks undermining encounter identity.

4. Surface telegraphs with existing rendering primitives.
- Read enemy telegraph state during rendering and add lightweight rings/glow pulses or directional lane indicators using existing Phaser graphics.
- This keeps the change localized and avoids new rendering assets.

## Risks / Trade-offs

- [Risk] Grace windows may overcorrect and make consecutive mistakes too safe.
  - Mitigation: keep values short, centralized, and apply only to damage intake rather than all threat systems.

- [Risk] Dense room layouts may fail stricter fairness filters and reduce spawn variety.
  - Mitigation: filter candidates first, then fall back deterministically to relaxed open-cell picking if no fair cell exists.

- [Risk] Telegraph state could drift if it is updated separately from movement resolution.
  - Mitigation: compute and advance telegraph state in the same pure enemy simulation helpers that own dash/hatch behavior.
