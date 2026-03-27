import assert from 'node:assert/strict'
import test from 'node:test'
import { BALANCE } from '../src/game/core/balance'
import { createDefaultProfileForTests, isChallengeMutatorsUnlocked } from '../src/game/core/meta'

test('mutator unlock policy is locked for default profile progress', () => {
  const profile = createDefaultProfileForTests()
  assert.equal(isChallengeMutatorsUnlocked(profile), false)
})

test('mutator unlock policy accepts any configured goal threshold in any mode', () => {
  const profile = createDefaultProfileForTests()
  const floorThreshold = BALANCE.challengeMutators.availability.unlockByGoalProgress.floor_5
  profile.goalProgress.floor_5 = floorThreshold
  profile.goalProgress.elite_hunter_12 = 0

  assert.equal(isChallengeMutatorsUnlocked(profile), true)
})

test('mutator unlock policy also unlocks via elite progression branch', () => {
  const profile = createDefaultProfileForTests()
  const eliteThreshold = BALANCE.challengeMutators.availability.unlockByGoalProgress.elite_hunter_12
  profile.goalProgress.floor_5 = 0
  profile.goalProgress.elite_hunter_12 = eliteThreshold

  assert.equal(isChallengeMutatorsUnlocked(profile), true)
})
