import assert from 'node:assert/strict'
import test from 'node:test'
import type { AccessibilitySettings } from '../src/game/systems/accessibility'
import {
  PRESET_VISUAL_SETTINGS,
  resolveAccessibilityPresetIdFromSettings,
  resolveVisualAccessibilityClasses,
} from '../src/game/systems/accessibilityVisualProfiles'

const baseSettings = (overrides: Partial<AccessibilitySettings> = {}): AccessibilitySettings => ({
  highContrast: false,
  largeText: false,
  reducedEffects: false,
  voiceEnabled: false,
  audioProfile: 'balanced',
  ...overrides,
})

test('preset resolver maps canonical visual tuples to default/clarity/comfort', () => {
  assert.equal(
    resolveAccessibilityPresetIdFromSettings(baseSettings(PRESET_VISUAL_SETTINGS.default)),
    'default',
  )
  assert.equal(
    resolveAccessibilityPresetIdFromSettings(baseSettings(PRESET_VISUAL_SETTINGS.clarity)),
    'clarity',
  )
  assert.equal(
    resolveAccessibilityPresetIdFromSettings(baseSettings(PRESET_VISUAL_SETTINGS.comfort)),
    'comfort',
  )
})

test('preset resolver returns custom for mixed non-canonical visual combinations', () => {
  const custom = baseSettings({
    highContrast: true,
    largeText: false,
    reducedEffects: true,
  })
  assert.equal(resolveAccessibilityPresetIdFromSettings(custom), 'custom')
})

test('visual accessibility classes propagate reduced-motion and visual enable flags', () => {
  const classes = resolveVisualAccessibilityClasses({
    settings: baseSettings({ highContrast: true, largeText: true, reducedEffects: false }),
    visualEnabled: true,
    systemReducedMotion: true,
  })
  assert.deepEqual(classes, {
    highContrast: true,
    largeText: true,
    reducedEffects: true,
    systemReducedMotion: true,
  })

  const disabled = resolveVisualAccessibilityClasses({
    settings: baseSettings({ highContrast: true, largeText: true, reducedEffects: true }),
    visualEnabled: false,
    systemReducedMotion: true,
  })
  assert.deepEqual(disabled, {
    highContrast: false,
    largeText: false,
    reducedEffects: false,
    systemReducedMotion: false,
  })
})
