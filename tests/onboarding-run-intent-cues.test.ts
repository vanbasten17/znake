import assert from 'node:assert/strict'
import test from 'node:test'
import {
  resolveOnboardingAssistRecommendation,
  resolveOnboardingIntentCues,
} from '../src/game/core/onboardingAssist'

const now = Date.now()
const entry = (
  overrides: Partial<{
    endedAt: number
    floor: number
    deathReason: string
    causeTags: string[]
  }> = {},
) => ({
  endedAt: overrides.endedAt ?? now,
  runSeed: 1,
  floor: overrides.floor ?? 1,
  score: 0,
  deathReason: overrides.deathReason ?? 'enemy',
  causeTags: overrides.causeTags ?? ['enemy'],
  buildLeaning: 'none',
  challengePresetId: 'standard' as const,
})

test('onboarding assist suggests help on repeated early fails', () => {
  const rec = resolveOnboardingAssistRecommendation([
    entry({ floor: 1 }),
    entry({ floor: 2 }),
    entry({ floor: 3 }),
  ])
  assert.equal(rec.shouldSuggest, true)
})

test('onboarding intent cues keep deterministic priority and taper', () => {
  const cues = resolveOnboardingIntentCues([
    entry({ floor: 1, deathReason: 'elite', causeTags: ['wall'] }),
    entry({ floor: 2, deathReason: 'boss', causeTags: ['projectile'] }),
    entry({ floor: 2, deathReason: 'enemy', causeTags: ['enemy'] }),
  ])
  assert.deepEqual(
    cues.map((cue) => cue.tag),
    ['danger_now', 'objective_next'],
  )
})
