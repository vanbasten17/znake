import assert from 'node:assert/strict'
import test from 'node:test'
import { BALANCE } from '../src/game/core/balance'
import { resolveRewardRerollCost } from '../src/game/simulation/rewardRerollEconomy'

test('reward reroll cost scales deterministically with reroll count and guardrails', () => {
  const first = resolveRewardRerollCost({
    baseCost: 1,
    rerollCountInWindow: 0,
    floor: 2,
    objectiveKind: 'survive',
    config: BALANCE.rewards.reroll,
  })
  const later = resolveRewardRerollCost({
    baseCost: 1,
    rerollCountInWindow: 3,
    floor: 2,
    objectiveKind: 'survive',
    config: BALANCE.rewards.reroll,
  })
  assert.equal(first, 1)
  assert.ok(later > first)
  assert.ok(later <= BALANCE.rewards.reroll.maxCost)
})

test('reward reroll cost reflects floor and objective multipliers', () => {
  const midElite = resolveRewardRerollCost({
    baseCost: 1,
    rerollCountInWindow: 1,
    floor: 7,
    objectiveKind: 'defeat_elite',
    config: BALANCE.rewards.reroll,
  })
  const earlySurvive = resolveRewardRerollCost({
    baseCost: 1,
    rerollCountInWindow: 1,
    floor: 3,
    objectiveKind: 'survive',
    config: BALANCE.rewards.reroll,
  })
  assert.ok(midElite >= earlySurvive)
})
