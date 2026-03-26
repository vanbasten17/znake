import assert from 'node:assert/strict'
import test from 'node:test'
import { createSeededRng } from '../src/game/simulation/rng'
import { pickOpenCell } from '../src/game/simulation/spawn'

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
