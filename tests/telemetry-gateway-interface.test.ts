import assert from 'node:assert/strict'
import test from 'node:test'
import { trackGoalProgressed, trackRunStart } from '../src/game/systems/telemetryEvents'
import {
  normalizeTelemetryPayload,
  resetTelemetryGateway,
  setTelemetryGateway,
  subscribeTelemetryDomainEvents,
} from '../src/game/systems/telemetryGateway'

test('telemetry payload normalization converts undefined to null', () => {
  const normalized = normalizeTelemetryPayload({
    floor: 3,
    optional: undefined,
    mode: 'touch',
    fresh: true,
  })
  assert.deepEqual(normalized, {
    floor: 3,
    optional: null,
    mode: 'touch',
    fresh: true,
  })
})

test('telemetry events emit through active gateway in deterministic order', () => {
  const emitted: Array<{ eventName: string; payload: Record<string, unknown> }> = []
  setTelemetryGateway({
    emit: (eventName, payload) => {
      emitted.push({ eventName, payload })
    },
  })
  try {
    trackRunStart({ floor: 1, run_seed: 'abc', optional: undefined })
    trackGoalProgressed({ goal_id: 'elite_hunter_12', delta: 1 })
  } finally {
    resetTelemetryGateway()
  }

  assert.equal(emitted.length, 2)
  assert.equal(emitted[0]?.eventName, 'run_start')
  assert.equal(emitted[1]?.eventName, 'goal_progressed')
  assert.deepEqual(emitted[0]?.payload, {
    floor: 1,
    run_seed: 'abc',
    optional: null,
  })
})

test('telemetry gateway exposes typed domain event stream with stable ordering', () => {
  const seen: Array<{ eventName: string; sequence: number }> = []
  const unsubscribe = subscribeTelemetryDomainEvents((event, sequence) => {
    seen.push({ eventName: event.eventName, sequence })
  })
  try {
    trackRunStart({ floor: 1 })
    trackGoalProgressed({ goal_id: 'elite_hunter_12', delta: 1 })
  } finally {
    unsubscribe()
  }
  assert.deepEqual(seen.slice(-2), [
    { eventName: 'run_start', sequence: seen[seen.length - 2]?.sequence ?? 0 },
    { eventName: 'goal_progressed', sequence: seen[seen.length - 1]?.sequence ?? 1 },
  ])
  assert.equal((seen[seen.length - 1]?.sequence ?? 0) - (seen[seen.length - 2]?.sequence ?? 0), 1)
})
