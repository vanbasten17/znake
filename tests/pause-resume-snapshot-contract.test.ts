import assert from 'node:assert/strict'
import test from 'node:test'
import {
  capturePauseResumeSnapshot,
  restorePauseResumeSnapshot,
} from '../src/game/scenes/gameScene/pauseResumeSnapshot'

test('pause/resume snapshot capture is deterministic for identical input', () => {
  const input = {
    currentDir: { x: 1, y: 0 },
    queuedTurns: [{ x: 0, y: 1 }],
    rewardPending: true,
    routeOverlayOpen: false,
    inputOwner: 'overlay' as const,
  }
  assert.deepEqual(capturePauseResumeSnapshot(input), capturePauseResumeSnapshot(input))
})

test('pause/resume snapshot restore preserves payload and ordering', () => {
  const snapshot = capturePauseResumeSnapshot({
    currentDir: { x: 0, y: -1 },
    queuedTurns: [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ],
    rewardPending: false,
    routeOverlayOpen: true,
    inputOwner: 'simulation',
  })
  const restored = restorePauseResumeSnapshot(snapshot)
  assert.deepEqual(restored, snapshot)
  assert.notEqual(restored.queuedTurns, snapshot.queuedTurns)
})
