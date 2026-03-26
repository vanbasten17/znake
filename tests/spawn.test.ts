import assert from 'node:assert/strict'
import test from 'node:test'
import { createSeededRng } from '../src/game/simulation/rng'
import { isFairSpawnCell, pickOpenCell } from '../src/game/simulation/spawn'

test('pickOpenCell avoids occupied cells', () => {
  const walls = new Set<string>(['2,2', '3,2'])
  const picked = pickOpenCell({
    cols: 8,
    rows: 8,
    rng: createSeededRng(12),
    occupancy: {
      walls,
      snake: [{ x: 4, y: 4 }],
      enemies: [[{ x: 5, y: 5 }]],
      portals: [{ x: 1, y: 1 }],
      food: { x: 6, y: 6 },
      powerup: null,
      biomeItem: null,
      rift: null,
    },
  })
  const blocked = new Set<string>(['2,2', '3,2', '4,4', '5,5', '1,1', '6,6'])
  assert.equal(blocked.has(`${picked.x},${picked.y}`), false)
})

test('fair enemy spawn rejects near forward-lane pressure and low-agency cells', () => {
  const occupancy = {
    walls: new Set<string>(['8,7', '7,8']),
    snake: [{ x: 5, y: 5 }],
    enemies: [],
    portals: [],
    food: null,
    powerup: null,
    biomeItem: null,
    rift: null,
  }
  assert.equal(
    isFairSpawnCell({ x: 6, y: 5 }, 12, 12, occupancy, {
      playerHead: { x: 5, y: 5 },
      playerDir: { x: 1, y: 0 },
      minManhattanDistance: 4,
      avoidForwardLaneSteps: 3,
      minOpenNeighborCount: 2,
      bodyLength: 2,
    }),
    false,
  )
  assert.equal(
    isFairSpawnCell({ x: 8, y: 8 }, 12, 12, occupancy, {
      playerHead: { x: 5, y: 5 },
      playerDir: { x: 1, y: 0 },
      minManhattanDistance: 4,
      avoidForwardLaneSteps: 3,
      minOpenNeighborCount: 2,
      bodyLength: 2,
    }),
    false,
  )
  assert.equal(
    isFairSpawnCell({ x: 9, y: 4 }, 12, 12, occupancy, {
      playerHead: { x: 5, y: 5 },
      playerDir: { x: 1, y: 0 },
      minManhattanDistance: 4,
      avoidForwardLaneSteps: 3,
      minOpenNeighborCount: 2,
      bodyLength: 2,
    }),
    true,
  )
})

test('pickOpenCell prefers fair spawn candidates when they exist', () => {
  const picked = pickOpenCell({
    cols: 12,
    rows: 12,
    rng: createSeededRng(7),
    occupancy: {
      walls: new Set<string>(),
      snake: [{ x: 5, y: 5 }],
      enemies: [],
      portals: [],
      food: null,
      powerup: null,
      biomeItem: null,
      rift: null,
    },
    fairness: {
      playerHead: { x: 5, y: 5 },
      playerDir: { x: 1, y: 0 },
      minManhattanDistance: 4,
      avoidForwardLaneSteps: 3,
      minOpenNeighborCount: 2,
      bodyLength: 3,
    },
  })
  assert.equal(Math.abs(picked.x - 5) + Math.abs(picked.y - 5) >= 4, true)
  assert.equal(['6,5', '7,5', '8,5'].includes(`${picked.x},${picked.y}`), false)
})
