import type {
  CleanPlayObjectiveResult,
  FloorObjectiveKind,
  RewardOption,
  RoomObjectiveDefinition,
  RoomObjectiveKind,
  RoomObjectiveState,
  RunCleanPlaySummary,
} from '../core/types'
import type { GameRng } from './rng'

export type PortalFlowState = {
  countdownMs: number
  graceMs: number
  graceSecondCue: number
  squeezeStepTimerMs: number
  squeezeInset: number
  active: boolean
}

export type PortalFlowEvent =
  | 'spawn_portals'
  | 'urgent_second_tick'
  | 'squeeze_step'
  | 'head_crushed'

export type CorePressureState = {
  active: boolean
  intervalMs: number
  remainingMs: number
  coolantCharges: number
}

export type CorePressureEvent = 'consume_coolant' | 'decay' | 'fatal_decay'

export type RoomObjectiveProgressEvent =
  | { type: 'tick'; deltaMs: number }
  | { type: 'core_collected'; amount?: number }
  | { type: 'elite_defeated'; amount?: number }
  | { type: 'terminal_activated'; amount?: number }
  | { type: 'damage_taken'; damageKind: 'shield' | 'body' }

export const initPortalFlowState = (params: {
  isBossFloor: boolean
  floor: number
  objectiveType: FloorObjectiveKind
  countdownBaseMs: number
  countdownPerFloorMs: number
  countdownMinMs: number
  graceMs: number
}): PortalFlowState => {
  if (params.isBossFloor) {
    return {
      active: false,
      countdownMs: 0,
      graceMs: 0,
      graceSecondCue: -1,
      squeezeStepTimerMs: 0,
      squeezeInset: 0,
    }
  }
  const floorOffset = Math.max(0, params.floor - 1)
  const countdown = params.countdownBaseMs - floorOffset * params.countdownPerFloorMs
  return {
    active: params.objectiveType === 'portal',
    countdownMs: Math.max(params.countdownMinMs, countdown),
    graceMs: params.graceMs,
    graceSecondCue: -1,
    squeezeStepTimerMs: 0,
    squeezeInset: 0,
  }
}

export const applyPortalBeaconAcceleration = (
  state: PortalFlowState,
  accelerateMs: number,
): PortalFlowState => ({
  ...state,
  countdownMs: Math.max(0, state.countdownMs - accelerateMs),
})

export const tickPortalFlow = (params: {
  state: PortalFlowState
  deltaMs: number
  objectiveType: FloorObjectiveKind
  isBossFloor: boolean
  squeezeStepMs: number
  squeezeMaxInset: number
  isCellWall: (x: number, y: number) => boolean
  snakeHead: { x: number; y: number } | null
}): {
  state: PortalFlowState
  events: PortalFlowEvent[]
} => {
  const events: PortalFlowEvent[] = []
  if (params.isBossFloor || !params.state.active) {
    return { state: params.state, events }
  }

  const next = { ...params.state }

  if (next.countdownMs > 0) {
    next.countdownMs = Math.max(0, next.countdownMs - params.deltaMs)
    if (next.countdownMs <= 0 && params.objectiveType === 'portal') {
      events.push('spawn_portals')
    }
    if (next.countdownMs <= 0 && next.graceSecondCue < 0) {
      next.graceSecondCue = Math.ceil(next.graceMs / 1000) + 1
    }
  }
  if (next.countdownMs > 0) {
    return { state: next, events }
  }

  if (next.graceMs > 0) {
    const after = Math.max(0, next.graceMs - params.deltaMs)
    const second = Math.ceil(after / 1000)
    if (second > 0 && second < next.graceSecondCue) {
      next.graceSecondCue = second
      events.push('urgent_second_tick')
    }
    next.graceMs = after
    return { state: next, events }
  }

  next.squeezeStepTimerMs += params.deltaMs
  if (next.squeezeStepTimerMs < params.squeezeStepMs) {
    return { state: next, events }
  }
  next.squeezeStepTimerMs = 0
  if (next.squeezeInset < params.squeezeMaxInset) {
    next.squeezeInset += 1
    events.push('squeeze_step')
  }
  const head = params.snakeHead
  if (head && params.isCellWall(head.x, head.y)) {
    events.push('head_crushed')
  }
  return { state: next, events }
}

export const initCorePressureState = (params: {
  enabled: boolean
  isBossFloor: boolean
  floor: number
  startFloor: number
  intervalBaseMs: number
  intervalPerFloorMs: number
  intervalMinMs: number
}): CorePressureState => {
  if (!params.enabled || params.isBossFloor || params.floor < params.startFloor) {
    return {
      active: false,
      intervalMs: 0,
      remainingMs: 0,
      coolantCharges: 0,
    }
  }
  const floorOffset = Math.max(0, params.floor - params.startFloor)
  const interval = Math.max(
    params.intervalMinMs,
    params.intervalBaseMs - floorOffset * params.intervalPerFloorMs,
  )
  return {
    active: true,
    intervalMs: interval,
    remainingMs: interval,
    coolantCharges: 0,
  }
}

