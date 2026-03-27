import { BALANCE } from '../core/balance'
import type {
  ChallengeMutatorDefinition,
  ChallengeMutatorRuntime,
  FloorRouteChoice,
  RoomObjectiveKind,
  RunConfig,
} from '../core/types'
import type { EventChoiceDraftContext } from './eventChoices'
import { createSeededRng, deriveRunSeed } from './rng'

export type MutatorBlockedReason =
  | 'conflict_pair'
  | 'pressure_budget'
  | 'move_floor'
  | 'enemy_floor'
  | 'body_floor'
  | 'event_floor'

export type MutatorBlockedCandidate = {
  id: string
  reason: MutatorBlockedReason
}

export type ResolveChallengeMutatorsParams = {
  runSeed: number
  floor: number
  available: boolean
  baseConfig: RunConfig
  baseEnemyInterval: number
}

export type ResolveChallengeMutatorsResult = {
  active: ChallengeMutatorRuntime[]
  blocked: MutatorBlockedCandidate[]
}

type MutatorPreviewState = {
  moveInterval: number
  enemyInterval: number
  bodySpendMinLength: number
  eventMinSnakeLength: number
  pressureCost: number
}

const mutatorCatalog = BALANCE.challengeMutators.catalog

const copyRuntime = (definition: ChallengeMutatorDefinition): ChallengeMutatorRuntime => ({
  id: definition.id,
  label: definition.label,
  summary: definition.summary,
  domain: definition.domain,
  effects: { ...definition.effects },
})

const hasBlockedPair = (
  selected: ReadonlyArray<ChallengeMutatorDefinition>,
  candidate: ChallengeMutatorDefinition,
): boolean => {
  const selectedIds = new Set(selected.map((item) => item.id))
  for (const [left, right] of BALANCE.challengeMutators.guardrails.blockedPairs) {
    if (
      (left === candidate.id && selectedIds.has(right)) ||
      (right === candidate.id && selectedIds.has(left))
    ) {
      return true
    }
  }
  return false
}

const applyCandidateToPreview = (
  state: MutatorPreviewState,
  candidate: ChallengeMutatorDefinition,
): MutatorPreviewState => {
  const moveMultiplier = candidate.effects.moveIntervalMultiplier ?? 1
  const enemyMultiplier = candidate.effects.enemyIntervalMultiplier ?? 1
  return {
    moveInterval: state.moveInterval * moveMultiplier,
    enemyInterval: state.enemyInterval * enemyMultiplier,
    bodySpendMinLength:
      state.bodySpendMinLength + Math.floor(candidate.effects.bodySpendMinLengthDelta ?? 0),
    eventMinSnakeLength:
      state.eventMinSnakeLength + Math.floor(candidate.effects.eventMinSnakeLengthDelta ?? 0),
    pressureCost: state.pressureCost + Math.max(0, Math.floor(candidate.pressureCost)),
  }
}

const validateCandidate = (
  selected: ReadonlyArray<ChallengeMutatorDefinition>,
  candidate: ChallengeMutatorDefinition,
  preview: MutatorPreviewState,
): MutatorBlockedReason | null => {
  if (hasBlockedPair(selected, candidate)) {
    return 'conflict_pair'
  }
  const next = applyCandidateToPreview(preview, candidate)
  const guardrails = BALANCE.challengeMutators.guardrails
  if (next.pressureCost > guardrails.pressureBudgetMax) {
    return 'pressure_budget'
  }
  if (next.moveInterval < guardrails.minMoveIntervalMs) {
    return 'move_floor'
  }
  if (next.enemyInterval < guardrails.minEnemyIntervalMs) {
    return 'enemy_floor'
  }
  if (next.bodySpendMinLength > guardrails.maxBodySpendMinLength) {
    return 'body_floor'
  }
  if (next.eventMinSnakeLength > guardrails.maxEventMinSnakeLength) {
    return 'event_floor'
  }
  return null
}

const removeFirstById = (
  pool: ChallengeMutatorDefinition[],
  id: ChallengeMutatorDefinition['id'],
): void => {
  const index = pool.findIndex((candidate) => candidate.id === id)
  if (index >= 0) {
    pool.splice(index, 1)
  }
}

