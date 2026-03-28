import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveRouteChoiceInsights } from '../src/game/simulation/routeChoiceInsights'

test('route choice insights are deterministic for equivalent inputs', () => {
  const apply = () =>
    resolveRouteChoiceInsights(
      {
        roomType: 'elite',
        biomeId: 'ember-fields',
        depthBand: 'mid',
        previewRoomTypes: ['elite', 'combat', 'rest'],
      },
      'void-depths',
    )
  assert.deepEqual(apply(), apply())
})

test('route choice insights expose pressure, counts, depth, pivot, and future preview fields', () => {
  const insights = resolveRouteChoiceInsights(
    {
      roomType: 'elite',
      biomeId: 'ember-fields',
      depthBand: 'late',
      previewRoomTypes: ['elite', 'elite', 'shop'],
    },
    'void-depths',
  )
  assert.equal(insights.riskLevel, 'high')
  assert.equal(insights.riskScore, 4)
  assert.equal(insights.pressureDelta, 3)
  assert.equal(insights.eliteAheadCount, 1)
  assert.equal(insights.recoveryAheadCount, 1)
  assert.equal(insights.depthBand, 'late')
  assert.equal(insights.biomePivot, true)
  assert.equal(insights.futureOne, 'elite')
  assert.equal(insights.futureTwo, 'shop')
})
