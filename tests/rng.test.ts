import assert from 'node:assert/strict'
import test from 'node:test'
import { createSeededRng } from '../src/game/simulation/rng'

test('seeded rng is deterministic for same seed', () => {
  const a = createSeededRng(1337)
  const b = createSeededRng(1337)
  const seqA = Array.from({ length: 8 }, () => a.nextFloat())
  const seqB = Array.from({ length: 8 }, () => b.nextFloat())
  assert.deepEqual(seqA, seqB)
})

test('weighted pick remains deterministic with same seed', () => {
  const picksA = createSeededRng(44)
  const picksB = createSeededRng(44)
  const source = [
    { value: 'a', weight: 1 },
    { value: 'b', weight: 2 },
    { value: 'c', weight: 3 },
  ] as const
  const outA = Array.from({ length: 12 }, () => picksA.weightedPick(source))
  const outB = Array.from({ length: 12 }, () => picksB.weightedPick(source))
  assert.deepEqual(outA, outB)
})
