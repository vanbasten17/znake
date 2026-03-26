import assert from 'node:assert/strict'
import test from 'node:test'
import { appendReplayInput, createRunReplayCapture } from '../src/game/simulation/replay'

test('replay capture binds seed and start timestamp', () => {
  const capture = createRunReplayCapture(12345, 987)
  assert.equal(capture.seed, 12345)
  assert.equal(capture.startedAtMs, 987)
  assert.deepEqual(capture.events, [])
})

test('replay input events are captured in relative milliseconds', () => {
  const capture = createRunReplayCapture(7, 1000)
  const withDir = appendReplayInput(capture, { nowMs: 1120, type: 'dir', value: 'up' })
  const withPause = appendReplayInput(withDir, { nowMs: 1705, type: 'pause', value: 'virtual' })
  assert.deepEqual(withPause.events, [
    { atMs: 120, type: 'dir', value: 'up' },
    { atMs: 705, type: 'pause', value: 'virtual' },
  ])
})
