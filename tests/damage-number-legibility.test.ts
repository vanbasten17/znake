import assert from 'node:assert/strict'
import test from 'node:test'
import {
  MAX_DAMAGE_LABELS,
  resolveDamageLabelSpec,
  resolveOverflowLabelsToDrop,
} from '../src/game/systems/damageNumberLegibility'

test('damage label specs are readable and reduced-effects shortens motion lifetime', () => {
  const base = resolveDamageLabelSpec('damage', false)
  const reduced = resolveDamageLabelSpec('damage', true)
  assert.equal(base.text, '-1')
  assert.equal(base.fontPx >= reduced.fontPx, true)
  assert.equal(base.durationMs > reduced.durationMs, true)
})

test('reward labels keep highlighted copy and color contract', () => {
  const reward = resolveDamageLabelSpec('reward', false)
  assert.equal(reward.text, 'BONUS')
  assert.equal(reward.color.startsWith('#'), true)
})

test('overflow helper drops exact number of oldest labels to maintain density cap', () => {
  assert.equal(resolveOverflowLabelsToDrop(0, 1), 0)
  assert.equal(resolveOverflowLabelsToDrop(MAX_DAMAGE_LABELS, 1), 1)
  assert.equal(resolveOverflowLabelsToDrop(MAX_DAMAGE_LABELS - 2, 3), 1)
  assert.equal(resolveOverflowLabelsToDrop(8, 2, 6), 4)
})
