import assert from 'node:assert/strict'
import test from 'node:test'
import { BALANCE, createBaseRunConfig } from '../src/game/core/balance'
import {
  applyRelicEffect,
  applyTalentEffects,
  createDefaultProfileForTests,
} from '../src/game/core/meta'
import { applyRewardEffectsToConfig } from '../src/game/core/rewards'
import { UPGRADE_POOL } from '../src/game/core/upgrades'

test('default run-start composition keeps baseline 3 with no additive bonuses', () => {
  const cfg = createBaseRunConfig()
  const runStartLength = BALANCE.run.baseSnakeLength + cfg.bonusStartLength

  assert.equal(BALANCE.run.baseSnakeLength, 3)
  assert.equal(cfg.bonusStartLength, 0)
  assert.equal(runStartLength, 3)
})

test('run-start composition stacks additive progression bonuses deterministically', () => {
  const cfg = createBaseRunConfig()
  const profile = createDefaultProfileForTests()
  profile.unlockedTalents = ['survival_2']

  applyTalentEffects(cfg, profile)
  applyRelicEffect(cfg, 'plasma_core')
  applyRewardEffectsToConfig(cfg, { bonusLength: 2 })

  const biomass = UPGRADE_POOL.find((upgrade) => upgrade.id === 'biomass')
  assert.ok(biomass)
  biomass.apply(cfg)

  assert.equal(cfg.bonusStartLength, 11)
  assert.equal(BALANCE.run.baseSnakeLength + cfg.bonusStartLength, 14)

  const repeatCfg = createBaseRunConfig()
  repeatCfg.bonusStartLength = cfg.bonusStartLength
  assert.equal(BALANCE.run.baseSnakeLength + repeatCfg.bonusStartLength, 14)
})
