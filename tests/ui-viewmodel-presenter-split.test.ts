import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildScoreHudViewModel,
  buildStatusHudViewModel,
} from '../src/game/systems/uiViewModelPresenter'

test('score hud view-model presenter builds deterministic text fields', () => {
  const viewModel = buildScoreHudViewModel({
    score: 1200,
    floor: 7,
    kills: 23,
    run: 4,
  })
  assert.deepEqual(viewModel, {
    scoreText: '1200',
    floorText: '7',
    killsText: '23',
    runText: '4',
  })
})

test('status presenter normalizes run status and preserves sibling fields', () => {
  const viewModel = buildStatusHudViewModel({
    runStatusText: '   ',
    objectiveStatusText: 'Collect 3',
    routeStatusText: 'Safer',
  })
  assert.equal(viewModel.runStatusText, '')
  assert.equal(viewModel.runStatusActive, false)
  assert.equal(viewModel.objectiveStatusText, 'Collect 3')
  assert.equal(viewModel.routeStatusText, 'Safer')
})
