import { STORAGE_KEYS } from '../core/constants'

export type AccessibilitySettings = {
  highContrast: boolean
  largeText: boolean
  reducedEffects: boolean
  voiceEnabled: boolean
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedEffects: false,
  voiceEnabled: false,
}

const VISUAL_ACCESSIBILITY_MENU_ENABLED = false

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
  if (!VISUAL_ACCESSIBILITY_MENU_ENABLED) {
    settings.highContrast = false
    settings.largeText = false
    settings.reducedEffects = false
  }
  applySettings()
}

export const getAccessibilitySettings = (): AccessibilitySettings => ({ ...settings })

export const updateAccessibilitySettings = (patch: Partial<AccessibilitySettings>): void => {
  settings = {
    ...settings,
    ...patch,
  }
  if (!VISUAL_ACCESSIBILITY_MENU_ENABLED) {
    settings.highContrast = false
    settings.largeText = false
    settings.reducedEffects = false
  }
  saveSettings()
  applySettings()
}

export const isReducedEffectsEnabled = (): boolean => settings.reducedEffects
