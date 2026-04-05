import type { RoomObjectiveKind } from '../core/types'

export type RewardRerollConfig = {
  minCost: number
  maxCost: number
  growthPerUse: number
  floorBandMultiplier: {
    early: number
    mid: number
    late: number
  }
  objectiveMultiplier: Record<RoomObjectiveKind, number>
}

const getFloorBand = (floor: number): 'early' | 'mid' | 'late' => {
  if (floor >= 12) {
    return 'late'
  }
  if (floor >= 6) {
    return 'mid'
  }
  return 'early'
}

export const resolveRewardRerollCost = (params: {
  baseCost: number
  rerollCountInWindow: number
  floor: number
  objectiveKind: RoomObjectiveKind | null
  config: RewardRerollConfig
}): number => {
  const useCount = Math.max(0, params.rerollCountInWindow)
  const growthMultiplier = Math.max(1, 1 + useCount * params.config.growthPerUse)
  const floorMultiplier = params.config.floorBandMultiplier[getFloorBand(params.floor)]
  const objectiveMultiplier = params.objectiveKind
    ? params.config.objectiveMultiplier[params.objectiveKind]
    : 1

  const scaled = params.baseCost * growthMultiplier * floorMultiplier * objectiveMultiplier
  const bounded = Math.max(params.config.minCost, Math.min(params.config.maxCost, scaled))
  return Math.max(1, Math.floor(bounded))
}
