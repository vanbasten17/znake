import assert from 'node:assert/strict'
import test from 'node:test'
import { getHudStatPriority, normalizeRunStatus } from '../src/game/systems/hudHierarchy'

test('hud stat priority keeps score/floor as primary and others secondary', () => {
  assert.equal(getHudStatPriority('score'), 'primary')
  assert.equal(getHudStatPriority('floor'), 'primary')
  assert.equal(getHudStatPriority('run'), 'secondary')
  assert.equal(getHudStatPriority('kills'), 'secondary')
})

test('run status normalization trims text and exposes active flag', () => {
  assert.deepEqual(normalizeRunStatus('  READY  '), { text: 'READY', isActive: true })
  assert.deepEqual(normalizeRunStatus('   '), { text: '', isActive: false })
})
