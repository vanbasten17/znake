import assert from 'node:assert/strict'
import test from 'node:test'
import { BALANCE, createBaseRunConfig } from '../src/game/core/balance'
import { createDefaultProfileForTests } from '../src/game/core/meta'
import type { ChallengeMutatorRuntime } from '../src/game/core/types'
import {
  applyChallengeMutatorsToEnemyInterval,
  applyChallengeMutatorsToRoomObjectiveTarget,
  applyChallengeMutatorsToRouteChoice,
  applyChallengeMutatorsToRunConfig,
  composeMutatorEventChoiceContext,
  resolveChallengeMutators,
} from '../src/game/simulation/challengeMutators'

test('mutator drafting is deterministic for same seed and run context', () => {
  const cfg = createBaseRunConfig()

  const first = resolveChallengeMutators({
    runSeed: 24681357,
    floor: 4,
    available: true,
    baseConfig: cfg,
    baseEnemyInterval: 460,
  })
  const second = resolveChallengeMutators({
    runSeed: 24681357,
    floor: 4,
    available: true,
    baseConfig: cfg,
    baseEnemyInterval: 460,
  })

  assert.deepEqual(
    first.active.map((mutator) => mutator.id),
    second.active.map((mutator) => mutator.id),
  )
  assert.deepEqual(first.blocked, second.blocked)
})

test('mutators stay disabled until lightweight progression milestone is reached', () => {
  const cfg = createBaseRunConfig()
  const profile = createDefaultProfileForTests()
  const result = resolveChallengeMutators({
    runSeed: 7,
    floor: 5,
    available: false,
    baseConfig: cfg,
    baseEnemyInterval: 460,
  })

  assert.equal(result.active.length, 0)
  assert.equal(result.blocked.length, 0)
})

test('guardrails prevent blocked pair and pressure budget overflow across seeds', () => {
  const cfg = createBaseRunConfig()

  for (let seed = 1; seed <= 40; seed += 1) {
    const result = resolveChallengeMutators({
      runSeed: seed,
      floor: 6,
      available: true,
      baseConfig: cfg,
      baseEnemyInterval: 420,
    })

    const ids = new Set(result.active.map((mutator) => mutator.id))
    assert.equal(ids.has('tempo_spike') && ids.has('tight_turns'), false)

    const pressure = result.active.reduce((acc, mutator) => {
      const definition = BALANCE.challengeMutators.catalog.find((item) => item.id === mutator.id)
      return acc + (definition?.pressureCost ?? 0)
    }, 0)
    assert.equal(pressure <= BALANCE.challengeMutators.guardrails.pressureBudgetMax, true)
  }
})

test('mutator composition hooks alter config, objective target, route delta, and event context', () => {
  const cfg = createBaseRunConfig()
  const active: ChallengeMutatorRuntime[] = [
    {
      id: 'tempo_spike',
      label: 'TEMPO SPIKE',
      summary: 'test',
      domain: 'pressure',
      effects: {
        enemyIntervalMultiplier: 0.9,
        surviveObjectiveTargetMultiplier: 0.9,
      },
    },
    {
      id: 'lean_market',
      label: 'LEAN MARKET',
      summary: 'test',
      domain: 'economy',
      effects: {
        bodySpendMinLengthDelta: 1,
        eventMinSnakeLengthDelta: 1,
      },
    },
    {
      id: 'route_tension',
      label: 'ROUTE TENSION',
      summary: 'test',
      domain: 'routing',
      effects: {
        saferRouteEnemyDelta: -1,
        riskierRouteEnemyDelta: 1,
      },
    },
  ]

  applyChallengeMutatorsToRunConfig(cfg, active)
  assert.equal(cfg.bodySpendMinLength, createBaseRunConfig().bodySpendMinLength + 1)

  const enemyInterval = applyChallengeMutatorsToEnemyInterval(400, active)
  assert.equal(enemyInterval, 360)

  const surviveTarget = applyChallengeMutatorsToRoomObjectiveTarget({
    kind: 'survive',
    target: 10000,
    mutators: active,
  })
  assert.equal(surviveTarget, 9000)

  const safeEnemyDelta = applyChallengeMutatorsToRouteChoice({
    route: 'safer',
    enemyDelta: BALANCE.portal.routeChoice.safer.enemyDelta,
    mutators: active,
  })
  assert.equal(safeEnemyDelta, BALANCE.portal.routeChoice.safer.enemyDelta - 1)

  const eventContext = composeMutatorEventChoiceContext(
    {
      floor: 4,
      currentShields: 1,
      snakeLength: 6,
      minSnakeLength: 2,
      score: 20,
    },
    active,
  )
  assert.equal(eventContext.minSnakeLength, 3)
})
