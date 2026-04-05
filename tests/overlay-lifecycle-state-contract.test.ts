import assert from 'node:assert/strict'
import test from 'node:test'
import {
  canTransitionOverlayLifecycle,
  resolveOverlayInputOwner,
} from '../src/game/scenes/gameScene/overlayLifecycleState'

test('overlay lifecycle rejects invalid transitions and accepts valid flow', () => {
  assert.equal(canTransitionOverlayLifecycle('idle', 'mounting'), true)
  assert.equal(canTransitionOverlayLifecycle('mounting', 'active'), true)
  assert.equal(canTransitionOverlayLifecycle('active', 'idle'), false)
  assert.equal(canTransitionOverlayLifecycle('unmounting', 'mounting'), false)
})

test('overlay lifecycle resolves deterministic input ownership handoff', () => {
  assert.equal(resolveOverlayInputOwner('idle'), 'simulation')
  assert.equal(resolveOverlayInputOwner('mounting'), 'overlay')
  assert.equal(resolveOverlayInputOwner('active'), 'overlay')
  assert.equal(resolveOverlayInputOwner('unmounting'), 'simulation')
})
