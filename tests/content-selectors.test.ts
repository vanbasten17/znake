import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildWeightedPowerupEntries,
  getSpecialEnemyChances,
  resolvePowerupPoolKind,
} from '../src/game/config/contentSelectors'

test('resolvePowerupPoolKind uses boss and kills routing', () => {
  assert.equal(resolvePowerupPoolKind({ isBossFloor: true, objectiveType: 'portal' }), 'boss')
  assert.equal(resolvePowerupPoolKind({ isBossFloor: false, objectiveType: 'kills' }), 'kills')
  assert.equal(resolvePowerupPoolKind({ isBossFloor: false, objectiveType: 'portal' }), 'standard')
})

test('special enemy chances are gated by floor thresholds', () => {
  const low = getSpecialEnemyChances({
    floor: 2,
    egg: { minFloor: 5, spawnChance: 0.2 },
    mirror: { minFloor: 6, spawnChance: 0.15 },
  })
  assert.deepEqual(low, { eggChance: 0, mirrorChance: 0 })

  const high = getSpecialEnemyChances({
    floor: 8,
    egg: { minFloor: 5, spawnChance: 0.2 },
    mirror: { minFloor: 6, spawnChance: 0.15 },
  })
  assert.deepEqual(high, { eggChance: 0.2, mirrorChance: 0.15 })
})

test('weighted powerup entries include all expected powerups', () => {
  const entries = buildWeightedPowerupEntries({ floor: 8, pool: 'standard' })
  const values = entries.map((entry) => entry.value)
  assert.deepEqual(values.sort(), ['ghost', 'score', 'shield', 'slow', 'venom'].sort())
  assert.ok(entries.every((entry) => entry.weight >= 0))
})
