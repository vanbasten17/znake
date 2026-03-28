import assert from 'node:assert/strict'
import test from 'node:test'
import { loadCoreSceneAssets } from '../src/game/systems/assetLoadingFacade'

test('asset loading facade delegates marker texture loading once', async () => {
  const calls: string[] = []
  const fakeScene = {} as never
  await loadCoreSceneAssets(fakeScene, {
    ensureMarkerTextures: async () => {
      calls.push('marker')
    },
  })
  assert.deepEqual(calls, ['marker'])
})
