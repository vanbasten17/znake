import { STORAGE_KEYS } from '../core/constants'
import {
  PRESET_VISUAL_SETTINGS,
  resolveAccessibilityPresetIdFromSettings,
  resolveVisualAccessibilityClasses,
} from './accessibilityVisualProfiles'

export type AccessibilitySettings = {
  highContrast: boolean
  largeText: boolean
  reducedEffects: boolean
  voiceEnabled: boolean
  audioProfile: AudioProfileId
}

export type AccessibilityPresetId = 'default' | 'clarity' | 'comfort' | 'custom'
export type AudioProfileId = 'focused' | 'balanced' | 'low_fatigue'

const DEFAULT_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedEffects: false,
  voiceEnabled: false,
  audioProfile: 'balanced',
}

const VISUAL_ACCESSIBILITY_MENU_ENABLED = true

let settings: AccessibilitySettings = { ...DEFAULT_SETTINGS }
let systemReducedMotion = false
let reducedMotionMediaQuery: MediaQueryList | null = null
let reducedMotionOnChange: ((event: MediaQueryListEvent) => void) | null = null

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
      audioProfile:
        parsed.audioProfile === 'focused' || parsed.audioProfile === 'low_fatigue'
          ? parsed.audioProfile
          : 'balanced',
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
  const classes = resolveVisualAccessibilityClasses({
    settings,
    visualEnabled: VISUAL_ACCESSIBILITY_MENU_ENABLED,
    systemReducedMotion,
  })
  body.classList.toggle('a11y-high-contrast', classes.highContrast)
  body.classList.toggle('a11y-large-text', classes.largeText)
  body.classList.toggle('a11y-reduced-effects', classes.reducedEffects)
  body.classList.toggle('a11y-system-reduced-motion', classes.systemReducedMotion)
}

const syncSystemReducedMotionPreference = (): void => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    systemReducedMotion = false
    return
  }
  if (reducedMotionMediaQuery && reducedMotionOnChange) {
    if (typeof reducedMotionMediaQuery.removeEventListener === 'function') {
      reducedMotionMediaQuery.removeEventListener('change', reducedMotionOnChange)
    } else {
      reducedMotionMediaQuery.removeListener(reducedMotionOnChange)
    }
  }
  reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  systemReducedMotion = reducedMotionMediaQuery.matches
  reducedMotionOnChange = (event: MediaQueryListEvent): void => {
    systemReducedMotion = event.matches
    applySettings()
  }
  if (typeof reducedMotionMediaQuery.addEventListener === 'function') {
    reducedMotionMediaQuery.addEventListener('change', reducedMotionOnChange)
  } else {
    reducedMotionMediaQuery.addListener(reducedMotionOnChange)
  }
}

export const setupAccessibility = (): void => {
  syncSystemReducedMotionPreference()
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
  resolveAccessibilityPresetIdFromSettings(settings)

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
    ...PRESET_VISUAL_SETTINGS[nextId],
  }
  saveSettings()
  applySettings()
  return nextId
}

export const isReducedEffectsEnabled = (): boolean => settings.reducedEffects || systemReducedMotion

export const getAudioProfileId = (): AudioProfileId => settings.audioProfile

export const cycleAudioProfile = (): AudioProfileId => {
  const sequence: AudioProfileId[] = ['focused', 'balanced', 'low_fatigue']
  const currentIndex = sequence.indexOf(settings.audioProfile)
  const next = sequence[(currentIndex + 1) % sequence.length] ?? 'balanced'
  settings = {
    ...settings,
    audioProfile: next,
  }
  saveSettings()
  applySettings()
  return next
}
