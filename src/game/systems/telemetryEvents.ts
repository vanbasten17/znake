import { trackRetentionEvent } from './telemetry'

type TelemetryValue = number | string | boolean | null | undefined

type TelemetryPayload = {
  [key: string]: TelemetryValue
}

const normalizePayload = (
  payload: TelemetryPayload,
): Record<string, number | string | boolean | null> => {
  const normalized: Record<string, number | string | boolean | null> = {}
  for (const [key, value] of Object.entries(payload)) {
    normalized[key] = value ?? null
  }
  return normalized
}

export const trackRunStart = (payload: TelemetryPayload): void => {
  trackRetentionEvent('run_start', normalizePayload(payload))
}

export const trackInputMode = (payload: TelemetryPayload): void => {
  trackRetentionEvent('input_mode', normalizePayload(payload))
}

export const trackGoalProgressed = (payload: TelemetryPayload): void => {
  trackRetentionEvent('goal_progressed', normalizePayload(payload))
}

export const trackRewardPicked = (payload: TelemetryPayload): void => {
  trackRetentionEvent('reward_picked', normalizePayload(payload))
}

export const trackObjectiveCompleted = (payload: TelemetryPayload): void => {
  trackRetentionEvent('objective_completed', normalizePayload(payload))
}

export const trackRouteMasteryDecision = (payload: TelemetryPayload): void => {
  trackRetentionEvent('route_mastery_decision', normalizePayload(payload))
}

export const trackRunRewardBreakdown = (payload: TelemetryPayload): void => {
  trackRetentionEvent('run_reward_breakdown', normalizePayload(payload))
}

export const trackRunEnd = (payload: TelemetryPayload): void => {
  trackRetentionEvent('run_end', normalizePayload(payload))
}
