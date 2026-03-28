import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveCycleProgress, resolveMotionCue } from '../src/game/systems/animationAnticipation'

test('cycle progress clamps and handles invalid intervals', () => {
  assert.equal(resolveCycleProgress(150, 300), 0.5)
  assert.equal(resolveCycleProgress(900, 300), 1)
  assert.equal(resolveCycleProgress(-10, 300), 0)
  assert.equal(resolveCycleProgress(100, 0), 0)
})

test('motion cue adds followthrough early and anticipation late', () => {
  const early = resolveMotionCue(0.05, false)
  const late = resolveMotionCue(0.92, false)
  const neutral = resolveMotionCue(0.4, false)

  assert.equal(early.sideScale > 1, true)
  assert.equal(late.forwardScale > 1, true)
  assert.equal(neutral.forwardScale > 0.99 && neutral.forwardScale < 1.01, true)
})

test('reduced effects keeps the same cue profile with softer amplitude', () => {
  const balanced = resolveMotionCue(0.9, false)
  const reduced = resolveMotionCue(0.9, true)
  assert.equal(reduced.forwardScale > 1, true)
  assert.equal(reduced.forwardScale < balanced.forwardScale, true)
  assert.equal(Math.abs(reduced.forwardOffsetCells) < Math.abs(balanced.forwardOffsetCells), true)
})
