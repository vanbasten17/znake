import assert from 'node:assert/strict'
import test from 'node:test'
import { createBaseRunConfig } from '../src/game/core/balance'
import {
  collectBodyPulseHitEnemyIndexes,
  createInitialBodyEconomyRuntimeState,
  resetRewardOverclockWindow,
  resolveBodyPulseSpend,
  resolveRewardOverclockSpend,
  tickBodyEconomyRuntimeState,
} from '../src/game/simulation/bodyEconomy'

test('body pulse spend is blocked at minimum spendable length floor', () => {
  const cfg = createBaseRunConfig()
  const state = createInitialBodyEconomyRuntimeState()
  const result = resolveBodyPulseSpend({
    snakeLength: cfg.bodySpendMinLength,
    state,
    config: cfg,
  })
  assert.equal(result.outcome.status, 'blocked')
  assert.equal(result.outcome.blockedReason, 'below_floor')
  assert.equal(result.outcome.spentSegments, 0)
})

test('body pulse spend applies cooldown and enters on-cooldown state deterministically', () => {
  const cfg = createBaseRunConfig()
  const state = createInitialBodyEconomyRuntimeState()
  const first = resolveBodyPulseSpend({
    snakeLength: cfg.bodySpendMinLength + cfg.bodyPulseCost + 1,
    state,
    config: cfg,
  })
  assert.equal(first.outcome.status, 'applied')
  assert.equal(first.state.bodyPulseCooldownMs, cfg.bodyPulseCooldownMs)

  const cooled = tickBodyEconomyRuntimeState(first.state, cfg.bodyPulseCooldownMs - 1)
  const second = resolveBodyPulseSpend({
    snakeLength: cfg.bodySpendMinLength + cfg.bodyPulseCost + 1,
    state: cooled,
    config: cfg,
  })
  assert.equal(second.outcome.status, 'on_cooldown')
  assert.equal(second.outcome.blockedReason, 'on_cooldown')
})

test('reward overclock enforces one-reroll-per-objective and resets cleanly', () => {
  const cfg = createBaseRunConfig()
  const state = createInitialBodyEconomyRuntimeState()
  const first = resolveRewardOverclockSpend({
    snakeLength: cfg.bodySpendMinLength + cfg.rewardOverclockCost + 1,
    state,
    config: cfg,
    inRewardWindow: true,
  })
  assert.equal(first.outcome.status, 'applied')
  assert.equal(first.state.rewardOverclockUsesInWindow, 1)

  const second = resolveRewardOverclockSpend({
    snakeLength: cfg.bodySpendMinLength + cfg.rewardOverclockCost + 1,
    state: first.state,
    config: cfg,
    inRewardWindow: true,
  })
  assert.equal(second.outcome.status, 'blocked')
  assert.equal(second.outcome.blockedReason, 'usage_limit_reached')

  const reset = resetRewardOverclockWindow(first.state)
  const third = resolveRewardOverclockSpend({
    snakeLength: cfg.bodySpendMinLength + cfg.rewardOverclockCost + 1,
    state: reset,
    config: cfg,
    inRewardWindow: true,
  })
  assert.equal(third.outcome.status, 'applied')
})

test('damage and voluntary spends consume one shared body segment pool', () => {
  const cfg = createBaseRunConfig()
  const initialLength = 7
  const damageLoss = 2
  const afterDamage = Math.max(1, initialLength - damageLoss)
  const spend = resolveBodyPulseSpend({
    snakeLength: afterDamage,
    state: createInitialBodyEconomyRuntimeState(),
    config: cfg,
  })
  assert.equal(spend.outcome.status, 'applied')
  const afterSpend = afterDamage - spend.outcome.spentSegments
  assert.equal(afterSpend, initialLength - damageLoss - cfg.bodyPulseCost)
  assert.equal(afterSpend >= cfg.bodySpendMinLength, true)
})

test('body pulse target collection is deterministic and ignores boss targets', () => {
  const hits = collectBodyPulseHitEnemyIndexes({
    head: { x: 4, y: 4 },
    radius: 1,
    enemies: [
      { alive: true, kind: 'normal', body: [{ x: 4, y: 5 }] },
      { alive: true, kind: 'boss', body: [{ x: 4, y: 3 }] },
      { alive: true, kind: 'ambusher', body: [{ x: 8, y: 8 }] },
    ],
  })
  assert.deepEqual(hits, [0])
})

test('panic recovery window triggers deterministically at low health', () => {
  const cfg = createBaseRunConfig()
  const low = resolveBodyPulseSpend({
    snakeLength: cfg.bodySpendMinLength + 1,
    state: createInitialBodyEconomyRuntimeState(),
    config: cfg,
  })
  assert.equal(low.outcome.status, 'blocked')
  assert.equal(low.state.panicRecoveryActiveMs > 0, true)
  assert.equal(low.state.panicRecoveryCooldownMs > 0, true)
})

test('panic recovery allows one emergency body pulse below floor then expires', () => {
  const cfg = createBaseRunConfig()
  const armed = {
    ...createInitialBodyEconomyRuntimeState(),
    panicRecoveryActiveMs: 1200,
    panicRecoveryCooldownMs: 8000,
  }
  const spend = resolveBodyPulseSpend({
    snakeLength: cfg.bodySpendMinLength,
    state: armed,
    config: cfg,
  })
  assert.equal(spend.outcome.status, 'applied')
  assert.equal(spend.outcome.spentSegments, 0)
  assert.equal(spend.state.panicRecoveryActiveMs, 0)
})
