import type {
  EliteMinibossFailureReason,
  EliteMinibossPatternPhase,
  Enemy,
  EnemyKind,
  RoomObjectiveState,
  RunMapRoomType,
} from '../core/types'

export const isEliteMinibossKind = (kind: EnemyKind): boolean =>
  kind === 'stalker' || kind === 'ambusher' || kind === 'boss'

export const resolveEliteMinibossPatternPhase = (params: {
  enemy: Enemy
  recoveryTicks: number
}): EliteMinibossPatternPhase => {
  if (params.enemy.telegraph || params.enemy.readability.telegraphActive) {
    return 'telegraph'
  }
  const cooldown = Math.max(0, Math.floor(params.enemy.dashCooldown + params.enemy.roleCooldown))
  if (cooldown > 0 && cooldown <= Math.max(1, Math.floor(params.recoveryTicks))) {
    return 'recovery'
  }
  return 'commit'
}

export const isObjectiveCriticalEncounter = (params: {
  isBossFloor: boolean
  currentRoomType: RunMapRoomType
  roomObjective: RoomObjectiveState | null
  objectiveCriticalRoomTypes: ReadonlyArray<RunMapRoomType>
}): boolean => {
  if (params.isBossFloor) {
    return true
  }
  if (params.objectiveCriticalRoomTypes.includes(params.currentRoomType)) {
    return true
  }
  return params.roomObjective?.kind === 'defeat_elite'
}

export const shouldGuaranteeEliteCadence = (params: {
  floor: number
  isBossFloor: boolean
  currentRoomType: RunMapRoomType
  startFloor: number
  everyNFloors: number
  guaranteeInEliteRooms: boolean
}): boolean => {
  if (params.isBossFloor) {
    return false
  }
  if (params.guaranteeInEliteRooms && params.currentRoomType === 'elite') {
    return true
  }
  const floor = Math.max(1, Math.floor(params.floor))
  const startFloor = Math.max(1, Math.floor(params.startFloor))
  const everyNFloors = Math.max(1, Math.floor(params.everyNFloors))
  if (floor < startFloor) {
    return false
  }
  return (floor - startFloor) % everyNFloors === 0
}

export const countOpenNeighborCells = (params: {
  x: number
  y: number
  isBlocked: (x: number, y: number) => boolean
}): number => {
  const dirs = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ]
  let count = 0
  for (const dir of dirs) {
    const nx = params.x + dir.x
    const ny = params.y + dir.y
    if (params.isBlocked(nx, ny)) {
      continue
    }
    count += 1
  }
  return count
}

export const resolveEliteMinibossFailureReason = (params: {
  hadTelegraph: boolean
  counterplayTicksRemaining: number
  openNeighborCount: number
  activePressureSources: number
  maxSimultaneousPressureSources: number
}): EliteMinibossFailureReason => {
  if (params.activePressureSources > params.maxSimultaneousPressureSources) {
    return 'stacked_pressure'
  }
  if (params.openNeighborCount <= 1) {
    return 'trapped_path'
  }
  if (params.hadTelegraph && params.counterplayTicksRemaining <= 0) {
    return 'late_react'
  }
  return 'telegraph_missed'
}
