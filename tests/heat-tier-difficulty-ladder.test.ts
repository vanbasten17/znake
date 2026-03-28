import assert from 'node:assert/strict'
import test from 'node:test'
import { clampHeatTier, resolveHeatTierMutatorStack } from '../src/game/core/challengePresets'

test('heat tier clamp is bounded and deterministic', () => {
  assert.equal(clampHeatTier(-1), 0)
  assert.equal(clampHeatTier(1.9), 1)
  assert.equal(clampHeatTier(9), 3)
})

test('heat tier mutator stack rotates deterministically from forced mutator', () => {
  const stack = resolveHeatTierMutatorStack({
    heatTier: 3,
    forcedMutatorId: 'tight_turns',
  })
  assert.deepEqual(stack, ['tight_turns', 'lean_market', 'route_tension'])
})

test('heat tier stack is empty without forced mutator or tier', () => {
  assert.deepEqual(resolveHeatTierMutatorStack({ heatTier: 0, forcedMutatorId: 'tempo_spike' }), [])
  assert.deepEqual(resolveHeatTierMutatorStack({ heatTier: 2, forcedMutatorId: null }), [])
})
