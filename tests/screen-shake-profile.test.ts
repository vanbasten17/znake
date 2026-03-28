import assert from 'node:assert/strict'
import test from 'node:test'
import {
  applyShakeDuration,
  resolveScreenShakeProfile,
} from '../src/game/systems/screenShakeProfile'

test('screen shake profile resolves off when reduced effects is enabled', () => {
  const profile = resolveScreenShakeProfile({
    reducedEffects: true,
    audioProfile: 'balanced',
  })
  assert.equal(profile.id, 'off')
  assert.equal(profile.durationMultiplier, 0)
  assert.equal(profile.amplitudeMultiplier, 0)
})

test('screen shake profile resolves soft for low fatigue audio profile', () => {
  const profile = resolveScreenShakeProfile({
    reducedEffects: false,
    audioProfile: 'low_fatigue',
  })
  assert.equal(profile.id, 'soft')
  assert.equal(profile.durationMultiplier > 0, true)
  assert.equal(profile.durationMultiplier < 1, true)
  assert.equal(profile.amplitudeMultiplier > 0, true)
  assert.equal(profile.amplitudeMultiplier < 1, true)
})

test('screen shake duration scales deterministically with profile', () => {
  const balanced = resolveScreenShakeProfile({
    reducedEffects: false,
    audioProfile: 'balanced',
  })
  const soft = resolveScreenShakeProfile({
    reducedEffects: false,
    audioProfile: 'low_fatigue',
  })
  const off = resolveScreenShakeProfile({
    reducedEffects: true,
    audioProfile: 'focused',
  })

  assert.equal(applyShakeDuration(0.4, balanced), 0.4)
  assert.equal(applyShakeDuration(0.4, off), 0)
  assert.equal(applyShakeDuration(0.4, soft) < 0.4, true)
})
