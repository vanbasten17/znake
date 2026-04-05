import assert from 'node:assert/strict'
import test from 'node:test'
import {
  consumeBufferedDirectionCommand,
  resolveBufferedDirectionCommand,
  resolveDirectionCommand,
} from '../src/game/systems/inputCommandPipeline'
import { buildInputBufferFixture } from '../src/game/tooling/scenarioFixtures'

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
  assert.equal(resolved.rejectedByQueueCap, false)
})

test('direction pipeline preserves anti-reverse and queue cap rules', () => {
  const reverse = resolveDirectionCommand({
    next: { x: -1, y: 0 },
    currentDir: { x: 1, y: 0 },
    moveQueue: [],
    maxTurnQueue: 2,
  })
  assert.equal(reverse.accepted, false)
  assert.equal(reverse.rejectedByQueueCap, false)

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
  assert.equal(capped.rejectedByQueueCap, true)
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
  assert.equal(resolved.rejectedByQueueCap, false)
})

test('direction pipeline buffers near-window command when queue cap blocks input', () => {
  const fixture = buildInputBufferFixture(77)
  const resolved = resolveBufferedDirectionCommand({
    next: { x: 0, y: 1 },
    currentDir: { x: 1, y: 0 },
    moveQueue: [{ x: 0, y: -1 }],
    maxTurnQueue: fixture.maxTurnQueue,
    currentStep: fixture.currentStep,
    graceSteps: fixture.graceSteps,
    buffered: null,
  })
  assert.equal(resolved.accepted, false)
  assert.ok(resolved.nextBuffered)
  assert.equal(resolved.nextBuffered?.expiresAtStep, fixture.currentStep + fixture.graceSteps)
})

test('buffered command is consumed deterministically before expiration', () => {
  const consume = consumeBufferedDirectionCommand({
    currentDir: { x: 1, y: 0 },
    moveQueue: [],
    maxTurnQueue: 1,
    currentStep: 12,
    buffered: {
      direction: { x: 0, y: 1 },
      expiresAtStep: 12,
    },
  })
  assert.deepEqual(consume.nextQueue, [{ x: 0, y: 1 }])
  assert.equal(consume.nextBuffered, null)
})
