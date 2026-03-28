import assert from 'node:assert/strict'
import test from 'node:test'
import type { DepthBalanceBandId } from '../src/game/core/types'
import { evaluateFairnessValidationSuite } from '../src/game/tooling/fairnessValidation'

const bands: DepthBalanceBandId[] = ['early', 'mid', 'late']

test('fairness validation report is deterministic for equivalent inputs', () => {
  const first = evaluateFairnessValidationSuite({
    nowIso: '2026-03-28T00:00:00.000Z',
    seeds: [11, 29],
    sampleSpawnAttemptsPerBand: 12,
  })
  const second = evaluateFairnessValidationSuite({
    nowIso: '2026-03-28T00:00:00.000Z',
    seeds: [11, 29],
    sampleSpawnAttemptsPerBand: 12,
  })
  assert.deepEqual(first, second)
})

test('fairness validation thresholds can force pass and fail outcomes deterministically', () => {
  const permissive = evaluateFairnessValidationSuite({
    nowIso: '2026-03-28T00:00:00.000Z',
    seeds: [11],
    sampleSpawnAttemptsPerBand: 8,
    thresholdsByBand: {
      early: { minReactionWindowMs: 1, minRecoverabilityRate: 0, maxCheapHitRate: 1 },
      mid: { minReactionWindowMs: 1, minRecoverabilityRate: 0, maxCheapHitRate: 1 },
      late: { minReactionWindowMs: 1, minRecoverabilityRate: 0, maxCheapHitRate: 1 },
    },
  })
  assert.equal(permissive.summary.passed, true)

  const strict = evaluateFairnessValidationSuite({
    nowIso: '2026-03-28T00:00:00.000Z',
    seeds: [11],
    sampleSpawnAttemptsPerBand: 8,
    thresholdsByBand: {
      early: { minReactionWindowMs: 10000, minRecoverabilityRate: 0.99, maxCheapHitRate: 0.01 },
      mid: { minReactionWindowMs: 10000, minRecoverabilityRate: 0.99, maxCheapHitRate: 0.01 },
      late: { minReactionWindowMs: 10000, minRecoverabilityRate: 0.99, maxCheapHitRate: 0.01 },
    },
  })
  assert.equal(strict.summary.passed, false)
  assert.equal(strict.summary.failures.length > 0, true)
  for (const band of bands) {
    assert.ok(strict.summary.failures.some((failure) => failure.startsWith(`${band}:`)))
  }
})
