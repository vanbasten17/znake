import { STORAGE_KEYS } from './constants'
import type { ChallengePresetId } from './types'

export type RunHistoryEntry = {
  endedAt: number
  runSeed: number
  floor: number
  score: number
  deathReason: string
  causeTags: string[]
  buildLeaning: string
  challengePresetId: ChallengePresetId
}

const MAX_ENTRIES = 6

const normalizeEntry = (value: unknown): RunHistoryEntry | null => {
  if (!value || typeof value !== 'object') return null
  const entry = value as Partial<RunHistoryEntry>
  if (
    typeof entry.endedAt !== 'number' ||
    typeof entry.runSeed !== 'number' ||
    typeof entry.floor !== 'number' ||
    typeof entry.score !== 'number' ||
    typeof entry.deathReason !== 'string' ||
    !Array.isArray(entry.causeTags) ||
    entry.causeTags.some((tag) => typeof tag !== 'string') ||
    typeof entry.buildLeaning !== 'string' ||
    (entry.challengePresetId !== 'standard' &&
      entry.challengePresetId !== 'daily' &&
      entry.challengePresetId !== 'weekly')
  ) {
    return null
  }
  return {
    endedAt: Math.max(0, Math.floor(entry.endedAt)),
    runSeed: Math.floor(entry.runSeed) >>> 0,
    floor: Math.max(0, Math.floor(entry.floor)),
    score: Math.max(0, Math.floor(entry.score)),
    deathReason: entry.deathReason,
    causeTags: entry.causeTags.slice(0, 3),
    buildLeaning: entry.buildLeaning,
    challengePresetId: entry.challengePresetId,
  }
}

export const loadRunHistory = (): RunHistoryEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.runHistory)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map(normalizeEntry)
      .filter((entry): entry is RunHistoryEntry => entry !== null)
      .sort((left, right) => right.endedAt - left.endedAt)
      .slice(0, MAX_ENTRIES)
  } catch {
    return []
  }
}

const persistRunHistory = (entries: ReadonlyArray<RunHistoryEntry>): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.runHistory, JSON.stringify(entries))
  } catch {
    // Best-effort persistence only.
  }
}

export const appendRunHistoryEntry = (entry: RunHistoryEntry): RunHistoryEntry[] => {
  const next = [entry, ...loadRunHistory()].slice(0, MAX_ENTRIES)
  persistRunHistory(next)
  return next
}
