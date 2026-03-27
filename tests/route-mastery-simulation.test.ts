import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createEmptyRouteMasterySummary,
  getRouteMasteryReadout,
  recordRouteMasteryDecision,
} from '../src/game/simulation/routeMastery'

test('route mastery decision capture is deterministic for equivalent choices', () => {
  const apply = () => {
    let summary = createEmptyRouteMasterySummary()
    summary = recordRouteMasteryDecision({
      summary,
      currentBiomeId: 'void-depths',
      availableChoices: 2,
      choice: {
        roomType: 'elite',
        biomeId: 'ember-fields',
        previewRoomTypes: ['elite', 'combat', 'rest'],
      },
    })
    summary = recordRouteMasteryDecision({
      summary,
      currentBiomeId: 'ember-fields',
      availableChoices: 1,
      choice: {
        roomType: 'shop',
        biomeId: 'ember-fields',
        previewRoomTypes: ['shop', 'combat'],
      },
    })
    return summary
  }
  assert.deepEqual(apply(), apply())
})

test('route mastery readout reflects risk leaning and compact counters', () => {
  const summary = {
    routeDecisions: 3,
    branchDecisions: 2,
    eliteChoices: 2,
    nonCombatChoices: 0,
    biomePivotChoices: 1,
    previewEliteSeen: 3,
  }
  const readout = getRouteMasteryReadout(summary)
  assert.equal(readout.label, 'High-Risk Routing')
  assert.equal(readout.short, 'RM B2 E2 P1')
})
