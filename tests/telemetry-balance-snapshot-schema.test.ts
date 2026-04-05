import assert from 'node:assert/strict'
import test from 'node:test'
import {
  BALANCE_SNAPSHOT_SCHEMA_VERSION,
  buildBalanceSnapshotEnvelope,
} from '../src/game/systems/telemetryBalanceSnapshot'
import { trackBalanceSnapshot } from '../src/game/systems/telemetryEvents'
import { resetTelemetryGateway, setTelemetryGateway } from '../src/game/systems/telemetryGateway'
import {
  buildDeathRecapCauseFixture,
  getScenarioFixtureSeed,
} from '../src/game/tooling/scenarioFixtures'

test('balance snapshot envelope is deterministic and schema-versioned', () => {
  const route = buildDeathRecapCauseFixture(
    getScenarioFixtureSeed('telemetry_balance_snapshot'),
  ).routeMastery
  const input = {
    runSeed: 404,
    floor: 8,
    score: 1220,
    kills: 44,
    shields: 2,
    snakeLength: 11,
    routeMastery: route,
    bodyEconomy: {
      rewardOverclockUsesInWindow: 1,
    },
  }
  const one = buildBalanceSnapshotEnvelope(input)
  const two = buildBalanceSnapshotEnvelope(input)
  assert.equal(one.schemaVersion, BALANCE_SNAPSHOT_SCHEMA_VERSION)
  assert.equal(one.eventType, 'balance_snapshot')
  assert.deepEqual(one, two)
})

test('balance snapshot event emits through telemetry gateway with normalized payload', () => {
  const events: Array<{ name: string; payload: Record<string, unknown> }> = []
  setTelemetryGateway({
    emit: (eventName, payload) => {
      events.push({ name: eventName, payload })
    },
  })
  try {
    trackBalanceSnapshot({ floor: 5, optional_field: undefined, score: 740 })
  } finally {
    resetTelemetryGateway()
  }
  assert.equal(events[0]?.name, 'balance_snapshot')
  assert.deepEqual(events[0]?.payload, {
    floor: 5,
    optional_field: null,
    score: 740,
  })
})
