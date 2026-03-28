import assert from 'node:assert/strict'
import test from 'node:test'
import {
  canonicalizeChallengeShareBody,
  createChallengeShareCode,
  parseChallengeShareCode,
} from '../src/game/core/challengeShare'
import type { ChallengeMutatorId, ChallengePresetId } from '../src/game/core/types'

const checksum = (raw: string): string => {
  let acc = 0
  for (let idx = 0; idx < raw.length; idx += 1) {
    acc = (acc + raw.charCodeAt(idx) * (idx + 3)) % 65521
  }
  return acc.toString(36).toUpperCase().padStart(3, '0').slice(-3)
}

test('challenge share code round-trips deterministic payload fields', () => {
  const code = createChallengeShareCode({
    seed: 123456,
    presetId: 'daily',
    forcedMutatorId: 'tempo_spike',
    floor: 9,
    score: 4200,
  })

  const parsed = parseChallengeShareCode(code)
  assert.equal(parsed.ok, true)
  assert.equal(parsed.reason, null)
  assert.deepEqual(parsed.payload, {
    version: 1,
    seed: 123456,
    presetId: 'daily',
    forcedMutatorId: 'tempo_spike',
    floor: 9,
    score: 4200,
  })
})

test('challenge share import accepts lowercase prefix casing', () => {
  const code = createChallengeShareCode({
    seed: 99,
    presetId: 'weekly',
    forcedMutatorId: 'route_tension',
    floor: 12,
    score: 777,
  })

  const lowerPrefixCode = code.replace(/^ZNK:/, 'znk:')
  const parsed = parseChallengeShareCode(lowerPrefixCode)

  assert.equal(parsed.ok, true)
  assert.equal(parsed.payload?.presetId, 'weekly')
  assert.equal(parsed.payload?.forcedMutatorId, 'route_tension')
})

test('challenge share parser canonicalizes URL-safe body markers', () => {
  assert.equal(canonicalizeChallengeShareBody('ab-c_d'), 'ab+c/d==')
})

test('challenge share import accepts URL-safe body equivalent to canonical body', () => {
  const code = createChallengeShareCode({
    seed: 91,
    presetId: 'daily',
    forcedMutatorId: 'tempo_spike',
    floor: 7,
    score: 880,
  })
  const [prefix, body, digest] = code.split(':')
  const urlSafeBody = body.replaceAll('+', '-').replaceAll('/', '_')
  const urlSafeCode = `${prefix}:${urlSafeBody}:${digest}`

  const parsedCanonical = parseChallengeShareCode(code)
  const parsedUrlSafe = parseChallengeShareCode(urlSafeCode)
  assert.equal(parsedCanonical.ok, true)
  assert.equal(parsedUrlSafe.ok, true)
  assert.deepEqual(parsedUrlSafe.payload, parsedCanonical.payload)
})

test('challenge share import rejects checksum mismatch', () => {
  const code = createChallengeShareCode({
    seed: 42,
    presetId: 'standard',
    forcedMutatorId: null,
    floor: 1,
    score: 2,
  })

  const tampered = code.endsWith('A') ? `${code.slice(0, -1)}B` : `${code.slice(0, -1)}A`
  const parsed = parseChallengeShareCode(tampered)

  assert.equal(parsed.ok, false)
  assert.equal(parsed.reason, 'checksum mismatch')
})

test('challenge share parser normalizes unknown preset/mutator and negative floor-score', () => {
  const code = createChallengeShareCode({
    seed: 77,
    presetId: 'unexpected' as ChallengePresetId,
    forcedMutatorId: 'unknown_mutator' as ChallengeMutatorId,
    floor: -3,
    score: -10,
  })

  const parsed = parseChallengeShareCode(code)
  assert.equal(parsed.ok, true)
  assert.equal(parsed.payload?.presetId, 'standard')
  assert.equal(parsed.payload?.forcedMutatorId, null)
  assert.equal(parsed.payload?.floor, 0)
  assert.equal(parsed.payload?.score, 0)
})

test('challenge share import rejects payload with unsupported version', () => {
  const body = Buffer.from('2|123|daily|tempo_spike|3|9').toString('base64').replaceAll('=', '')
  const code = `ZNK:${body}:${checksum(body)}`
  const parsed = parseChallengeShareCode(code)
  assert.equal(parsed.ok, false)
  assert.equal(parsed.reason, 'invalid payload')
})
