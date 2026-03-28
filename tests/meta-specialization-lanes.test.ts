import assert from 'node:assert/strict'
import test from 'node:test'
import { createDefaultProfileForTests } from '../src/game/core/meta'
import { getMetaSpecializationLanes } from '../src/game/core/metaBoard'

test('meta specialization lane states are derived deterministically from unlocked talents', () => {
  const profile = createDefaultProfileForTests()
  profile.unlockedTalents = ['speed_1', 'speed_2', 'survival_1']
  const lanes = getMetaSpecializationLanes(profile)
  const tempo = lanes.find((lane) => lane.branch === 'tempo')
  const stability = lanes.find((lane) => lane.branch === 'stability')
  const control = lanes.find((lane) => lane.branch === 'control')

  assert.equal(tempo?.specialization, 'committed')
  assert.equal(tempo?.dominant, true)
  assert.equal(stability?.specialization, 'balanced')
  assert.equal(control?.specialization, 'locked')
})

test('dominant lane is disabled on ties', () => {
  const profile = createDefaultProfileForTests()
  profile.unlockedTalents = ['speed_1', 'hunt_1']
  const lanes = getMetaSpecializationLanes(profile)
  assert.equal(
    lanes.some((lane) => lane.dominant),
    false,
  )
})
