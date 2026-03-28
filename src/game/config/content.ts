import { BALANCE } from '../core/balance'
import type { EnemyKind, FloorObjectiveKind, PowerupType } from '../core/types'
import { ENEMY_KIND, POWERUP_TYPE } from '../shared/gameplayIds'
import type { GameRng } from '../simulation/rng'
import {
  buildWeightedPowerupEntries,
  getSpecialEnemyChances,
  resolvePowerupPoolKind,
} from './contentSelectors'

const ELITE_SPAWN_BY_FLOOR_DESC = [...BALANCE.elite.spawnByFloor].sort(
  (a, b) => b.minFloor - a.minFloor,
)

export const getPowerupPool = (params: {
  floor: number
  isBossFloor: boolean
  objectiveType: FloorObjectiveKind
}): ReadonlyArray<PowerupType> => {
  const poolKind = resolvePowerupPoolKind(params)
  const weighted = buildWeightedPowerupEntries({ floor: params.floor, pool: poolKind })
  return weighted.flatMap((entry) =>
    Array.from({ length: Math.max(0, Math.round(entry.weight)) }, () => entry.value),
  )
}

export const pickPowerupType = (params: {
  floor: number
  isBossFloor: boolean
  objectiveType: FloorObjectiveKind
  forcedType?: PowerupType
  rng: GameRng
}): PowerupType => {
  if (params.forcedType) {
    return params.forcedType
  }
  const poolKind = resolvePowerupPoolKind(params)
  return (
    params.rng.weightedPick(buildWeightedPowerupEntries({ floor: params.floor, pool: poolKind })) ??
    POWERUP_TYPE.SHIELD
  )
}

export const pickEliteKind = (params: {
  floor: number
  rng: GameRng
  forceSpawn?: boolean
}): Extract<EnemyKind, 'stalker' | 'ambusher'> | null => {
  const config =
    ELITE_SPAWN_BY_FLOOR_DESC.find((entry) => params.floor >= entry.minFloor) ??
    ELITE_SPAWN_BY_FLOOR_DESC[0]
  if (!config) {
    return null
  }
  if (!params.forceSpawn && params.rng.nextFloat() >= config.spawnChance) {
    return null
  }
  const weighted = params.rng.weightedPick([
    { value: ENEMY_KIND.STALKER, weight: config.kindWeights.stalker },
    { value: ENEMY_KIND.AMBUSHER, weight: config.kindWeights.ambusher },
  ])
  return weighted
}

export const pickSpecialEnemyKind = (params: {
  floor: number
  rng: GameRng
}): Extract<EnemyKind, 'egg' | 'mirror'> | null => {
  const { eggChance, mirrorChance } = getSpecialEnemyChances({
    floor: params.floor,
    egg: BALANCE.enemyVariants.egg,
    mirror: BALANCE.enemyVariants.mirror,
  })
  const total = eggChance + mirrorChance
  if (total <= 0) {
    return null
  }
  if (params.rng.nextFloat() >= total) {
    return null
  }
  return params.rng.weightedPick([
    { value: ENEMY_KIND.EGG, weight: eggChance },
    { value: ENEMY_KIND.MIRROR, weight: mirrorChance },
  ])
}
