import assert from 'node:assert/strict'
import test from 'node:test'
import { BASE_CONTENT_PACK } from '../src/game/core/contentPacks'
import { resolveContentPackFromRepository } from '../src/game/core/contentRepository'

test('content repository port uses injected repository when provided', () => {
  const resolved = resolveContentPackFromRepository('any-pack', {
    resolvePack: (requestedPackId) => ({
      pack: {
        ...BASE_CONTENT_PACK,
        id: 'injected-pack',
        label: `Injected ${requestedPackId}`,
      },
      fallbackApplied: false,
    }),
  })

  assert.equal(resolved.pack.id, 'injected-pack')
  assert.equal(resolved.pack.label, 'Injected any-pack')
  assert.equal(resolved.fallbackApplied, false)
})

test('content repository port keeps fallback behavior with default repository', () => {
  const resolved = resolveContentPackFromRepository('unknown-pack')
  assert.equal(resolved.pack.id, BASE_CONTENT_PACK.id)
  assert.equal(resolved.fallbackApplied, true)
})
