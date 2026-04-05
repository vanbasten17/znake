import assert from 'node:assert/strict'
import test from 'node:test'
import { buildDeathRecap } from '../src/game/core/deathRecap'
import { UPGRADE_POOL } from '../src/game/core/upgrades'

test('death recap uses a deterministic dominant family when one family leads', () => {
  const recap = buildDeathRecap({
    deathReason: 'enemy',
    upgrades: [UPGRADE_POOL[0], UPGRADE_POOL[1], UPGRADE_POOL[3], UPGRADE_POOL[6]],
  })

  assert.equal(recap.deathReason, 'enemy')
  assert.equal(recap.buildLeaning, 'aggro')
  assert.equal(recap.cleanPlay.completedObjectives, 0)
  assert.deepEqual(
    recap.notableChoices.map((upgrade) => upgrade.id),
    ['phase_shift', 'attractor', 'void_shield'],
  )
  assert.deepEqual(recap.causeTags, ['enemy'])
})

test('death recap falls back to mixed when the run has no dominant family', () => {
  const recap = buildDeathRecap({
    deathReason: 'wall',
    upgrades: [UPGRADE_POOL[0], UPGRADE_POOL[3], UPGRADE_POOL[6]],
    deathReasonHistory: ['enemy', 'wall', 'wall', 'projectile', 'enemy'],
  })

  assert.equal(recap.buildLeaning, 'mixed')
  assert.deepEqual(recap.causeTags, ['wall', 'enemy', 'projectile'])
})

test('death recap falls back cleanly when the player dies before shaping a build', () => {
  const recap = buildDeathRecap({
    upgrades: [],
  })

  assert.equal(recap.deathReason, 'unknown')
  assert.equal(recap.buildLeaning, 'none')
  assert.equal(recap.cleanPlay.totalBonusScore, 0)
  assert.deepEqual(recap.notableChoices, [])
  assert.deepEqual(recap.causeTags, ['unknown'])
})
