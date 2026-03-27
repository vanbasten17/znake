import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createEmptyBossEncounterSummary,
  resolveBossHighestPhase,
} from '../src/game/simulation/eliteMiniboss'

test('createEmptyBossEncounterSummary returns bounded deterministic defaults', () => {
  const summary = createEmptyBossEncounterSummary()
  assert.equal(summary.encountered, false)
  assert.equal(summary.identityId, 'none')
  assert.equal(summary.highestPhase, 'alpha')
  assert.equal(summary.phaseWindowEvents, 0)
  assert.equal(summary.damageEvents, 0)
  assert.deepEqual(summary.failureReasonCounts, {
    late_react: 0,
    trapped_path: 0,
    telegraph_missed: 0,
    stacked_pressure: 0,
  })
})

test('resolveBossHighestPhase keeps rage once reached', () => {
  assert.equal(resolveBossHighestPhase('alpha', 'alpha'), 'alpha')
  assert.equal(resolveBossHighestPhase('alpha', 'rage'), 'rage')
  assert.equal(resolveBossHighestPhase('rage', 'alpha'), 'rage')
})
