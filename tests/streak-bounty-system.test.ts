import assert from 'node:assert/strict'
import test from 'node:test'
import { STREAK_BOUNTY_THRESHOLDS, resolveStreakBounty } from '../src/game/systems/streakBounty'

test('streak bounty awards trigger only at configured thresholds', () => {
  const miss = resolveStreakBounty({
    streak: STREAK_BOUNTY_THRESHOLDS[0] - 1,
    awardsClaimed: 0,
    scoreMultiplier: 1,
  })
  const hit = resolveStreakBounty({
    streak: STREAK_BOUNTY_THRESHOLDS[0],
    awardsClaimed: 0,
    scoreMultiplier: 1,
  })
  assert.equal(miss.bonusScore, 0)
  assert.equal(hit.bonusScore > 0, true)
  assert.equal(hit.awardsClaimed, 1)
})

test('streak bounty remains capped after final tier', () => {
  const capped = resolveStreakBounty({
    streak: 99,
    awardsClaimed: STREAK_BOUNTY_THRESHOLDS.length,
    scoreMultiplier: 1.2,
  })
  assert.equal(capped.bonusScore, 0)
  assert.equal(capped.awardsClaimed, STREAK_BOUNTY_THRESHOLDS.length)
})
