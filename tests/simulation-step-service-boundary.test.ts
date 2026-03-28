import assert from 'node:assert/strict'
import test from 'node:test'
import { runSimulationStep } from '../src/game/scenes/gameScene/simulationStepService'

test('simulation step service keeps deterministic operation ordering', () => {
  const calls: string[] = []
  runSimulationStep({
    updateEnemyMovement: () => calls.push('updateEnemyMovement'),
    ensureObjectiveEnemyAvailability: () => calls.push('ensureObjectiveEnemyAvailability'),
    ensureRoomObjectiveAvailability: () => calls.push('ensureRoomObjectiveAvailability'),
    updateVoidRift: () => calls.push('updateVoidRift'),
    updatePortalFlow: () => calls.push('updatePortalFlow'),
    updateCorePressure: () => calls.push('updateCorePressure'),
    updateBossSupport: () => calls.push('updateBossSupport'),
    updateVenomState: () => calls.push('updateVenomState'),
    updateBodyEconomyState: () => calls.push('updateBodyEconomyState'),
    updateContactGrace: () => calls.push('updateContactGrace'),
    updateRegen: () => calls.push('updateRegen'),
    updateSnakeMovement: () => calls.push('updateSnakeMovement'),
    updateMagnetFood: () => calls.push('updateMagnetFood'),
    updateParticles: () => calls.push('updateParticles'),
  })

  assert.deepEqual(calls, [
    'updateEnemyMovement',
    'ensureObjectiveEnemyAvailability',
    'ensureRoomObjectiveAvailability',
    'updateVoidRift',
    'updatePortalFlow',
    'updateCorePressure',
    'updateBossSupport',
    'updateVenomState',
    'updateBodyEconomyState',
    'updateContactGrace',
    'updateRegen',
    'updateSnakeMovement',
    'updateMagnetFood',
    'updateParticles',
  ])
})
