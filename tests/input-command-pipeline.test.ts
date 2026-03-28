import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveDirectionCommand } from '../src/game/systems/inputCommandPipeline'

test('direction pipeline rejects non-cardinal vectors before queue mutation', () => {
  const initialQueue = [{ x: 1, y: 0 }]
  const resolved = resolveDirectionCommand({
    next: { x: 1, y: 1 },
    currentDir: { x: 1, y: 0 },
    moveQueue: initialQueue,
    maxTurnQueue: 3,
  })
  assert.equal(resolved.accepted, false)
  assert.equal(resolved.nextQueue, initialQueue)
})

test('direction pipeline preserves anti-reverse and queue cap rules', () => {
  const reverse = resolveDirectionCommand({
    next: { x: -1, y: 0 },
    currentDir: { x: 1, y: 0 },
    moveQueue: [],
    maxTurnQueue: 2,
  })
  assert.equal(reverse.accepted, false)

  const capped = resolveDirectionCommand({
    next: { x: 0, y: 1 },
    currentDir: { x: 1, y: 0 },
    moveQueue: [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
    ],
    maxTurnQueue: 2,
  })
  assert.equal(capped.accepted, false)
})

test('direction pipeline accepts valid command and appends queue immutably', () => {
  const queue = [{ x: 0, y: -1 }]
  const resolved = resolveDirectionCommand({
    next: { x: 1, y: 0 },
    currentDir: { x: 0, y: 1 },
    moveQueue: queue,
    maxTurnQueue: 3,
  })
  assert.equal(resolved.accepted, true)
  assert.deepEqual(resolved.nextQueue, [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
  ])
  assert.notEqual(resolved.nextQueue, queue)
})
