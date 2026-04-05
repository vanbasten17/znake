import assert from 'node:assert/strict'
import test from 'node:test'
import {
  FOOD_BONUS_TRIGGER_INTERVAL,
  createInitialFoodBonusWindowState,
  resolveFoodBonusScore,
} from '../src/game/core/foodBonusWindow'

test('food bonus window arms every 5 foods and applies on the next pickup', () => {
  let state = createInitialFoodBonusWindowState()
  const baseScore = 10
  const bonusScore = 5
  let total = 0

  for (let i = 1; i <= FOOD_BONUS_TRIGGER_INTERVAL; i += 1) {
    const resolved = resolveFoodBonusScore({
      state,
      baseScore,
      bonusScore,
    })
    total += resolved.scoreDelta
    state = resolved.nextState
    assert.equal(resolved.bonusApplied, false)
    assert.equal(resolved.bonusWindowStarted, i === FOOD_BONUS_TRIGGER_INTERVAL)
  }

  const nextPickup = resolveFoodBonusScore({
    state,
    baseScore,
    bonusScore,
  })
  total += nextPickup.scoreDelta
  assert.equal(nextPickup.bonusApplied, true)
  assert.equal(nextPickup.scoreDelta, baseScore + bonusScore)
  assert.equal(total, FOOD_BONUS_TRIGGER_INTERVAL * baseScore + baseScore + bonusScore)
})

test('food bonus window rearms deterministically after another 5 foods', () => {
  let state = createInitialFoodBonusWindowState()
  const baseScore = 12
  const bonusScore = 6
  const bonusAppliedAtFoodCounts: number[] = []

  for (let foodCount = 1; foodCount <= 12; foodCount += 1) {
    const resolved = resolveFoodBonusScore({
      state,
      baseScore,
      bonusScore,
    })
    state = resolved.nextState
    if (resolved.bonusApplied) {
      bonusAppliedAtFoodCounts.push(foodCount)
    }
  }

  assert.deepEqual(bonusAppliedAtFoodCounts, [6, 11])
})
