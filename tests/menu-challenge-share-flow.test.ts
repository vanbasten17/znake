import assert from 'node:assert/strict'
import test from 'node:test'
import { parseChallengeShareCode } from '../src/game/core/challengeShare'
import {
  createLatestChallengeShareCode,
  resolveImportedChallengeShare,
} from '../src/game/scenes/menuScene/challengeShareFlow'

test('menu challenge-share flow returns null export when no replay or history seed exists', () => {
  const code = createLatestChallengeShareCode({
    latestReplay: null,
    latestRun: null,
    forcedMutatorId: null,
  })
  assert.equal(code, null)
})

test('menu challenge-share flow prioritizes replay snapshot values for export', () => {
  const code = createLatestChallengeShareCode({
    latestReplay: {
      schemaVersion: 1,
      endedAtMs: 1,
      runSeed: 444,
      challengePresetId: 'weekly',
      floor: 12,
      score: 8900,
      deathReason: 'test',
      events: [],
    },
    latestRun: {
      endedAt: 1,
      runSeed: 999,
      floor: 5,
      score: 1200,
      deathReason: 'legacy',
      causeTags: [],
      buildLeaning: 'balanced',
      challengePresetId: 'daily',
    },
    forcedMutatorId: 'route_tension',
  })

  assert.ok(code)
  const parsed = parseChallengeShareCode(code)
  assert.equal(parsed.ok, true)
  assert.equal(parsed.payload?.seed, 444)
  assert.equal(parsed.payload?.presetId, 'weekly')
  assert.equal(parsed.payload?.floor, 12)
  assert.equal(parsed.payload?.score, 8900)
  assert.equal(parsed.payload?.forcedMutatorId, 'route_tension')
})

test('menu challenge-share flow classifies imported prompt values', () => {
  assert.deepEqual(resolveImportedChallengeShare('   '), { kind: 'empty' })

  const invalid = resolveImportedChallengeShare('ZNK:BAD:000')
  assert.equal(invalid.kind, 'invalid')

  const validCode = createLatestChallengeShareCode({
    latestReplay: {
      schemaVersion: 1,
      endedAtMs: 1,
      runSeed: 77,
      challengePresetId: 'daily',
      floor: 3,
      score: 42,
      deathReason: 'test',
      events: [],
    },
    latestRun: null,
    forcedMutatorId: null,
  })
  assert.ok(validCode)
  const valid = resolveImportedChallengeShare(validCode)
  assert.equal(valid.kind, 'valid')
  if (valid.kind === 'valid') {
    assert.equal(valid.payload.seed, 77)
    assert.equal(valid.payload.presetId, 'daily')
  }
})
