import assert from 'node:assert/strict'
import test from 'node:test'
import { getProgressionDirectorSnapshot } from '../src/game/core/balance'
import { resolveAdaptiveRoomPressure } from '../src/game/systems/adaptiveRoomDirector'

test('adaptive room director relaxes pressure in recovery band', () => {
  const snapshot = getProgressionDirectorSnapshot({ floor: 10, spawnIndex: 1 })
  const result = resolveAdaptiveRoomPressure({
    snapshot,
    baseEnemyCount: 3,
    baseEnemyIntervalMs: 420,
    shields: 0,
  })
  assert.equal(result.pressureBand, 'recovery')
  assert.equal(result.enemyCount <= 3, true)
  assert.equal(result.enemyIntervalMs > 420, true)
})

test('adaptive room director increases pressure band when shields are high', () => {
  const snapshot = getProgressionDirectorSnapshot({ floor: 12, spawnIndex: 1 })
  const result = resolveAdaptiveRoomPressure({
    snapshot,
    baseEnemyCount: 2,
    baseEnemyIntervalMs: 380,
    shields: 2,
  })
  assert.equal(result.pressureBand, 'pressure')
  assert.equal(result.enemyCount >= 2, true)
  assert.equal(result.enemyIntervalMs <= 380, true)
})
