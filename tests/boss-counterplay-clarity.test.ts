import assert from 'node:assert/strict'
import test from 'node:test'
import {
  formatBossCounterplayCue,
  formatEliteCounterplayCue,
  resolveBossTelegraphContract,
} from '../src/game/systems/bossCounterplayCue'

test('boss counterplay cue maps deterministic phase copy with punish loops', () => {
  const telegraph = formatBossCounterplayCue({
    phase: 'telegraph',
    identityCueLabel: 'PREDATOR',
    remixCueLabel: 'RIFT',
  })
  const commit = formatBossCounterplayCue({
    phase: 'commit',
    identityCueLabel: 'PREDATOR',
    remixCueLabel: 'RIFT',
  })
  assert.equal(telegraph, 'BOSS PREDATOR RIFT: WINDOW: BAIT LINE')
  assert.equal(commit, 'BOSS PREDATOR RIFT: PUNISH LOOP: SIDESTEP THEN COLLAPSE')
})

test('elite counterplay cue keeps deterministic phase labels', () => {
  assert.equal(formatEliteCounterplayCue('telegraph'), 'ELITE WINDOW: TELEGRAPH')
  assert.equal(formatEliteCounterplayCue('recovery'), 'ELITE PUNISH LOOP: RECOVERY')
})

test('boss telegraph contract resolves lead-time tiers and contrast floor', () => {
  const dash = resolveBossTelegraphContract({
    attackClass: 'dash',
    highContrastEnabled: false,
  })
  const slamA11y = resolveBossTelegraphContract({
    attackClass: 'slam',
    highContrastEnabled: true,
  })
  assert.equal(dash.leadTimeMs, 420)
  assert.equal(slamA11y.leadTimeMs, 560)
  assert.equal(dash.minContrastRatio, 3.8)
  assert.equal(slamA11y.minContrastRatio, 4.5)
})
