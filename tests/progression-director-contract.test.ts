import assert from 'node:assert/strict'
import test from 'node:test'
import {
  BALANCE,
  getDepthBandForFloor,
  getProgressionDirectorSnapshot,
  getRoleSpawnPolicyWindowForFloor,
} from '../src/game/core/balance'

test('progression director snapshot is deterministic for equivalent inputs', () => {
  const first = getProgressionDirectorSnapshot({ floor: 7, spawnIndex: 4 })
  const second = getProgressionDirectorSnapshot({ floor: 7, spawnIndex: 4 })
  assert.deepEqual(first, second)
})

test('progression director snapshot maps depth bands to deterministic biome phases', () => {
  assert.equal(getProgressionDirectorSnapshot({ floor: 2, spawnIndex: 1 }).biomePhase, 'opening')
  assert.equal(getProgressionDirectorSnapshot({ floor: 7, spawnIndex: 1 }).biomePhase, 'escalation')
  assert.equal(getProgressionDirectorSnapshot({ floor: 12, spawnIndex: 1 }).biomePhase, 'apex')
})

test('progression director snapshot role window and caps match role composition resolver', () => {
  const floor = 12
  const spawnIndex = 3
  const unified = getProgressionDirectorSnapshot({ floor, spawnIndex })
  const roleWindow = getRoleSpawnPolicyWindowForFloor({ floor, spawnIndex })

  assert.equal(unified.roleWindowId, roleWindow.id)
  assert.deepEqual(unified.rolePolicy.maxActiveByRole, roleWindow.policy.maxActiveByRole)
  assert.deepEqual(unified.rolePolicy.minSpawnGapByRole, roleWindow.policy.minSpawnGapByRole)
  assert.equal(unified.depthBand, getDepthBandForFloor(floor))
})

test('progression director snapshot pressure and terrain knobs mirror centralized config', () => {
  const unified = getProgressionDirectorSnapshot({ floor: 9, spawnIndex: 2 })

  assert.deepEqual(unified.pressureBudget, {
    maxConcurrentPressureSources:
      BALANCE.predatorPreyPacing.guardrails.maxConcurrentPressureSources,
    minTicksBetweenPressureActions:
      BALANCE.predatorPreyPacing.guardrails.minTicksBetweenPressureActions,
    fallbackAction: BALANCE.predatorPreyPacing.guardrails.fallbackAction,
  })
  assert.deepEqual(unified.terrainModifiers, {
    zoneRadius: BALANCE.bodyTerrain.zoneRadius,
    laneDistance: BALANCE.bodyTerrain.laneDistance,
    minSafePocketNeighbors: BALANCE.bodyTerrain.guardrails.minSafePocketNeighbors,
    pressureSourceThreshold: BALANCE.bodyTerrain.guardrails.pressureSourceThreshold,
  })
})
