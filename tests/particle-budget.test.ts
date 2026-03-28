import assert from 'node:assert/strict'
import test from 'node:test'
import {
  resolveParticleBudgetProfile,
  resolveParticleSpawnBudget,
} from '../src/game/systems/particleBudget'

test('particle budget profile resolves reduced tier deterministically', () => {
  const reduced = resolveParticleBudgetProfile(true)
  const balanced = resolveParticleBudgetProfile(false)

  assert.equal(reduced.id, 'reduced')
  assert.equal(reduced.maxSpawnPerFrame < balanced.maxSpawnPerFrame, true)
  assert.equal(reduced.maxActive < balanced.maxActive, true)
})

test('particle spawn budget applies density scaling and per-frame cap', () => {
  const profile = resolveParticleBudgetProfile(false)
  const firstBurst = resolveParticleSpawnBudget({
    requestedCount: 50,
    activeCount: 100,
    spawnedThisFrame: 30,
    profile,
  })
  assert.equal(firstBurst.emitCount, 42)
  assert.equal(firstBurst.nextSpawnedThisFrame, 72)

  const secondBurst = resolveParticleSpawnBudget({
    requestedCount: 8,
    activeCount: 142,
    spawnedThisFrame: firstBurst.nextSpawnedThisFrame,
    profile,
  })
  assert.equal(secondBurst.emitCount, 0)
  assert.equal(secondBurst.nextSpawnedThisFrame, 72)
})

test('particle spawn budget respects reduced tier active-pool cap', () => {
  const profile = resolveParticleBudgetProfile(true)
  const allocation = resolveParticleSpawnBudget({
    requestedCount: 12,
    activeCount: 139,
    spawnedThisFrame: 0,
    profile,
  })
  assert.equal(allocation.emitCount, 1)
  assert.equal(allocation.nextSpawnedThisFrame, 1)
})