export const resetCorePressureTimer = (state: CorePressureState): CorePressureState =>
  state.active
    ? {
        ...state,
        remainingMs: state.intervalMs,
      }
    : state

export const addCorePressureCoolant = (
  state: CorePressureState,
  charges: number,
): CorePressureState =>
  state.active
    ? {
        ...state,
        coolantCharges: state.coolantCharges + Math.max(0, Math.floor(charges)),
        remainingMs: state.intervalMs,
      }
    : state

export const tickCorePressure = (params: {
  state: CorePressureState
  deltaMs: number
  snakeLength: number
  decaySegments: number
}): {
  state: CorePressureState
  events: CorePressureEvent[]
} => {
  if (!params.state.active) {
    return { state: params.state, events: [] }
  }
  const events: CorePressureEvent[] = []
  const next = {
    ...params.state,
    remainingMs: Math.max(0, params.state.remainingMs - params.deltaMs),
  }
  if (next.remainingMs > 0) {
    return { state: next, events }
  }
  if (next.coolantCharges > 0) {
    next.coolantCharges -= 1
    next.remainingMs = next.intervalMs
    events.push('consume_coolant')
    return { state: next, events }
  }
  next.remainingMs = next.intervalMs
  events.push(params.snakeLength <= Math.max(1, params.decaySegments) ? 'fatal_decay' : 'decay')
  return { state: next, events }
}

export const shouldCompleteObjective = (params: {
  isBossFloor: boolean
  objectiveType: FloorObjectiveKind
  scoreProgress: number
  scoreTarget: number
  killsProgress: number
  killsTarget: number
}): boolean => {
  if (params.isBossFloor) {
    return false
  }
  if (params.objectiveType === 'score') {
    return params.scoreProgress >= params.scoreTarget
  }
  if (params.objectiveType === 'kills') {
    return params.killsProgress >= params.killsTarget
  }
  return false
}

export const initRoomObjectiveState = (
  definition: RoomObjectiveDefinition,
): RoomObjectiveState => ({
  kind: definition.kind,
  progress: 0,
  target: Math.max(1, Math.floor(definition.target)),
  completed: false,
  rewardClaimed: false,
  cleanPlay: {
    shieldHits: 0,
    bodyHits: 0,
    resolved: false,
    bonusAwarded: false,
  },
})

export const advanceRoomObjectiveState = (
  state: RoomObjectiveState,
  event: RoomObjectiveProgressEvent,
): {
  state: RoomObjectiveState
  completedNow: boolean
} => {
  if (state.completed) {
    return { state, completedNow: false }
  }

  const nextCleanPlay = { ...state.cleanPlay }
  let nextProgress = state.progress
  if (event.type === 'damage_taken') {
    if (event.damageKind === 'shield') {
      nextCleanPlay.shieldHits += 1
    } else {
      nextCleanPlay.bodyHits += 1
    }
  } else if (state.kind === 'survive' && event.type === 'tick') {
    nextProgress += Math.max(0, event.deltaMs)
  } else if (state.kind === 'collect_cores' && event.type === 'core_collected') {
    nextProgress += Math.max(1, Math.floor(event.amount ?? 1))
  } else if (state.kind === 'defeat_elite' && event.type === 'elite_defeated') {
    nextProgress += Math.max(1, Math.floor(event.amount ?? 1))
  } else if (state.kind === 'activate_terminals' && event.type === 'terminal_activated') {
    nextProgress += Math.max(1, Math.floor(event.amount ?? 1))
  }

  const completed = nextProgress >= state.target
  return {
    state: {
      ...state,
      progress: Math.min(nextProgress, state.target),
      completed,
      cleanPlay: nextCleanPlay,
    },
    completedNow: completed,
  }
}

export const markRoomObjectiveRewardClaimed = (state: RoomObjectiveState): RoomObjectiveState => ({
  ...state,
  rewardClaimed: true,
})

export const createEmptyRunCleanPlaySummary = (): RunCleanPlaySummary => ({
  completedObjectives: 0,
  cleanClears: 0,
  totalBonusScore: 0,
  awardedByKind: {
    survive: 0,
    collect_cores: 0,
    defeat_elite: 0,
    activate_terminals: 0,
  },
})

const isCleanPlayEligible = (params: {
  state: RoomObjectiveState
  invalidateOnShieldHit: boolean
  invalidateOnBodyHit: boolean
}): boolean => {
  if (!params.state.completed) {
    return false
  }
  if (params.invalidateOnShieldHit && params.state.cleanPlay.shieldHits > 0) {
    return false
  }
  if (params.invalidateOnBodyHit && params.state.cleanPlay.bodyHits > 0) {
    return false
  }
  return true
}

