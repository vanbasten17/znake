import type { ReplayInputEvent, ReplayInputType } from '../core/types'

export type RunReplayCapture = {
  seed: number
  startedAtMs: number
  events: ReplayInputEvent[]
}

export const createRunReplayCapture = (seed: number, startedAtMs: number): RunReplayCapture => ({
  seed: seed >>> 0,
  startedAtMs: Math.max(0, Math.floor(startedAtMs)),
  events: [],
})

export const appendReplayInput = (
  capture: RunReplayCapture,
  params: { nowMs: number; type: ReplayInputType; value: string },
): RunReplayCapture => {
  const atMs = Math.max(0, Math.floor(params.nowMs - capture.startedAtMs))
  return {
    ...capture,
    events: [...capture.events, { atMs, type: params.type, value: params.value }],
  }
}
