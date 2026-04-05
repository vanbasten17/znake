import assert from 'node:assert/strict'
import test from 'node:test'
import {
  resolveRouteRiskForecast,
  resolveRouteRiskPreview,
} from '../src/game/simulation/routeRiskForecast'
import { buildRouteRiskPreviewFixture } from '../src/game/tooling/scenarioFixtures'

test('route risk forecast is deterministic for equivalent route preview input', () => {
  const fixture = buildRouteRiskPreviewFixture()
  const apply = () => resolveRouteRiskForecast(fixture)
  assert.deepEqual(apply(), apply())
})

test('route risk forecast labels low, medium, and high thresholds from weighted score', () => {
  const low = resolveRouteRiskForecast({
    roomType: 'rest',
    previewRoomTypes: ['rest', 'shop'],
  })
  assert.equal(low.level, 'low')
  assert.equal(low.score, -2)

  const medium = resolveRouteRiskForecast({
    roomType: 'combat',
    previewRoomTypes: ['combat', 'event'],
  })
  assert.equal(medium.level, 'medium')
  assert.equal(medium.score, 1)

  const high = resolveRouteRiskForecast({
    roomType: 'elite',
    previewRoomTypes: ['elite', 'combat', 'elite'],
  })
  assert.equal(high.level, 'high')
  assert.equal(high.score, 6)
})

test('route risk preview exposes deterministic bounded reason tags', () => {
  const preview = resolveRouteRiskPreview({
    roomType: 'elite',
    previewRoomTypes: ['elite', 'rest', 'elite'],
  })
  assert.equal(preview.level, 'high')
  assert.deepEqual(preview.reasonTags, ['elite_ahead', 'recovery_ahead'])
})
