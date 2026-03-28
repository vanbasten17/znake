import { STORAGE_KEYS } from './constants'
import type { ChallengePresetId, ReplayInputEvent, ReplaySnapshot } from './types'

const REPLAY_SCHEMA_VERSION = 1
const MAX_EVENTS = 2400

const sanitizeReplayEvent = (value: unknown): ReplayInputEvent | null => {
  if (!value || typeof value !== 'object') return null
  const event = value as Partial<ReplayInputEvent>
  if (
    typeof event.atMs !== 'number' ||
    (event.type !== 'dir' &&
      event.type !== 'turn' &&
      event.type !== 'ability' &&
      event.type !== 'pause' &&
      event.type !== 'key') ||
    typeof event.value !== 'string'
  ) {
    return null
  }
  return {
    atMs: Math.max(0, Math.floor(event.atMs)),
    type: event.type,
    value: event.value.slice(0, 24),
  }
}

const sanitizePresetId = (value: unknown): ChallengePresetId => {
  if (value === 'daily' || value === 'weekly') return value
  return 'standard'
}

export const persistLatestReplaySnapshot = (params: {
  runSeed: number
  challengePresetId: ChallengePresetId
  floor: number
  score: number
  deathReason: string
  events: ReadonlyArray<ReplayInputEvent>
}): ReplaySnapshot | null => {
  const snapshot: ReplaySnapshot = {
    schemaVersion: REPLAY_SCHEMA_VERSION,
    endedAtMs: Date.now(),
    runSeed: Math.floor(params.runSeed) >>> 0,
    challengePresetId: sanitizePresetId(params.challengePresetId),
    floor: Math.max(0, Math.floor(params.floor)),
    score: Math.max(0, Math.floor(params.score)),
    deathReason: params.deathReason,
    events: params.events.slice(0, MAX_EVENTS).map((event) => ({
      atMs: Math.max(0, Math.floor(event.atMs)),
      type: event.type,
      value: event.value.slice(0, 24),
    })),
  }
  try {
    localStorage.setItem(STORAGE_KEYS.latestReplay, JSON.stringify(snapshot))
    return snapshot
  } catch {
    return null
  }
}

export const loadLatestReplaySnapshot = (): ReplaySnapshot | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.latestReplay)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<ReplaySnapshot>
    if (
      parsed.schemaVersion !== REPLAY_SCHEMA_VERSION ||
      typeof parsed.endedAtMs !== 'number' ||
      typeof parsed.runSeed !== 'number' ||
      typeof parsed.floor !== 'number' ||
      typeof parsed.score !== 'number' ||
      typeof parsed.deathReason !== 'string' ||
      !Array.isArray(parsed.events)
    ) {
      return null
    }
    const events = parsed.events
      .map((event) => sanitizeReplayEvent(event))
      .filter((event): event is ReplayInputEvent => event !== null)
      .slice(0, MAX_EVENTS)
    return {
      schemaVersion: REPLAY_SCHEMA_VERSION,
      endedAtMs: Math.max(0, Math.floor(parsed.endedAtMs)),
      runSeed: Math.floor(parsed.runSeed) >>> 0,
      challengePresetId: sanitizePresetId(parsed.challengePresetId),
      floor: Math.max(0, Math.floor(parsed.floor)),
      score: Math.max(0, Math.floor(parsed.score)),
      deathReason: parsed.deathReason,
      events,
    }
  } catch {
    return null
  }
}
