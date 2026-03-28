import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveFeedbackVfxRender } from '../src/game/systems/feedbackVfxChannels'

test('danger channel keeps stronger outer ring emphasis than pickup', () => {
  const danger = resolveFeedbackVfxRender('danger', false)
  const pickup = resolveFeedbackVfxRender('pickup', false)
  assert.equal(danger.lineWidthMultiplier > pickup.lineWidthMultiplier, true)
  assert.equal(danger.alphaMultiplier > pickup.alphaMultiplier, true)
})

test('block channel uses calmer inner ring for readability separation', () => {
  const block = resolveFeedbackVfxRender('block', false)
  const danger = resolveFeedbackVfxRender('danger', false)
  assert.equal(block.innerRadiusMultiplier > danger.innerRadiusMultiplier, true)
})

test('reduced effects keeps channels distinguishable with lower intensity', () => {
  const rewardNormal = resolveFeedbackVfxRender('reward', false)
  const rewardReduced = resolveFeedbackVfxRender('reward', true)
  assert.equal(rewardReduced.alphaMultiplier < rewardNormal.alphaMultiplier, true)
  assert.equal(rewardReduced.lineWidthMultiplier, rewardNormal.lineWidthMultiplier)
})
