import { BALANCE } from './balance'
import type {
  FloorObjectiveKind,
  NonBossObjectiveKind,
  RoomObjectiveDefinition,
  RoomObjectiveKind,
} from './types'

export type FloorObjective = {
  kind: FloorObjectiveKind
  nonBossIndex: number
  scoreTarget: number
  killsTarget: number
}

export type RoomObjective = RoomObjectiveDefinition

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
  return 0
}

export const getRunObjectiveOffsetForSeed = (seed: number): number => {
  const len = BALANCE.objectives.rotation.length
  if (len <= 1) {
    return 0
  }
  return (Math.floor(Math.abs(seed)) >>> 0) % len
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

export const getRoomObjectiveKind = (floor: number, runObjectiveOffset = 0): RoomObjectiveKind => {
  const clampedFloor = Math.max(1, Math.floor(floor))
  const len = BALANCE.roomObjectives.rotation.length
  if (len <= 0) {
    return 'survive'
  }
  const normalizedOffset = ((Math.floor(runObjectiveOffset) % len) + len) % len
  return BALANCE.roomObjectives.rotation[(clampedFloor - 1 + normalizedOffset) % len] ?? 'survive'
}

export const getSurviveObjectiveTargetMs = (floor: number): number => {
  const clampedFloor = Math.max(1, Math.floor(floor))
  const target =
    BALANCE.roomObjectives.surviveDurationBaseMs +
    (clampedFloor - 1) * BALANCE.roomObjectives.surviveDurationPerFloorMs
  return Math.min(BALANCE.roomObjectives.surviveDurationCapMs, toPositiveInt(target))
}

export const getCollectCoresObjectiveTarget = (floor: number): number => {
  const clampedFloor = Math.max(1, Math.floor(floor))
  const target =
    BALANCE.roomObjectives.collectCoresBase +
    Math.floor((clampedFloor - 1) / BALANCE.roomObjectives.collectCoresPerFloorStep)
  return Math.min(BALANCE.roomObjectives.collectCoresCap, toPositiveInt(target))
}

export const getDefeatEliteObjectiveTarget = (floor: number): number => {
  const clampedFloor = Math.max(1, Math.floor(floor))
  const target = BALANCE.roomObjectives.defeatEliteBase + Math.floor((clampedFloor - 1) / 4)
  return Math.min(BALANCE.roomObjectives.defeatEliteCap, toPositiveInt(target))
}

export const getActivateTerminalsObjectiveTarget = (floor: number): number => {
  const clampedFloor = Math.max(1, Math.floor(floor))
  const target = BALANCE.roomObjectives.activateTerminalsBase + Math.floor((clampedFloor - 1) / 5)
  return Math.min(BALANCE.roomObjectives.activateTerminalsCap, toPositiveInt(target))
}

export const getRoomObjective = (floor: number, runObjectiveOffset = 0): RoomObjective => {
  const kind = getRoomObjectiveKind(floor, runObjectiveOffset)
  if (kind === 'collect_cores') {
    return { kind, target: getCollectCoresObjectiveTarget(floor) }
  }
  if (kind === 'defeat_elite') {
    return { kind, target: getDefeatEliteObjectiveTarget(floor) }
  }
  if (kind === 'activate_terminals') {
    return { kind, target: getActivateTerminalsObjectiveTarget(floor) }
  }
  return { kind: 'survive', target: getSurviveObjectiveTargetMs(floor) }
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
