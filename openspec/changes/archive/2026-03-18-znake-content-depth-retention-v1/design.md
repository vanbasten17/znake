## Context

Current enemy variance is `normal/stalker/boss` and item variance is mostly powerups + biome core. This gives solid foundations but limited mid-run novelty.

## Goals / Non-Goals

**Goals:**
- Introduce one additional elite pattern with a clear, learnable identity.
- Introduce one additional item interaction that changes run pressure, not just score.
- Keep all new spawn/event knobs in centralized balance config.
- Keep implementation low risk and incremental.

**Non-Goals:**
- Full procedural encounter director.
- Multiple new elite families in one pass.
- New UI screens for codex/logbook.

## Decisions

- New elite: `ambusher`
  - Spawns from floor threshold and chance table.
  - Uses short burst/dash intent when aligned with player lanes.
  - Reward tier between stalker and boss.
- New item: `rift_battery`
  - Spawns from dedicated chance table on eligible floors.
  - On pickup, pauses/softens rift pressure for a short duration.
- Add balance tables:
  - `elite.spawnByFloor` / `elite.kindWeights`
  - `item.spawnByFloor` / `item.effectDurations`
- Add telemetry events:
  - `elite_spawned`, `elite_defeated`, `item_collected`, `rift_suppressed`.

## Risks / Trade-offs

- [Risk] Ambusher feels unfair if dash windows are too tight. -> Mitigation: conservative dash cadence and clear telegraph.
- [Risk] Rift battery trivializes hazard loop. -> Mitigation: capped duration and limited spawn chance.
- [Risk] Variety adds complexity to tuning. -> Mitigation: all tuning exposed in balance config + event telemetry.
