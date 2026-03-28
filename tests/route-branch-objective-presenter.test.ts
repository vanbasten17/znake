import assert from 'node:assert/strict'
import test from 'node:test'
import type { RunMapPreviewChoice } from '../src/game/core/types'
import { formatRouteBranchPreview } from '../src/game/systems/routeBranchObjectivePresenter'

const fakeChoice: RunMapPreviewChoice = {
  branchLabel: 'A',
  biomeId: 'core',
  roomType: 'elite',
  previewRoomTypes: ['elite', 'shop'],
}

test('route branch presenter includes branch, objective and reward tags', () => {
  const text = formatRouteBranchPreview({
    choice: fakeChoice,
    floor: 4,
    runObjectiveOffset: 0,
    getBiomeLabel: () => 'Core',
    getRoomTypeLabel: (roomType) => roomType.toUpperCase(),
    t: (key, options) => {
      if (key === 'game.routeChoiceCompact') {
        return `${options.index}:${options.room}`
      }
      if (key === 'game.routePreviewCompact') {
        return `${options.room}>${options.next}`
      }
      return key
    },
  })

  assert.match(text, /A:ELITE>SHOP · Core · OBJ:/)
  assert.match(text, /REWARD:ELITE/)
})
