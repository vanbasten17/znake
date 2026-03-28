import assert from 'node:assert/strict'
import test from 'node:test'
import { BALANCE } from '../src/game/core/balance'
import {
  clearEventChoiceProgress,
  createEventChoiceProgressState,
  draftEventChoice,
  draftEventChoiceConsequence,
  enterEventChoicePending,
  partitionDueEventChoiceConsequences,
  resolveEventChoiceConsequence,
  resolveEventChoiceOption,
  resolveEventChoiceProgress,
  setEventChoiceConfirmOption,
} from '../src/game/simulation/eventChoices'

test('event choice draft is deterministic for identical seed and context', () => {
  const params = {
    runSeed: 12345,
    floor: 4,
    roomNodeId: 'depth:3:path:rootaba',
    context: {
      floor: 4,
      currentShields: 1,
      snakeLength: 6,
      minSnakeLength: 2,
      score: 80,
    },
  } as const

  const first = draftEventChoice(params)
  const second = draftEventChoice(params)

  assert.ok(first)
  assert.ok(second)
  assert.equal(first?.definitionId, second?.definitionId)
  assert.deepEqual(
    first?.options.map((option) => option.id),
    second?.options.map((option) => option.id),
  )
})

test('draft filtering removes unpayable options and keeps eligible alternatives', () => {
  const draft = draftEventChoice({
    runSeed: 7,
    floor: 2,
    roomNodeId: 'depth:1:path:roota',
    forcedDefinitionId: 'risky_trade_molt',
    context: {
      floor: 2,
      currentShields: 0,
      snakeLength: 5,
      minSnakeLength: 2,
      score: 60,
    },
  })

  assert.ok(draft)
  const optionIds = new Set(draft?.options.map((option) => option.id))
  assert.equal(optionIds.has('trade_shield_for_length'), false)
  assert.equal(optionIds.has('trade_length_for_shield'), true)
  assert.equal(optionIds.has('trade_score_for_shield'), true)
})

test('recoverability guard excludes options that violate minimum snake length', () => {
  const draft = draftEventChoice({
    runSeed: 11,
    floor: 2,
    roomNodeId: 'depth:1:path:rootb',
    forcedDefinitionId: 'risky_trade_molt',
    context: {
      floor: 2,
      currentShields: 1,
      snakeLength: 3,
      minSnakeLength: 3,
      score: 100,
    },
  })

  assert.ok(draft)
  const optionIds = new Set(draft?.options.map((option) => option.id))
  assert.equal(optionIds.has('trade_length_for_shield'), false)
})

test('event choice resolution applies deterministic route-intent outcome', () => {
  const definition = BALANCE.eventChoices.definitions.find(
    (entry) => entry.id === 'route_split_event',
  )
  assert.ok(definition)
  const option = definition?.options.find((entry) => entry.id === 'route_risk_hunt')
  assert.ok(option)
  if (!option) {
    throw new Error('Expected route_risk_hunt option')
  }

  const resolved = resolveEventChoiceOption({
    option,
    currentShields: 1,
    currentPendingGrowth: 0,
    currentScore: 10,
    currentEnemyInterval: 400,
    currentMoveInterval: 160,
  })

  assert.equal(resolved.nextScore, 34)
  assert.equal(resolved.routeIntent, 'riskier')
  assert.equal(resolved.nextEnemyInterval, 360)
  assert.equal(resolved.nextMoveInterval, 160)
})

test('event choice progression state tracks pending, confirm, and resolved states', () => {
  const draft = draftEventChoice({
    runSeed: 9,
    floor: 3,
    roomNodeId: 'depth:2:path:rootab',
    context: {
      floor: 3,
      currentShields: 1,
      snakeLength: 6,
      minSnakeLength: 2,
      score: 50,
    },
  })
  assert.ok(draft)
  if (!draft) {
    throw new Error('Expected event choice draft')
  }

  const idle = createEventChoiceProgressState()
  assert.equal(idle.status, 'idle')

  const pending = enterEventChoicePending(draft)
  assert.equal(pending.status, 'pending')

  const selectedOption = draft.options[0]
  assert.ok(selectedOption)
  if (!selectedOption) {
    throw new Error('Expected at least one event option')
  }
  const withConfirm = setEventChoiceConfirmOption(pending, selectedOption.id)
  assert.equal(withConfirm.status, 'pending')
  if (withConfirm.status === 'pending') {
    assert.equal(withConfirm.confirmOptionId, selectedOption.id)
  }

  const resolved = resolveEventChoiceProgress(pending, selectedOption)
  assert.equal(resolved.status, 'resolved')

  const cleared = clearEventChoiceProgress()
  assert.equal(cleared.status, 'idle')
})

test('event choice consequence draft is deterministic and bounded by pending cap', () => {
  const first = draftEventChoiceConsequence({
    runSeed: 12345,
    floor: 4,
    optionId: 'route_risk_hunt',
    pendingCount: 0,
  })
  const second = draftEventChoiceConsequence({
    runSeed: 12345,
    floor: 4,
    optionId: 'route_risk_hunt',
    pendingCount: 0,
  })
  assert.ok(first)
  assert.ok(second)
  assert.equal(first?.id, second?.id)
  assert.equal(first?.triggerFloor, second?.triggerFloor)
  if (!first || !second) {
    throw new Error('Expected deterministic consequence draft')
  }
  assert.ok(first.triggerFloor >= 6)
  assert.ok(first.triggerFloor <= 7)

  const blocked = draftEventChoiceConsequence({
    runSeed: 12345,
    floor: 4,
    optionId: 'route_risk_hunt',
    pendingCount: BALANCE.eventChoices.consequenceMemory.maxPending,
  })
  assert.equal(blocked, null)
})

test('event choice consequence partition and resolution apply deterministic delayed effects', () => {
  const drafted = draftEventChoiceConsequence({
    runSeed: 55,
    floor: 3,
    optionId: 'route_safe_guarded',
    pendingCount: 0,
  })
  assert.ok(drafted)
  if (!drafted) {
    throw new Error('Expected drafted delayed consequence')
  }

  const partitionBefore = partitionDueEventChoiceConsequences([drafted], drafted.triggerFloor - 1)
  assert.equal(partitionBefore.due.length, 0)
  assert.equal(partitionBefore.remaining.length, 1)

  const partitionAt = partitionDueEventChoiceConsequences([drafted], drafted.triggerFloor)
  assert.equal(partitionAt.due.length, 1)
  assert.equal(partitionAt.remaining.length, 0)

  const resolved = resolveEventChoiceConsequence({
    consequence: drafted,
    currentShields: 0,
    currentPendingGrowth: 0,
    currentScore: 20,
    currentEnemyInterval: 400,
    currentMoveInterval: 160,
  })
  assert.equal(resolved.nextShields, 1)
  assert.equal(resolved.nextScore, 30)
  assert.equal(resolved.nextEnemyInterval, 400)
  assert.equal(resolved.nextMoveInterval, 160)
})
