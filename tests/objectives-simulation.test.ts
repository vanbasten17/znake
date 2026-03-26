import assert from 'node:assert/strict'
import test from 'node:test'
import {
  addCorePressureCoolant,
  applyPortalBeaconAcceleration,
  initCorePressureState,
  initPortalFlowState,
  resetCorePressureTimer,
  shouldCompleteObjective,
  tickCorePressure,
  tickPortalFlow,
} from '../src/game/simulation/objectives'

test('portal flow emits spawn when countdown reaches zero', () => {
  const initial = initPortalFlowState({
    isBossFloor: false,
    floor: 1,
    objectiveType: 'portal',
    countdownBaseMs: 3000,
    countdownPerFloorMs: 200,
    countdownMinMs: 1000,
    graceMs: 2000,
  })
  const step = tickPortalFlow({
    state: initial,
    deltaMs: 3100,
    objectiveType: 'portal',
    isBossFloor: false,
    squeezeStepMs: 500,
    squeezeMaxInset: 4,
    isCellWall: () => false,
    snakeHead: { x: 2, y: 2 },
  })
  assert.equal(step.events.includes('spawn_portals'), true)
})

test('portal beacon acceleration cannot go below zero', () => {
  const accelerated = applyPortalBeaconAcceleration(
    {
      countdownMs: 200,
      graceMs: 0,
      graceSecondCue: -1,
      squeezeStepTimerMs: 0,
      squeezeInset: 0,
      active: true,
    },
    500,
  )
  assert.equal(accelerated.countdownMs, 0)
})

test('core pressure consumes coolant before decay', () => {
  const step = tickCorePressure({
    state: {
      active: true,
      intervalMs: 4000,
      remainingMs: 10,
      coolantCharges: 2,
    },
    deltaMs: 30,
    snakeLength: 8,
    decaySegments: 2,
  })
  assert.deepEqual(step.events, ['consume_coolant'])
  assert.equal(step.state.coolantCharges, 1)
})

test('core pressure emits fatal decay when snake too short', () => {
  const step = tickCorePressure({
    state: {
      active: true,
      intervalMs: 1000,
      remainingMs: 10,
      coolantCharges: 0,
    },
    deltaMs: 20,
    snakeLength: 1,
    decaySegments: 2,
  })
  assert.deepEqual(step.events, ['fatal_decay'])
})

test('objective completion helper supports score and kills routes', () => {
  assert.equal(
    shouldCompleteObjective({
      isBossFloor: false,
      objectiveType: 'score',
      scoreProgress: 120,
      scoreTarget: 100,
      killsProgress: 0,
      killsTarget: 2,
    }),
    true,
  )
  assert.equal(
    shouldCompleteObjective({
      isBossFloor: false,
      objectiveType: 'kills',
      scoreProgress: 0,
      scoreTarget: 100,
      killsProgress: 2,
      killsTarget: 2,
    }),
    true,
  )
  assert.equal(
    shouldCompleteObjective({
      isBossFloor: true,
      objectiveType: 'score',
      scoreProgress: 999,
      scoreTarget: 100,
      killsProgress: 99,
      killsTarget: 2,
    }),
    false,
  )
})

test('core pressure timer reset preserves charges', () => {
  const state = resetCorePressureTimer(
    initCorePressureState({
      enabled: true,
      isBossFloor: false,
      floor: 4,
      startFloor: 2,
      intervalBaseMs: 5000,
      intervalPerFloorMs: 500,
      intervalMinMs: 2000,
    }),
  )
  assert.equal(state.remainingMs, state.intervalMs)
})
