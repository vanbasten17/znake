import { BALANCE } from './balance'
import type { FloorObjectiveKind, NonBossObjectiveKind } from './types'

export type FloorObjective = {
  kind: FloorObjectiveKind
  nonBossIndex: number
  scoreTarget: number
  killsTarget: number
}

const toPositiveInt = (value: number): number => Math.max(1, Math.floor(value))

export const getBossFloorsBefore = (floor: number): number => {
  const clampedFloor = Math.max(1, Math.floor(floor))
  return Math.floor((clampedFloor - 1) / BALANCE.biome.boss.floorInterval)
}

export const getNonBossFloorIndex = (floor: number): number => {
  const clampedFloor = Math.max(1, Math.floor(floor))
  return Math.max(0, clampedFloor - 1 - getBossFloorsBefore(clampedFloor))
}

export const getFloorObjectiveKind = (floor: number): FloorObjectiveKind => {
  const clampedFloor = Math.max(1, Math.floor(floor))
  if (clampedFloor % BALANCE.biome.boss.floorInterval === 0) {
    return 'boss'
  }
  const nonBossIndex = getNonBossFloorIndex(clampedFloor)
  const rotationIndex = nonBossIndex % BALANCE.objectives.rotation.length
  return BALANCE.objectives.rotation[rotationIndex] ?? 'portal'
}

export const rollRunObjectiveOffset = (): number => {
  const len = BALANCE.objectives.rotation.length
  if (len <= 1) {
    return 0
  }
  return Math.floor(Math.random() * len)
}

export const getScoreObjectiveTarget = (floor: number): number => {
  const clampedFloor = Math.max(1, Math.floor(floor))
  const target =
    BALANCE.objectives.scoreTargetBase + (clampedFloor - 1) * BALANCE.objectives.scoreTargetPerFloor
  return Math.min(BALANCE.objectives.scoreTargetCap, toPositiveInt(target))
}

export const getKillsObjectiveTarget = (floor: number): number => {
  const clampedFloor = Math.max(1, Math.floor(floor))
  const target =
    BALANCE.objectives.killTargetBase +
    Math.floor((clampedFloor - 1) / BALANCE.objectives.killTargetPerFloorStep)
  return Math.min(BALANCE.objectives.killTargetCap, toPositiveInt(target))
}

export const getFloorObjective = (floor: number, runObjectiveOffset = 0): FloorObjective => {
  const clampedFloor = Math.max(1, Math.floor(floor))
  const len = BALANCE.objectives.rotation.length
  const normalizedOffset = len > 0 ? ((Math.floor(runObjectiveOffset) % len) + len) % len : 0
  const baseKind = getFloorObjectiveKind(clampedFloor)
  const rotatedKind: FloorObjectiveKind =
    baseKind === 'boss'
      ? 'boss'
      : (BALANCE.objectives.rotation[
          (getNonBossFloorIndex(clampedFloor) + normalizedOffset) %
            BALANCE.objectives.rotation.length
        ] ?? 'portal')
  return {
    kind: rotatedKind,
    nonBossIndex: getNonBossFloorIndex(clampedFloor),
    scoreTarget: getScoreObjectiveTarget(clampedFloor),
    killsTarget: getKillsObjectiveTarget(clampedFloor),
  }
}
