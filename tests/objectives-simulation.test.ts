import assert from 'node:assert/strict'
import test from 'node:test'
import {
  addCorePressureCoolant,
  advanceRoomObjectiveState,
  applyPortalBeaconAcceleration,
  createEmptyRunCleanPlaySummary,
  initCorePressureState,
  initPortalFlowState,
  initRoomObjectiveState,
  resetCorePressureTimer,
  resolveCleanPlayBonusForObjective,
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

test('clean-play resolution awards once when objective completes without hits', () => {
  let objective = initRoomObjectiveState({ kind: 'survive', target: 1000 })
  objective = advanceRoomObjectiveState(objective, { type: 'tick', deltaMs: 1000 }).state
  const first = resolveCleanPlayBonusForObjective({
    state: objective,
    runSummary: createEmptyRunCleanPlaySummary(),
    invalidateOnShieldHit: true,
    invalidateOnBodyHit: true,
    scoreByObjectiveKind: {
      survive: 20,
      collect_cores: 24,
      defeat_elite: 30,
      activate_terminals: 26,
    },
    maxAwardsPerRunByObjectiveKind: {
      survive: 3,
      collect_cores: 3,
      defeat_elite: 2,
      activate_terminals: 3,
    },
  })

  assert.equal(first.result.awarded, true)
  assert.equal(first.result.rewardAmount, 20)
  assert.equal(first.runSummary.totalBonusScore, 20)

  const second = resolveCleanPlayBonusForObjective({
    state: first.state,
    runSummary: first.runSummary,
    invalidateOnShieldHit: true,
    invalidateOnBodyHit: true,
    scoreByObjectiveKind: {
      survive: 20,
      collect_cores: 24,
      defeat_elite: 30,
      activate_terminals: 26,
    },
    maxAwardsPerRunByObjectiveKind: {
      survive: 3,
      collect_cores: 3,
      defeat_elite: 2,
      activate_terminals: 3,
    },
  })

  assert.equal(second.result.awarded, false)
  assert.equal(second.result.reason, 'already_resolved')
  assert.equal(second.runSummary.totalBonusScore, 20)
})

test('clean-play resolution is invalidated by shield/body hits', () => {
  let objective = initRoomObjectiveState({ kind: 'collect_cores', target: 2 })
  objective = advanceRoomObjectiveState(objective, {
    type: 'damage_taken',
    damageKind: 'shield',
  }).state
  objective = advanceRoomObjectiveState(objective, { type: 'core_collected', amount: 2 }).state

  const resolved = resolveCleanPlayBonusForObjective({
    state: objective,
    runSummary: createEmptyRunCleanPlaySummary(),
    invalidateOnShieldHit: true,
    invalidateOnBodyHit: true,
    scoreByObjectiveKind: {
      survive: 20,
      collect_cores: 24,
      defeat_elite: 30,
      activate_terminals: 26,
    },
    maxAwardsPerRunByObjectiveKind: {
      survive: 3,
      collect_cores: 3,
      defeat_elite: 2,
      activate_terminals: 3,
    },
  })

  assert.equal(resolved.result.eligible, false)
  assert.equal(resolved.result.awarded, false)
  assert.equal(resolved.result.reason, 'took_hit')
  assert.equal(resolved.runSummary.cleanClears, 0)
})

test('clean-play payout obeys objective-kind cap', () => {
  let objective = initRoomObjectiveState({ kind: 'defeat_elite', target: 1 })
  objective = advanceRoomObjectiveState(objective, { type: 'elite_defeated', amount: 1 }).state

  const resolved = resolveCleanPlayBonusForObjective({
    state: objective,
    runSummary: {
      completedObjectives: 0,
      cleanClears: 0,
      totalBonusScore: 60,
      awardedByKind: {
        survive: 0,
        collect_cores: 0,
        defeat_elite: 2,
        activate_terminals: 0,
      },
    },
    invalidateOnShieldHit: true,
    invalidateOnBodyHit: true,
    scoreByObjectiveKind: {
      survive: 20,
      collect_cores: 24,
      defeat_elite: 30,
      activate_terminals: 26,
    },
    maxAwardsPerRunByObjectiveKind: {
      survive: 3,
      collect_cores: 3,
      defeat_elite: 2,
      activate_terminals: 3,
    },
  })

  assert.equal(resolved.result.eligible, true)
  assert.equal(resolved.result.awarded, false)
  assert.equal(resolved.result.reason, 'objective_kind_cap_reached')
  assert.equal(resolved.runSummary.totalBonusScore, 60)
})
