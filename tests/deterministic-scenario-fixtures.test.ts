import assert from 'node:assert/strict'
import test from 'node:test'
import {
  SCENARIO_FIXTURE_SEEDS,
  buildDeathRecapCauseFixture,
  buildInputBufferFixture,
  buildRouteRiskPreviewFixture,
  getScenarioFixtureSeed,
} from '../src/game/tooling/scenarioFixtures'

test('scenario fixture seed registry stays stable and named', () => {
  assert.equal(
    getScenarioFixtureSeed('route_risk_preview'),
    SCENARIO_FIXTURE_SEEDS.route_risk_preview,
  )
  assert.equal(
    getScenarioFixtureSeed('input_buffer_turn'),
    SCENARIO_FIXTURE_SEEDS.input_buffer_turn,
  )
  assert.equal(
    getScenarioFixtureSeed('telemetry_balance_snapshot'),
    SCENARIO_FIXTURE_SEEDS.telemetry_balance_snapshot,
  )
})

test('route risk fixture builder is deterministic for equal seeds', () => {
  const seed = 4242
  assert.deepEqual(buildRouteRiskPreviewFixture(seed), buildRouteRiskPreviewFixture(seed))
})

test('input buffer fixture and recap fixture are deterministic for equal seeds', () => {
  const seed = 9090
  assert.deepEqual(buildInputBufferFixture(seed), buildInputBufferFixture(seed))
  assert.deepEqual(buildDeathRecapCauseFixture(seed), buildDeathRecapCauseFixture(seed))
})
