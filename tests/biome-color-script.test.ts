import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveBiomeColorScript } from '../src/game/systems/biomeColorScript'

test('biome color script provides distinct palettes per biome', () => {
  const voidScript = resolveBiomeColorScript('void-depths', false)
  const crystalScript = resolveBiomeColorScript('crystal-caverns', false)
  const emberScript = resolveBiomeColorScript('ember-fields', false)

  assert.notEqual(voidScript.bg, crystalScript.bg)
  assert.notEqual(crystalScript.bg, emberScript.bg)
  assert.notEqual(voidScript.wallAccent, emberScript.wallAccent)
})

test('high contrast mode lifts key contrast anchors', () => {
  const regular = resolveBiomeColorScript('void-depths', false)
  const highContrast = resolveBiomeColorScript('void-depths', true)

  assert.equal(highContrast.wallStroke, 0xffffff)
  assert.equal(highContrast.star, 0xffffff)
  assert.equal(highContrast.mainGrid, regular.wallStroke)
})
