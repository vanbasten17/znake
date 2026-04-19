import {
  type ChallengeSharePayload,
  createChallengeShareCode,
  parseChallengeShareCode,
} from '../../core/challengeShare'
import type { RunHistoryEntry } from '../../core/runHistory'
import type { ChallengeMutatorId, ReplaySnapshot } from '../../core/types'

type LatestChallengeShareInput = {
  latestReplay: ReplaySnapshot | null
  latestRun: RunHistoryEntry | null
  forcedMutatorId: ChallengeMutatorId | null
}

type LatestChallengeShareSource = {
  seed: number
  presetId: RunHistoryEntry['challengePresetId']
  floor: number
  score: number
}

export type ImportedChallengeShareDecision =
  | { kind: 'empty' }
  | { kind: 'invalid'; reason: string }
  | { kind: 'valid'; payload: ChallengeSharePayload }

const resolveLatestChallengeShareSource = (
  input: LatestChallengeShareInput,
): LatestChallengeShareSource | null => {
  const sourceSeed = input.latestReplay?.runSeed ?? input.latestRun?.runSeed
  if (!Number.isFinite(sourceSeed)) {
    return null
  }
  return {
    seed: sourceSeed ?? 0,
    presetId:
      input.latestReplay?.challengePresetId ?? input.latestRun?.challengePresetId ?? 'standard',
    floor: input.latestReplay?.floor ?? input.latestRun?.floor ?? 0,
    score: input.latestReplay?.score ?? input.latestRun?.score ?? 0,
  }
}

export const createLatestChallengeShareCode = (input: LatestChallengeShareInput): string | null => {
  const source = resolveLatestChallengeShareSource(input)
  if (!source) {
    return null
  }
  return createChallengeShareCode({
    seed: source.seed,
    presetId: source.presetId,
    forcedMutatorId: input.forcedMutatorId,
    floor: source.floor,
    score: source.score,
  })
}

export const resolveImportedChallengeShare = (
  rawPromptValue: string,
): ImportedChallengeShareDecision => {
  const normalized = rawPromptValue.trim()
  if (normalized.length <= 0) {
    return { kind: 'empty' }
  }
  const parsed = parseChallengeShareCode(normalized)
  if (!parsed.ok || !parsed.payload) {
    return { kind: 'invalid', reason: parsed.reason ?? 'invalid' }
  }
  return { kind: 'valid', payload: parsed.payload }
}
