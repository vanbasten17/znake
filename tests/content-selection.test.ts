import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getPowerupPool,
  pickEliteKind,
  pickPowerupType,
  pickSpecialEnemyKind,
} from '../src/game/config/content'
import { createSeededRng } from '../src/game/simulation/rng'

test('powerup pool shape matches pick helper deterministically', () => {
  const floor = 8
  const objectiveType = 'kills'
  const pool = getPowerupPool({ floor, isBossFloor: false, objectiveType })
  assert.ok(pool.length > 0)
  const seeded = createSeededRng(77)
  const sampled = Array.from({ length: 20 }, () =>
    pickPowerupType({ floor, isBossFloor: false, objectiveType, rng: seeded }),
  )
  assert.ok(sampled.every((pick) => pool.includes(pick)))
})

test('elite kind pick remains deterministic for fixed seed', () => {
  const first = createSeededRng(121)
  const second = createSeededRng(121)
  const seqA = Array.from({ length: 12 }, () =>
    pickEliteKind({ floor: 7, rng: first, forceSpawn: true }),
  )
  const seqB = Array.from({ length: 12 }, () =>
    pickEliteKind({ floor: 7, rng: second, forceSpawn: true }),
  )
  assert.deepEqual(seqA, seqB)
})

test('special enemy pick remains deterministic for fixed seed', () => {
  const first = createSeededRng(212)
  const second = createSeededRng(212)
  const seqA = Array.from({ length: 18 }, () => pickSpecialEnemyKind({ floor: 10, rng: first }))
  const seqB = Array.from({ length: 18 }, () => pickSpecialEnemyKind({ floor: 10, rng: second }))
  assert.deepEqual(seqA, seqB)
})
