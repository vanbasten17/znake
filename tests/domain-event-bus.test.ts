import assert from 'node:assert/strict'
import test from 'node:test'
import { createDomainEventBus } from '../src/game/systems/domainEventBus'

test('domain event bus publishes deterministic sequence order', () => {
  const bus = createDomainEventBus<{ type: string }>()
  const seen: Array<{ type: string; sequence: number }> = []
  bus.subscribe((event, sequence) => {
    seen.push({ type: event.type, sequence })
  })

  const first = bus.publish({ type: 'run_start' })
  const second = bus.publish({ type: 'goal_progressed' })

  assert.equal(first, 0)
  assert.equal(second, 1)
  assert.deepEqual(seen, [
    { type: 'run_start', sequence: 0 },
    { type: 'goal_progressed', sequence: 1 },
  ])
})

test('domain event bus unsubscribe detaches listener', () => {
  const bus = createDomainEventBus<{ type: string }>()
  let count = 0
  const unsubscribe = bus.subscribe(() => {
    count += 1
  })
  bus.publish({ type: 'a' })
  unsubscribe()
  bus.publish({ type: 'b' })
  assert.equal(count, 1)
})
