import { getPowerupWeightProfileForFloor } from '../core/balance'
import type { FloorObjectiveKind, PowerupType } from '../core/types'

const WEIGHTED_POWERUPS: ReadonlyArray<PowerupType> = ['shield', 'slow', 'ghost', 'score', 'venom']

type PowerupPoolKind = 'standard' | 'kills' | 'boss'

export const resolvePowerupPoolKind = (params: {
  isBossFloor: boolean
  objectiveType: FloorObjectiveKind
}): PowerupPoolKind => {
  if (params.isBossFloor) {
    return 'boss'
  }
  return params.objectiveType === 'kills' ? 'kills' : 'standard'
}

export const buildWeightedPowerupEntries = (params: {
  floor: number
  pool: PowerupPoolKind
}): ReadonlyArray<{ value: PowerupType; weight: number }> => {
  const profile = getPowerupWeightProfileForFloor({ floor: params.floor, pool: params.pool })
  return WEIGHTED_POWERUPS.map((type) => ({
    value: type,
    weight: profile[type],
  }))
}

export const getSpecialEnemyChances = (params: {
  floor: number
  egg: { minFloor: number; spawnChance: number }
  mirror: { minFloor: number; spawnChance: number }
}): { eggChance: number; mirrorChance: number } => ({
  eggChance: params.floor >= params.egg.minFloor ? params.egg.spawnChance : 0,
  mirrorChance: params.floor >= params.mirror.minFloor ? params.mirror.spawnChance : 0,
})
