import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveGameLoopPhase } from '../src/game/scenes/gameScene/loopStateMachine'

test('game loop state machine prioritizes pause before other states', () => {
  const phase = resolveGameLoopPhase({
    paused: true,
    referenceBoardMode: true,
    hitStopMsRemaining: 50,
    overlayBlocked: true,
  })
  assert.equal(phase, 'paused')
})

test('game loop state machine resolves reference board and hit-stop deterministically', () => {
  const reference = resolveGameLoopPhase({
    paused: false,
    referenceBoardMode: true,
    hitStopMsRemaining: 0,
    overlayBlocked: false,
  })
  const hitStop = resolveGameLoopPhase({
    paused: false,
    referenceBoardMode: false,
    hitStopMsRemaining: 20,
    overlayBlocked: true,
  })
  assert.equal(reference, 'reference_board')
  assert.equal(hitStop, 'hit_stop')
})

test('game loop state machine allows simulation only when no blockers are active', () => {
  const blocked = resolveGameLoopPhase({
    paused: false,
    referenceBoardMode: false,
    hitStopMsRemaining: 0,
    overlayBlocked: true,
  })
  const live = resolveGameLoopPhase({
    paused: false,
    referenceBoardMode: false,
    hitStopMsRemaining: 0,
    overlayBlocked: false,
  })
  assert.equal(blocked, 'overlay_blocked')
  assert.equal(live, 'simulate_and_render')
})
