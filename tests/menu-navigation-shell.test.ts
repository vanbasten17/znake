import assert from 'node:assert/strict'
import test from 'node:test'
import {
  type MenuNavTab,
  canStartRunFromMenuTab,
  resolveMenuTabByOffset,
  resolveMenuTabHotkey,
} from '../src/game/systems/menuNavigation'

test('menu tab offset wraps in both directions', () => {
  assert.equal(resolveMenuTabByOffset('play', 1), 'progress')
  assert.equal(resolveMenuTabByOffset('progress', 1), 'settings')
  assert.equal(resolveMenuTabByOffset('accessibility', 1), 'play')

  assert.equal(resolveMenuTabByOffset('play', -1), 'accessibility')
  assert.equal(resolveMenuTabByOffset('settings', -1), 'progress')
})

test('menu tab hotkeys map deterministic tab targets', () => {
  const cases: Array<[string, MenuNavTab | null]> = [
    ['Digit7', 'play'],
    ['Numpad7', 'play'],
    ['Digit8', 'progress'],
    ['Numpad8', 'progress'],
    ['Digit9', 'settings'],
    ['Numpad9', 'settings'],
    ['Digit0', 'accessibility'],
    ['Numpad0', 'accessibility'],
    ['KeyP', null],
  ]
  for (const [code, expected] of cases) {
    assert.equal(resolveMenuTabHotkey(code), expected)
  }
})

test('run start is only enabled on play tab', () => {
  assert.equal(canStartRunFromMenuTab('play'), true)
  assert.equal(canStartRunFromMenuTab('progress'), false)
  assert.equal(canStartRunFromMenuTab('settings'), false)
  assert.equal(canStartRunFromMenuTab('accessibility'), false)
})
