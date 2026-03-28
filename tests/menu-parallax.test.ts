import assert from 'node:assert/strict'
import test from 'node:test'
import { isMenuParallaxEnabled } from '../src/game/systems/menuParallax'

test('menu parallax is disabled only when reduced effects is enabled', () => {
  assert.equal(isMenuParallaxEnabled(false), true)
  assert.equal(isMenuParallaxEnabled(true), false)
})
