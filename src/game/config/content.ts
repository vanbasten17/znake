import { BALANCE, getPowerupWeightProfileForFloor } from '../core/balance'
import type { EnemyKind, FloorObjectiveKind, PowerupType } from '../core/types'
import type { GameRng } from '../simulation/rng'

const WEIGHTED_POWERUPS: ReadonlyArray<PowerupType> = ['shield', 'slow', 'ghost', 'score', 'venom']

export const getPowerupPool = (params: {
  floor: number
  isBossFloor: boolean
  objectiveType: FloorObjectiveKind
}): ReadonlyArray<PowerupType> => {
  const poolKind = params.isBossFloor
    ? 'boss'
    : params.objectiveType === 'kills'
      ? 'kills'
      : 'standard'
  const profile = getPowerupWeightProfileForFloor({ floor: params.floor, pool: poolKind })
  return WEIGHTED_POWERUPS.flatMap((powerup) =>
    Array.from({ length: Math.max(0, Math.round(profile[powerup])) }, () => powerup),
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
  const poolKind = params.isBossFloor
    ? 'boss'
    : params.objectiveType === 'kills'
      ? 'kills'
      : 'standard'
  const profile = getPowerupWeightProfileForFloor({ floor: params.floor, pool: poolKind })
  return (
    params.rng.weightedPick(
      WEIGHTED_POWERUPS.map((type) => ({
        value: type,
        weight: profile[type],
      })),
    ) ?? 'shield'
  )
}

export const pickEliteKind = (params: {
  floor: number
  rng: GameRng
  forceSpawn?: boolean
}): Extract<EnemyKind, 'stalker' | 'ambusher'> | null => {
  const sorted = [...BALANCE.elite.spawnByFloor].sort((a, b) => b.minFloor - a.minFloor)
  const config = sorted.find((entry) => params.floor >= entry.minFloor) ?? sorted[0]
  if (!config) {
    return null
  }
  if (!params.forceSpawn && params.rng.nextFloat() >= config.spawnChance) {
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
