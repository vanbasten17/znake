import assert from 'node:assert/strict'
import test from 'node:test'
import { UPGRADE_POOL, drawUpgradeDraft } from '../src/game/core/upgrades'

test('upgrade draft is deterministic for the same run seed and floor', () => {
  const a = drawUpgradeDraft({ runSeed: 1234, floor: 2, count: 3 })
  const b = drawUpgradeDraft({ runSeed: 1234, floor: 2, count: 3 })

  assert.deepEqual(
    a.map((upgrade) => upgrade.id),
    b.map((upgrade) => upgrade.id),
  )
})

test('early upgrade draft surfaces family contrast when available', () => {
  const picks = drawUpgradeDraft({ runSeed: 7, floor: 1, count: 3 })

  assert.equal(picks.length, 3)
  assert.deepEqual(
    picks.map((upgrade) => upgrade.family),
    ['aggro', 'control', 'survival'],
  )
})

test('upgrade catalog provides three families with at least three upgrades each', () => {
  const counts = UPGRADE_POOL.reduce<Record<string, number>>((acc, upgrade) => {
    acc[upgrade.family] = (acc[upgrade.family] ?? 0) + 1
    return acc
  }, {})

  assert.deepEqual(counts, {
    aggro: 3,
    control: 3,
    survival: 3,
  })
})
