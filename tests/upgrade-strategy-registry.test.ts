import assert from 'node:assert/strict'
import test from 'node:test'
import { createBaseRunConfig } from '../src/game/core/balance'
import {
  UPGRADE_POOL,
  applyUpgradeStrategy,
  resolveUpgradeStrategy,
} from '../src/game/core/upgrades'

test('upgrade strategy registry resolves known upgrade ids', () => {
  const upgrade = UPGRADE_POOL[0]
  assert.ok(upgrade)
  const strategy = resolveUpgradeStrategy(upgrade.id)
  assert.equal(typeof strategy, 'function')
})

test('apply upgrade strategy uses deterministic registered strategy', () => {
  const upgrade = UPGRADE_POOL.find((entry) => entry.id === 'void_shield')
  assert.ok(upgrade)
  const cfg = createBaseRunConfig()
  const baseShields = cfg.bonusShields
  applyUpgradeStrategy(cfg, upgrade)
  assert.equal(cfg.bonusShields, baseShields + 1)
})
