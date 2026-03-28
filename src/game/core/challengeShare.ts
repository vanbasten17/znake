import type { ChallengeMutatorId, ChallengePresetId } from './types'

export type ChallengeSharePayload = {
  version: number
  seed: number
  presetId: ChallengePresetId
  forcedMutatorId: ChallengeMutatorId | null
  floor: number
  score: number
}

export type ParsedChallengeShare = {
  ok: boolean
  payload: ChallengeSharePayload | null
  reason: string | null
}

const VERSION = 1
const PREFIX = 'ZNK'

const normalizePreset = (value: unknown): ChallengePresetId => {
  if (value === 'daily' || value === 'weekly') return value
  return 'standard'
}

const normalizeMutatorId = (value: unknown): ChallengeMutatorId | null => {
  if (value === 'tempo_spike') return value
  if (value === 'tight_turns') return value
  if (value === 'lean_market') return value
  if (value === 'route_tension') return value
  return null
}

const checksum = (raw: string): string => {
  let acc = 0
  for (let idx = 0; idx < raw.length; idx += 1) {
    acc = (acc + raw.charCodeAt(idx) * (idx + 3)) % 65521
  }
  return acc.toString(36).toUpperCase().padStart(3, '0').slice(-3)
}

const encodePayload = (payload: ChallengeSharePayload): string => {
  const packed = [
    payload.version,
    payload.seed >>> 0,
    payload.presetId,
    payload.forcedMutatorId ?? '-',
    Math.max(0, Math.floor(payload.floor)),
    Math.max(0, Math.floor(payload.score)),
  ].join('|')
  const body = btoa(packed).replaceAll('=', '')
  return `${PREFIX}:${body}:${checksum(body)}`
}

const decodePayload = (body: string): ChallengeSharePayload | null => {
  try {
    const decoded = atob(body)
    const [versionRaw, seedRaw, presetRaw, mutatorRaw, floorRaw, scoreRaw] = decoded.split('|')
    const version = Number.parseInt(versionRaw ?? '', 10)
    const seed = Number.parseInt(seedRaw ?? '', 10)
    const floor = Number.parseInt(floorRaw ?? '', 10)
    const score = Number.parseInt(scoreRaw ?? '', 10)
    if (!Number.isFinite(version) || version !== VERSION || !Number.isFinite(seed)) {
      return null
    }
    return {
      version,
      seed: Math.floor(seed) >>> 0,
      presetId: normalizePreset(presetRaw),
      forcedMutatorId: normalizeMutatorId(mutatorRaw === '-' ? null : mutatorRaw),
      floor: Number.isFinite(floor) ? Math.max(0, Math.floor(floor)) : 0,
      score: Number.isFinite(score) ? Math.max(0, Math.floor(score)) : 0,
    }
  } catch {
    return null
  }
}

export const createChallengeShareCode = (params: {
  seed: number
  presetId: ChallengePresetId
  forcedMutatorId: ChallengeMutatorId | null
  floor: number
  score: number
}): string =>
  encodePayload({
    version: VERSION,
    seed: params.seed,
    presetId: params.presetId,
    forcedMutatorId: params.forcedMutatorId,
    floor: params.floor,
    score: params.score,
  })

export const parseChallengeShareCode = (rawCode: string): ParsedChallengeShare => {
  const normalized = rawCode.trim()
  const [prefix, body, digest] = normalized.split(':')
  if (prefix !== PREFIX || !body || !digest) {
    return { ok: false, payload: null, reason: 'invalid format' }
  }
  if (checksum(body) !== digest.toUpperCase()) {
    return { ok: false, payload: null, reason: 'checksum mismatch' }
  }
  const payload = decodePayload(body)
  if (!payload) {
    return { ok: false, payload: null, reason: 'invalid payload' }
  }
  return { ok: true, payload, reason: null }
}
