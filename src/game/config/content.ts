import { BALANCE } from '../core/balance'
import type { EnemyKind, FloorObjectiveKind, PowerupType } from '../core/types'
import type { GameRng } from '../simulation/rng'

const POWERUP_POOLS: Record<'standard' | 'kills' | 'boss', ReadonlyArray<PowerupType>> = {
  standard: ['shield', 'slow', 'ghost', 'score'],
  kills: ['venom', 'venom', 'venom', 'shield', 'slow', 'ghost', 'score'],
  boss: ['venom', 'venom', 'shield', 'shield', 'slow', 'ghost', 'score'],
}

export const getPowerupPool = (params: {
  isBossFloor: boolean
  objectiveType: FloorObjectiveKind
}): ReadonlyArray<PowerupType> => {
  if (params.isBossFloor) {
    return POWERUP_POOLS.boss
  }
  if (params.objectiveType === 'kills') {
    return POWERUP_POOLS.kills
  }
  return POWERUP_POOLS.standard
}

export const pickPowerupType = (params: {
  isBossFloor: boolean
  objectiveType: FloorObjectiveKind
  forcedType?: PowerupType
  rng: GameRng
}): PowerupType => {
  if (params.forcedType) {
    return params.forcedType
  }
  const pool = getPowerupPool(params)
  return params.rng.pick(pool) ?? 'shield'
}

export const pickEliteKind = (params: {
  floor: number
  rng: GameRng
}): Extract<EnemyKind, 'stalker' | 'ambusher'> | null => {
  const sorted = [...BALANCE.elite.spawnByFloor].sort((a, b) => b.minFloor - a.minFloor)
  const config = sorted.find((entry) => params.floor >= entry.minFloor) ?? sorted[0]
  if (!config) {
    return null
  }
  if (params.rng.nextFloat() >= config.spawnChance) {
    return null
  }
  const weighted = params.rng.weightedPick([
    { value: 'stalker' as const, weight: config.kindWeights.stalker },
    { value: 'ambusher' as const, weight: config.kindWeights.ambusher },
  ])
  return weighted
}

export const pickSpecialEnemyKind = (params: {
  floor: number
  rng: GameRng
}): Extract<EnemyKind, 'egg' | 'mirror'> | null => {
  const eggChance =
    params.floor >= BALANCE.enemyVariants.egg.minFloor ? BALANCE.enemyVariants.egg.spawnChance : 0
  const mirrorChance =
    params.floor >= BALANCE.enemyVariants.mirror.minFloor
      ? BALANCE.enemyVariants.mirror.spawnChance
      : 0
  const total = eggChance + mirrorChance
  if (total <= 0) {
    return null
  }
  if (params.rng.nextFloat() >= total) {
    return null
  }
  return params.rng.weightedPick([
    { value: 'egg' as const, weight: eggChance },
    { value: 'mirror' as const, weight: mirrorChance },
  ])
}