export const resolveChallengeMutators = (
  params: ResolveChallengeMutatorsParams,
): ResolveChallengeMutatorsResult => {
  if (!BALANCE.challengeMutators.enabled || !params.available) {
    return { active: [], blocked: [] }
  }

  const eligiblePool = mutatorCatalog
    .filter((candidate) => params.floor >= candidate.minFloor)
    .map((candidate) => ({ ...candidate, effects: { ...candidate.effects } }))

  if (eligiblePool.length <= 0) {
    return { active: [], blocked: [] }
  }

  const rng = createSeededRng(deriveRunSeed([params.runSeed, params.floor, 0x51a7]))
  const maxActive = Math.max(0, Math.floor(BALANCE.challengeMutators.maxActive))
  const selected: ChallengeMutatorDefinition[] = []
  const blocked: MutatorBlockedCandidate[] = []
  let preview: MutatorPreviewState = {
    moveInterval: params.baseConfig.moveInterval,
    enemyInterval: params.baseEnemyInterval,
    bodySpendMinLength: params.baseConfig.bodySpendMinLength,
    eventMinSnakeLength: BALANCE.eventChoices.minRecoverableSnakeLength,
    pressureCost: 0,
  }

  const pool = [...eligiblePool]
  while (selected.length < maxActive && pool.length > 0) {
    const picked =
      rng.weightedPick(pool.map((candidate) => ({ value: candidate, weight: candidate.weight }))) ??
      pool[0]
    if (!picked) {
      break
    }
    removeFirstById(pool, picked.id)

    const blockedReason = validateCandidate(selected, picked, preview)
    if (blockedReason) {
      blocked.push({ id: picked.id, reason: blockedReason })
      continue
    }

    selected.push(picked)
    preview = applyCandidateToPreview(preview, picked)
  }

  return {
    active: selected.map(copyRuntime),
    blocked,
  }
}

export const applyChallengeMutatorsToRunConfig = (
  config: RunConfig,
  mutators: ReadonlyArray<ChallengeMutatorRuntime>,
): void => {
  for (const mutator of mutators) {
    const moveMultiplier = mutator.effects.moveIntervalMultiplier ?? 1
    config.moveInterval = Math.max(
      BALANCE.challengeMutators.guardrails.minMoveIntervalMs,
      config.moveInterval * moveMultiplier,
    )
    config.maxTurnQueue = Math.max(
      1,
      config.maxTurnQueue + Math.floor(mutator.effects.maxTurnQueueDelta ?? 0),
    )
    config.bodySpendMinLength = Math.max(
      1,
      config.bodySpendMinLength + Math.floor(mutator.effects.bodySpendMinLengthDelta ?? 0),
    )
  }
}

export const applyChallengeMutatorsToEnemyInterval = (
  enemyInterval: number,
  mutators: ReadonlyArray<ChallengeMutatorRuntime>,
): number => {
  let next = enemyInterval
  for (const mutator of mutators) {
    next *= mutator.effects.enemyIntervalMultiplier ?? 1
  }
  return Math.max(BALANCE.challengeMutators.guardrails.minEnemyIntervalMs, next)
}

export const applyChallengeMutatorsToRoomObjectiveTarget = (params: {
  kind: RoomObjectiveKind
  target: number
  mutators: ReadonlyArray<ChallengeMutatorRuntime>
}): number => {
  let next = params.target
  if (params.kind !== 'survive') {
    return next
  }
  for (const mutator of params.mutators) {
    next *= mutator.effects.surviveObjectiveTargetMultiplier ?? 1
  }
  return Math.max(4000, Math.floor(next))
}

export const composeMutatorEventChoiceContext = (
  context: EventChoiceDraftContext,
  mutators: ReadonlyArray<ChallengeMutatorRuntime>,
): EventChoiceDraftContext => {
  const eventDelta = mutators.reduce(
    (acc, mutator) => acc + Math.floor(mutator.effects.eventMinSnakeLengthDelta ?? 0),
    0,
  )
  return {
    ...context,
    minSnakeLength: Math.max(context.minSnakeLength, context.minSnakeLength + eventDelta),
  }
}

export const applyChallengeMutatorsToRouteChoice = (params: {
  route: FloorRouteChoice
  enemyDelta: number
  mutators: ReadonlyArray<ChallengeMutatorRuntime>
}): number => {
  let next = params.enemyDelta
  for (const mutator of params.mutators) {
    if (params.route === 'safer') {
      next += Math.floor(mutator.effects.saferRouteEnemyDelta ?? 0)
    } else {
      next += Math.floor(mutator.effects.riskierRouteEnemyDelta ?? 0)
    }
  }
  return next
}

export const getChallengeMutatorHudLabels = (
  mutators: ReadonlyArray<ChallengeMutatorRuntime>,
): string[] => {
  const maxShown = Math.max(0, Math.floor(BALANCE.challengeMutators.maxShownInHud))
  return mutators.slice(0, maxShown).map((mutator) => mutator.label)
}
