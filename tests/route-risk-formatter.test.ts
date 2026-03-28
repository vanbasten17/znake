import assert from 'node:assert/strict'
import test from 'node:test'
import { formatRouteRiskCue } from '../src/game/ui/formatters/routeRisk'

test('route risk formatter includes symbol and localized label', () => {
  assert.equal(formatRouteRiskCue({ level: 'low', localizedLabel: 'LOW' }), '○ [LOW]')
  assert.equal(formatRouteRiskCue({ level: 'medium', localizedLabel: 'MEDIUM' }), '△ [MEDIUM]')
  assert.equal(formatRouteRiskCue({ level: 'high', localizedLabel: 'HIGH' }), '▲ [HIGH]')
})