export const resolveCleanPlayBonusForObjective = (params: {
  state: RoomObjectiveState
  runSummary: RunCleanPlaySummary
  invalidateOnShieldHit: boolean
  invalidateOnBodyHit: boolean
  scoreByObjectiveKind: Record<RoomObjectiveKind, number>
  maxAwardsPerRunByObjectiveKind: Record<RoomObjectiveKind, number>
}): {
  state: RoomObjectiveState
  runSummary: RunCleanPlaySummary
  result: CleanPlayObjectiveResult
} => {
  const eligible = isCleanPlayEligible({
    state: params.state,
    invalidateOnShieldHit: params.invalidateOnShieldHit,
    invalidateOnBodyHit: params.invalidateOnBodyHit,
  })
  const kind = params.state.kind
  const currentAwardsForKind = params.runSummary.awardedByKind[kind] ?? 0
  const maxAwardsForKind = Math.max(0, Math.floor(params.maxAwardsPerRunByObjectiveKind[kind] ?? 0))

  if (!params.state.completed) {
    return {
      state: params.state,
      runSummary: params.runSummary,
      result: {
        objectiveKind: kind,
        eligible: false,
        awarded: false,
        rewardType: 'score',
        rewardAmount: 0,
        shieldHits: params.state.cleanPlay.shieldHits,
        bodyHits: params.state.cleanPlay.bodyHits,
        reason: 'not_completed',
      },
    }
  }

  if (params.state.cleanPlay.resolved) {
    return {
      state: params.state,
      runSummary: params.runSummary,
      result: {
        objectiveKind: kind,
        eligible,
        // A repeated resolution call should report no new award.
        awarded: false,
        rewardType: 'score',
        rewardAmount: 0,
        shieldHits: params.state.cleanPlay.shieldHits,
        bodyHits: params.state.cleanPlay.bodyHits,
        reason: 'already_resolved',
      },
    }
  }

  if (!eligible) {
    const nextRunSummary: RunCleanPlaySummary = {
      completedObjectives: params.runSummary.completedObjectives + 1,
      cleanClears: params.runSummary.cleanClears,
      totalBonusScore: params.runSummary.totalBonusScore,
      awardedByKind: { ...params.runSummary.awardedByKind },
    }
    return {
      state: {
        ...params.state,
        cleanPlay: {
          ...params.state.cleanPlay,
          resolved: true,
        },
      },
      runSummary: nextRunSummary,
      result: {
        objectiveKind: kind,
        eligible: false,
        awarded: false,
        rewardType: 'score',
        rewardAmount: 0,
        shieldHits: params.state.cleanPlay.shieldHits,
        bodyHits: params.state.cleanPlay.bodyHits,
        reason: 'took_hit',
      },
    }
  }

  if (currentAwardsForKind >= maxAwardsForKind) {
    const nextRunSummary: RunCleanPlaySummary = {
      completedObjectives: params.runSummary.completedObjectives + 1,
      cleanClears: params.runSummary.cleanClears + 1,
      totalBonusScore: params.runSummary.totalBonusScore,
      awardedByKind: { ...params.runSummary.awardedByKind },
    }
    return {
      state: {
        ...params.state,
        cleanPlay: {
          ...params.state.cleanPlay,
          resolved: true,
        },
      },
      runSummary: nextRunSummary,
      result: {
        objectiveKind: kind,
        eligible: true,
        awarded: false,
        rewardType: 'score',
        rewardAmount: 0,
        shieldHits: params.state.cleanPlay.shieldHits,
        bodyHits: params.state.cleanPlay.bodyHits,
        reason: 'objective_kind_cap_reached',
      },
    }
  }

  const rewardAmount = Math.max(0, Math.floor(params.scoreByObjectiveKind[kind] ?? 0))
  const nextRunSummary: RunCleanPlaySummary = {
    completedObjectives: params.runSummary.completedObjectives + 1,
    cleanClears: params.runSummary.cleanClears + 1,
    totalBonusScore: params.runSummary.totalBonusScore + rewardAmount,
    awardedByKind: { ...params.runSummary.awardedByKind },
  }
  nextRunSummary.awardedByKind[kind] = currentAwardsForKind + 1
  return {
    state: {
      ...params.state,
      cleanPlay: {
        ...params.state.cleanPlay,
        resolved: true,
        bonusAwarded: rewardAmount > 0,
      },
    },
    runSummary: nextRunSummary,
    result: {
      objectiveKind: kind,
      eligible: true,
      awarded: rewardAmount > 0,
      rewardType: 'score',
      rewardAmount,
      shieldHits: params.state.cleanPlay.shieldHits,
      bodyHits: params.state.cleanPlay.bodyHits,
      reason: 'awarded',
    },
  }
}

export const draftRewardOptions = (
  pool: ReadonlyArray<RewardOption>,
  draftSize: number,
  rng: GameRng,
): RewardOption[] => {
  const remaining = [...pool]
  const picks: RewardOption[] = []
  const size = Math.max(1, Math.min(draftSize, remaining.length))
  for (let index = 0; index < size; index += 1) {
    const nextIndex = rng.nextInt(0, remaining.length - 1)
    const choice = remaining.splice(nextIndex, 1)[0]
    if (choice) {
      picks.push(choice)
    }
  }
  return picks
}
