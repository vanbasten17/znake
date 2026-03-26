import { BALANCE } from '../core/balance'
import type {
  EventChoiceDraft,
  EventChoiceEffects,
  EventChoiceOption,
  FloorRouteChoice,
} from '../core/types'
import { createSeededRng, deriveRunSeed } from './rng'

export type EventChoiceDraftContext = {
  floor: number
  currentShields: number
  snakeLength: number
  minSnakeLength: number
  score: number
}

export type EventChoiceDraftParams = {
  runSeed: number
  floor: number
  roomNodeId: string
  context: EventChoiceDraftContext
  forcedDefinitionId?: string
}

export type EventChoiceProgressState =
  | { status: 'idle' }
  | {
      status: 'pending'
      draft: EventChoiceDraft
      confirmOptionId: string | null
    }
  | {
      status: 'resolved'
      draft: EventChoiceDraft
      option: EventChoiceOption
    }

export type EventChoiceResolutionParams = {
  option: EventChoiceOption
  currentShields: number
  currentPendingGrowth: number
  currentScore: number
  currentEnemyInterval: number
  currentMoveInterval: number
}

export type EventChoiceResolution = {
  nextShields: number
  nextPendingGrowth: number
  nextScore: number
  nextEnemyInterval: number
  nextMoveInterval: number
  consumedLength: number
  routeIntent: FloorRouteChoice | null
}

const hashString = (value: string): number => {
  let hash = 2166136261 >>> 0
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619) >>> 0
  }
  return hash >>> 0
}

const shuffleDeterministic = <T>(values: ReadonlyArray<T>, seed: number): T[] => {
  const next = [...values]
  const rng = createSeededRng(seed)
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = rng.nextInt(0, index)
    const temp = next[index]
    next[index] = next[swapIndex] as T
    next[swapIndex] = temp as T
  }
  return next
}

const isEventOptionEligible = (
  option: EventChoiceOption,
  context: EventChoiceDraftContext,
): boolean => {
  const minRecoverableLength = Math.max(
    2,
    Math.floor(context.minSnakeLength),
    BALANCE.eventChoices.minRecoverableSnakeLength,
  )
  const nextShields = context.currentShields + (option.effects.shieldDelta ?? 0)
  const nextLength = context.snakeLength + (option.effects.lengthDelta ?? 0)
  const nextScore = context.score + (option.effects.scoreDelta ?? 0)

  if (nextShields < 0 || nextScore < 0 || nextLength < minRecoverableLength) {
    return false
  }

  if ((option.effects.shieldDelta ?? 0) < 0 && (option.effects.lengthDelta ?? 0) < 0) {
    return false
  }

  return true
}

export const draftEventChoice = (params: EventChoiceDraftParams): EventChoiceDraft | null => {
  const definitions = BALANCE.eventChoices.definitions
    .filter((definition) => definition.minFloor <= params.floor)
    .filter((definition) => {
      const eligibleCount = definition.options.filter((option) =>
        isEventOptionEligible(option, params.context),
      ).length
      return eligibleCount >= BALANCE.eventChoices.minOptionsPerDraft
    })

  const forcedDefinition = params.forcedDefinitionId
    ? (definitions.find((definition) => definition.id === params.forcedDefinitionId) ?? null)
    : null

  const baseSeed = deriveRunSeed([
    params.runSeed,
    params.floor,
    hashString(params.roomNodeId),
    0xec70,
  ])

  const selectedDefinition =
    forcedDefinition ??
    createSeededRng(baseSeed).weightedPick(
      definitions.map((definition) => ({ value: definition, weight: definition.weight })),
    )

  if (!selectedDefinition) {
    return null
  }

  const eligibleOptions = selectedDefinition.options.filter((option) =>
    isEventOptionEligible(option, params.context),
  )
  if (eligibleOptions.length < BALANCE.eventChoices.minOptionsPerDraft) {
    return null
  }

  const orderedOptions = shuffleDeterministic(
    eligibleOptions,
    deriveRunSeed([baseSeed, hashString(selectedDefinition.id)]),
  ).slice(0, BALANCE.eventChoices.maxOptionsPerDraft)

  return {
    definitionId: selectedDefinition.id,
    kind: selectedDefinition.kind,
    options: orderedOptions,
  }
}

export const createEventChoiceProgressState = (): EventChoiceProgressState => ({ status: 'idle' })

export const enterEventChoicePending = (draft: EventChoiceDraft): EventChoiceProgressState => ({
  status: 'pending',
  draft,
  confirmOptionId: null,
})

export const setEventChoiceConfirmOption = (
  state: EventChoiceProgressState,
  optionId: string | null,
): EventChoiceProgressState => {
  if (state.status !== 'pending') {
    return state
  }
  return {
    ...state,
    confirmOptionId: optionId,
  }
}

export const resolveEventChoiceProgress = (
  state: EventChoiceProgressState,
  option: EventChoiceOption,
): EventChoiceProgressState => {
  if (state.status !== 'pending') {
    return state
  }
  return {
    status: 'resolved',
    draft: state.draft,
    option,
  }
}

export const clearEventChoiceProgress = (): EventChoiceProgressState => ({ status: 'idle' })

const applyIntervalMultiplier = (
  value: number,
  multiplier: number | undefined,
  min: number,
): number => {
  if (multiplier === undefined) {
    return value
  }
  return Math.max(min, value * multiplier)
}

const getLengthDelta = (effects: EventChoiceEffects): number => effects.lengthDelta ?? 0

export const resolveEventChoiceOption = (
  params: EventChoiceResolutionParams,
): EventChoiceResolution => {
  const shieldDelta = params.option.effects.shieldDelta ?? 0
  const lengthDelta = getLengthDelta(params.option.effects)
  const scoreDelta = params.option.effects.scoreDelta ?? 0

  return {
    nextShields: Math.max(0, params.currentShields + shieldDelta),
    nextPendingGrowth: params.currentPendingGrowth + Math.max(0, lengthDelta),
    nextScore: Math.max(0, params.currentScore + scoreDelta),
    nextEnemyInterval: applyIntervalMultiplier(
      params.currentEnemyInterval,
      params.option.effects.enemyIntervalMultiplier,
      BALANCE.eventChoices.minEnemyIntervalMs,
    ),
    nextMoveInterval: applyIntervalMultiplier(
      params.currentMoveInterval,
      params.option.effects.moveIntervalMultiplier,
      BALANCE.eventChoices.minMoveIntervalMs,
    ),
    consumedLength: Math.max(0, -lengthDelta),
    routeIntent: params.option.effects.routeIntent ?? null,
  }
}
