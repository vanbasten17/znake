import { STORAGE_KEYS } from './constants'
import type { RunHistoryEntry } from './runHistory'

export type OnboardingAssistRecommendation = {
  shouldSuggest: boolean
  reason: string
}

type OnboardingAssistState = {
  dismissedAtMs: number
  appliedAtMs: number
}

const WINDOW_SIZE = 5
const EARLY_FLOOR_THRESHOLD = 3

const loadState = (): OnboardingAssistState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.onboardingAssist)
    if (!raw) {
      return { dismissedAtMs: 0, appliedAtMs: 0 }
    }
    const parsed = JSON.parse(raw) as Partial<OnboardingAssistState>
    return {
      dismissedAtMs: Math.max(0, Math.floor(parsed.dismissedAtMs ?? 0)),
      appliedAtMs: Math.max(0, Math.floor(parsed.appliedAtMs ?? 0)),
    }
  } catch {
    return { dismissedAtMs: 0, appliedAtMs: 0 }
  }
}

const saveState = (next: OnboardingAssistState): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.onboardingAssist, JSON.stringify(next))
  } catch {
    // Best effort only.
  }
}

export const dismissOnboardingAssist = (): void => {
  const current = loadState()
  saveState({ ...current, dismissedAtMs: Date.now() })
}

export const markOnboardingAssistApplied = (): void => {
  const current = loadState()
  saveState({ ...current, appliedAtMs: Date.now() })
}

export const resolveOnboardingAssistRecommendation = (
  entries: ReadonlyArray<RunHistoryEntry>,
): OnboardingAssistRecommendation => {
  const state = loadState()
  const window = entries.slice(0, WINDOW_SIZE)
  if (window.length < 3) {
    return { shouldSuggest: false, reason: 'insufficient_history' }
  }
  const earlyFails = window.filter((entry) => entry.floor <= EARLY_FLOOR_THRESHOLD)
  if (earlyFails.length < 3) {
    return { shouldSuggest: false, reason: 'stable_progression' }
  }
  const mostRecentEndedAt = Math.max(...window.map((entry) => entry.endedAt))
  if (state.appliedAtMs >= mostRecentEndedAt || state.dismissedAtMs >= mostRecentEndedAt) {
    return { shouldSuggest: false, reason: 'already_handled' }
  }
  return { shouldSuggest: true, reason: 'repeated_early_failures' }
}
