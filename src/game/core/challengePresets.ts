import { createSeededRng, deriveRunSeed } from '../simulation/rng'
import { BALANCE } from './balance'
import type { ChallengeMutatorId, ChallengeMutatorRuntime, ChallengePresetId } from './types'

type ResolveChallengePresetParams = {
  presetId: ChallengePresetId
  nowMs: number
  fallbackSeedParts: ReadonlyArray<number>
}

export type ChallengePresetResolution = {
  presetId: ChallengePresetId
  runSeed: number
  forcedMutatorId: ChallengeMutatorId | null
}

const DAY_MS = 24 * 60 * 60 * 1000
const DAILY_SEED_SALT = 0x44415931
const WEEKLY_SEED_SALT = 0x57454531
const DAILY_MUTATOR_SALT = 0x44414d31
const WEEKLY_MUTATOR_SALT = 0x574d5431

const PRESET_MUTATOR_POOL: ReadonlyArray<ChallengeMutatorId> = [
  'tempo_spike',
  'tight_turns',
  'lean_market',
  'route_tension',
]

const getUtcDayIndex = (nowMs: number): number => Math.floor(Math.max(0, nowMs) / DAY_MS)

const getUtcWeekIndex = (nowMs: number): number => Math.floor(getUtcDayIndex(nowMs) / 7)

const pickPresetMutatorId = (bucketIndex: number, salt: number): ChallengeMutatorId | null => {
  const rng = createSeededRng(deriveRunSeed([bucketIndex, salt]))
  return rng.pick(PRESET_MUTATOR_POOL)
}

export const resolveChallengePreset = (
  params: ResolveChallengePresetParams,
): ChallengePresetResolution => {
  if (params.presetId === 'daily') {
    const dayIndex = getUtcDayIndex(params.nowMs)
    return {
      presetId: 'daily',
      runSeed: deriveRunSeed([DAILY_SEED_SALT, dayIndex]),
      forcedMutatorId: pickPresetMutatorId(dayIndex, DAILY_MUTATOR_SALT),
    }
  }
  if (params.presetId === 'weekly') {
    const weekIndex = getUtcWeekIndex(params.nowMs)
    return {
      presetId: 'weekly',
      runSeed: deriveRunSeed([WEEKLY_SEED_SALT, weekIndex]),
      forcedMutatorId: pickPresetMutatorId(weekIndex, WEEKLY_MUTATOR_SALT),
    }
  }
  return {
    presetId: 'standard',
    runSeed: deriveRunSeed(params.fallbackSeedParts),
    forcedMutatorId: null,
  }
}

export const resolvePresetMutatorRuntime = (
  mutatorId: ChallengeMutatorId | null,
  floor: number,
): ChallengeMutatorRuntime | null => {
  if (!mutatorId) return null
  const definition = BALANCE.challengeMutators.catalog.find(
    (candidate) => candidate.id === mutatorId,
  )
  if (!definition || floor < definition.minFloor) return null
  return {
    id: definition.id,
    label: definition.label,
    summary: definition.summary,
    domain: definition.domain,
    effects: { ...definition.effects },
  }
}
