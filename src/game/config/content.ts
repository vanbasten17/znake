import { BALANCE, getPowerupWeightProfileForFloor } from '../core/balance'
import type { EnemyKind, FloorObjectiveKind, PowerupType } from '../core/types'
import type { GameRng } from '../simulation/rng'

const WEIGHTED_POWERUPS: ReadonlyArray<PowerupType> = ['shield', 'slow', 'ghost', 'score', 'venom']
const ELITE_SPAWN_BY_FLOOR_DESC = [...BALANCE.elite.spawnByFloor].sort(
  (a, b) => b.minFloor - a.minFloor,
)

type PowerupPoolKind = 'standard' | 'kills' | 'boss'

const resolvePowerupPoolKind = (params: {
  isBossFloor: boolean
  objectiveType: FloorObjectiveKind
}): PowerupPoolKind => {
  if (params.isBossFloor) {
    return 'boss'
  }
  return params.objectiveType === 'kills' ? 'kills' : 'standard'
}

const buildWeightedPowerupEntries = (params: {
  floor: number
  pool: PowerupPoolKind
}): ReadonlyArray<{ value: PowerupType; weight: number }> => {
  const profile = getPowerupWeightProfileForFloor({ floor: params.floor, pool: params.pool })
  return WEIGHTED_POWERUPS.map((type) => ({
    value: type,
    weight: profile[type],
  }))
}

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
    'shield'
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
    { value: 'stalker' as const, weight: config.kindWeights.stalker },
    { value: 'ambusher' as const, weight: config.kindWeights.ambusher },
  ])
  return weighted
}

const getSpecialEnemyChances = (floor: number): { eggChance: number; mirrorChance: number } => ({
  eggChance:
    floor >= BALANCE.enemyVariants.egg.minFloor ? BALANCE.enemyVariants.egg.spawnChance : 0,
  mirrorChance:
    floor >= BALANCE.enemyVariants.mirror.minFloor ? BALANCE.enemyVariants.mirror.spawnChance : 0,
})

export const pickSpecialEnemyKind = (params: {
  floor: number
  rng: GameRng
}): Extract<EnemyKind, 'egg' | 'mirror'> | null => {
  const { eggChance, mirrorChance } = getSpecialEnemyChances(params.floor)
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
