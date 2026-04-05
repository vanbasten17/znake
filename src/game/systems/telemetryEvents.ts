import {
  type TelemetryPayload,
  emitTelemetryEvent,
  normalizeTelemetryPayload,
} from './telemetryGateway'

export const trackRunStart = (payload: TelemetryPayload): void => {
  emitTelemetryEvent('run_start', normalizeTelemetryPayload(payload))
}

export const trackInputMode = (payload: TelemetryPayload): void => {
  emitTelemetryEvent('input_mode', normalizeTelemetryPayload(payload))
}

export const trackGoalProgressed = (payload: TelemetryPayload): void => {
  emitTelemetryEvent('goal_progressed', normalizeTelemetryPayload(payload))
}

export const trackRewardPicked = (payload: TelemetryPayload): void => {
  emitTelemetryEvent('reward_picked', normalizeTelemetryPayload(payload))
}

export const trackObjectiveCompleted = (payload: TelemetryPayload): void => {
  emitTelemetryEvent('objective_completed', normalizeTelemetryPayload(payload))
}

export const trackRouteMasteryDecision = (payload: TelemetryPayload): void => {
  emitTelemetryEvent('route_mastery_decision', normalizeTelemetryPayload(payload))
}

export const trackRunRewardBreakdown = (payload: TelemetryPayload): void => {
  emitTelemetryEvent('run_reward_breakdown', normalizeTelemetryPayload(payload))
}

export const trackRunEnd = (payload: TelemetryPayload): void => {
  emitTelemetryEvent('run_end', normalizeTelemetryPayload(payload))
}

export const trackBalanceSnapshot = (payload: TelemetryPayload): void => {
  emitTelemetryEvent('balance_snapshot', normalizeTelemetryPayload(payload))
}
