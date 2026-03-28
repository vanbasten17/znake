import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveChallengeSharePromptCopy } from '../src/game/systems/challengeSharePromptCopy'

test('challenge share prompt copy uses localized labels when available', () => {
  const copy = resolveChallengeSharePromptCopy((key) => {
    if (key === 'menu.challengeShareCopyPromptTitle') return 'Localized copy'
    if (key === 'menu.challengeSharePastePromptTitle') return 'Localized paste'
    return key
  })
  assert.equal(copy.copyPromptTitle, 'Localized copy')
  assert.equal(copy.pastePromptTitle, 'Localized paste')
})

test('challenge share prompt copy falls back when translation key echo occurs', () => {
  const copy = resolveChallengeSharePromptCopy((key) => key)
  assert.equal(copy.copyPromptTitle, 'Copy challenge code')
  assert.equal(copy.pastePromptTitle, 'Paste challenge code')
})

test('challenge share prompt copy falls back when localized value is blank', () => {
  const copy = resolveChallengeSharePromptCopy(() => '   ')
  assert.equal(copy.copyPromptTitle, 'Copy challenge code')
  assert.equal(copy.pastePromptTitle, 'Paste challenge code')
})
