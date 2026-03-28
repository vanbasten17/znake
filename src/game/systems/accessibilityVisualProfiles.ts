import type { AccessibilityPresetId, AccessibilitySettings } from './accessibility'

export const PRESET_VISUAL_SETTINGS: Record<
  Exclude<AccessibilityPresetId, 'custom'>,
  Omit<AccessibilitySettings, 'voiceEnabled' | 'audioProfile'>
> = {
  default: {
    highContrast: false,
    largeText: false,
    reducedEffects: false,
  },
  clarity: {
    highContrast: true,
    largeText: true,
    reducedEffects: false,
  },
  comfort: {
    highContrast: false,
    largeText: true,
    reducedEffects: true,
  },
}

export const resolveAccessibilityPresetIdFromSettings = (
  value: AccessibilitySettings,
): AccessibilityPresetId => {
  for (const [presetId, preset] of Object.entries(PRESET_VISUAL_SETTINGS)) {
    if (
      value.highContrast === preset.highContrast &&
      value.largeText === preset.largeText &&
      value.reducedEffects === preset.reducedEffects
    ) {
      return presetId as AccessibilityPresetId
    }
  }
  return 'custom'
}

export const resolveVisualAccessibilityClasses = (params: {
  settings: AccessibilitySettings
  visualEnabled: boolean
  systemReducedMotion: boolean
}): {
  highContrast: boolean
  largeText: boolean
  reducedEffects: boolean
  systemReducedMotion: boolean
} => ({
  highContrast: params.visualEnabled && params.settings.highContrast,
  largeText: params.visualEnabled && params.settings.largeText,
  reducedEffects:
    params.visualEnabled && (params.settings.reducedEffects || params.systemReducedMotion),
  systemReducedMotion: params.visualEnabled && params.systemReducedMotion,
})
