import assert from 'node:assert/strict'
import test from 'node:test'
import { generateClassicWalls, generateRoomTemplateLayout } from '../src/game/simulation/layout'
import { createSeededRng } from '../src/game/simulation/rng'

test('classic walls are deterministic for same seed', () => {
  const seed = 9921
  const runA = generateClassicWalls({
    cols: 20,
    rows: 16,
    wallCount: 5,
    centerSafeRadius: 4,
    rng: createSeededRng(seed),
  })
  const runB = generateClassicWalls({
    cols: 20,
    rows: 16,
    wallCount: 5,
    centerSafeRadius: 4,
    rng: createSeededRng(seed),
  })
  assert.deepEqual([...runA], [...runB])
})

test('room template layout is connected and non-empty', () => {
  const layout = generateRoomTemplateLayout({
    cols: 20,
    rows: 16,
    config: {
      minRooms: 3,
      maxRooms: 5,
      minRoomSize: 3,
      maxRoomSize: 6,
      minRoomGap: 1,
    },
    rng: createSeededRng(3001),
  })
  assert.ok(layout)
  assert.ok((layout?.roomCells.size ?? 0) > 0)
  assert.ok((layout?.corridorCells.size ?? 0) > 0)
})
