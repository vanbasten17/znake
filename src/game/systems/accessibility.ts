import { STORAGE_KEYS } from '../core/constants'

export type AccessibilitySettings = {
  highContrast: boolean
  largeText: boolean
  reducedEffects: boolean
  voiceEnabled: boolean
}

export type AccessibilityPresetId = 'default' | 'clarity' | 'comfort' | 'custom'

const DEFAULT_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedEffects: false,
  voiceEnabled: false,
}

const VISUAL_ACCESSIBILITY_MENU_ENABLED = true

const PRESET_SETTINGS: Record<
  Exclude<AccessibilityPresetId, 'custom'>,
  Omit<AccessibilitySettings, 'voiceEnabled'>
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

let settings: AccessibilitySettings = { ...DEFAULT_SETTINGS }

const parseSettings = (raw: string | null): AccessibilitySettings => {
  if (!raw) {
    return { ...DEFAULT_SETTINGS }
  }
  try {
    const parsed = JSON.parse(raw) as Partial<AccessibilitySettings>
    return {
      highContrast: parsed.highContrast === true,
      largeText: parsed.largeText === true,
      reducedEffects: parsed.reducedEffects === true,
      voiceEnabled: parsed.voiceEnabled === true,
    }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

const resolvePresetFromSettings = (value: AccessibilitySettings): AccessibilityPresetId => {
  for (const [presetId, preset] of Object.entries(PRESET_SETTINGS)) {
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

const saveSettings = (): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.accessibility, JSON.stringify(settings))
  } catch {
    console.warn('[accessibility] failed to persist settings')
  }
}

const applySettings = (): void => {
  const body = document.body
  const visualEnabled = VISUAL_ACCESSIBILITY_MENU_ENABLED
  body.classList.toggle('a11y-high-contrast', visualEnabled && settings.highContrast)
  body.classList.toggle('a11y-large-text', visualEnabled && settings.largeText)
  body.classList.toggle('a11y-reduced-effects', visualEnabled && settings.reducedEffects)
}

export const setupAccessibility = (): void => {
  settings = parseSettings(localStorage.getItem(STORAGE_KEYS.accessibility))
  applySettings()
}

export const getAccessibilitySettings = (): AccessibilitySettings => ({ ...settings })

export const updateAccessibilitySettings = (patch: Partial<AccessibilitySettings>): void => {
  settings = {
    ...settings,
    ...patch,
  }
  saveSettings()
  applySettings()
}

export const getAccessibilityPresetId = (): AccessibilityPresetId =>
  resolvePresetFromSettings(settings)

export const cycleAccessibilityPreset = (): AccessibilityPresetId => {
  const sequence: Array<Exclude<AccessibilityPresetId, 'custom'>> = [
    'default',
    'clarity',
    'comfort',
  ]
  const current = getAccessibilityPresetId()
  const baseIndex = current === 'custom' ? -1 : sequence.indexOf(current)
  const nextId = sequence[(baseIndex + 1) % sequence.length] ?? 'default'
  settings = {
    ...settings,
    ...PRESET_SETTINGS[nextId],
  }
  saveSettings()
  applySettings()
  return nextId
}

export const isReducedEffectsEnabled = (): boolean => settings.reducedEffects
