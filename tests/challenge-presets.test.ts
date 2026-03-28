import assert from 'node:assert/strict'
import test from 'node:test'
import {
  resolveChallengePreset,
  resolvePresetMutatorRuntime,
} from '../src/game/core/challengePresets'

test('daily preset is deterministic within the same UTC day bucket', () => {
  const first = resolveChallengePreset({
    presetId: 'daily',
    nowMs: Date.UTC(2026, 2, 28, 8, 0, 0),
    fallbackSeedParts: [1, 2, 3],
  })
  const second = resolveChallengePreset({
    presetId: 'daily',
    nowMs: Date.UTC(2026, 2, 28, 23, 59, 0),
    fallbackSeedParts: [4, 5, 6],
  })
  assert.equal(first.presetId, 'daily')
  assert.equal(first.runSeed, second.runSeed)
  assert.equal(first.forcedMutatorId, second.forcedMutatorId)
})

test('weekly preset is deterministic within the same UTC week bucket', () => {
  const first = resolveChallengePreset({
    presetId: 'weekly',
    nowMs: Date.UTC(2026, 2, 24, 8, 0, 0),
    fallbackSeedParts: [1, 2, 3],
  })
  const second = resolveChallengePreset({
    presetId: 'weekly',
    nowMs: Date.UTC(2026, 2, 27, 23, 59, 0),
    fallbackSeedParts: [4, 5, 6],
  })
  assert.equal(first.presetId, 'weekly')
  assert.equal(first.runSeed, second.runSeed)
  assert.equal(first.forcedMutatorId, second.forcedMutatorId)
})

test('standard preset keeps fallback seed behavior and no forced mutator', () => {
  const resolved = resolveChallengePreset({
    presetId: 'standard',
    nowMs: Date.UTC(2026, 2, 28, 12, 0, 0),
    fallbackSeedParts: [123, 456, 789],
  })
  assert.equal(resolved.presetId, 'standard')
  assert.equal(resolved.forcedMutatorId, null)
  assert.equal(Number.isInteger(resolved.runSeed), true)
})

test('forced preset mutator runtime obeys floor minimum', () => {
  const tooEarly = resolvePresetMutatorRuntime('tempo_spike', 1)
  const eligible = resolvePresetMutatorRuntime('tempo_spike', 2)
  assert.equal(tooEarly, null)
  assert.equal(eligible?.id, 'tempo_spike')
})
