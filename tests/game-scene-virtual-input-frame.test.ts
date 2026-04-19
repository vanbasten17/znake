import assert from 'node:assert/strict'
import test from 'node:test'
import type { VirtualInput } from '../src/game/core/types'
import { consumeVirtualInputFrame } from '../src/game/scenes/gameScene/virtualInputFrameOrchestrator'

test('virtual input frame orchestration consumes inputs in stable order and clears flags', () => {
  const input: VirtualInput = {
    dir: 'left',
    turn: 'right',
    start: false,
    pause: true,
    ability: true,
  }
  const events: string[] = []

  consumeVirtualInputFrame(input, {
    onPause: () => {
      events.push('pause')
    },
    onDirection: (next) => {
      events.push(`dir:${next.x},${next.y}`)
    },
    onTurn: (turn) => {
      events.push(`turn:${turn}`)
    },
    onAbility: () => {
      events.push('ability')
    },
  })

  assert.deepEqual(events, ['pause', 'dir:-1,0', 'turn:right', 'ability'])
  assert.equal(input.pause, false)
  assert.equal(input.dir, null)
  assert.equal(input.turn, null)
  assert.equal(input.ability, false)
})
