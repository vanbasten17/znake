import type { RunMapPreviewChoice, RunMapRoomType } from '../core/types'

export type RouteRiskLevel = 'low' | 'medium' | 'high'
export type RouteRiskReasonTag = 'elite_ahead' | 'recovery_ahead' | 'pressure_spike'

type RouteRiskForecastInput = Pick<RunMapPreviewChoice, 'roomType' | 'previewRoomTypes'>

const ROOM_RISK_WEIGHTS: Record<RunMapRoomType, number> = {
  combat: 1,
  elite: 3,
  shop: -1,
  rest: -1,
  event: 0,
}

const PREVIEW_RISK_WEIGHTS: Record<RunMapRoomType, number> = {
  combat: 1,
  elite: 2,
  shop: -1,
  rest: -1,
  event: 0,
}

export const resolveRouteRiskForecast = (
  choice: RouteRiskForecastInput,
): { score: number; level: RouteRiskLevel } => {
  const selectedRoomWeight = ROOM_RISK_WEIGHTS[choice.roomType]
  const previewWeight = choice.previewRoomTypes
    .slice(1)
    .reduce((sum, roomType) => sum + PREVIEW_RISK_WEIGHTS[roomType], 0)
  const score = selectedRoomWeight + previewWeight
  if (score >= 4) {
    return { score, level: 'high' }
  }
  if (score <= 0) {
    return { score, level: 'low' }
  }
  return { score, level: 'medium' }
}

export const resolveRouteRiskPreview = (
  choice: RouteRiskForecastInput,
): {
  score: number
  level: RouteRiskLevel
  reasonTags: RouteRiskReasonTag[]
} => {
  const forecast = resolveRouteRiskForecast(choice)
  const tags: RouteRiskReasonTag[] = []
  const eliteAhead = choice.previewRoomTypes.filter((room) => room === 'elite').length
  const recoveryAhead = choice.previewRoomTypes.filter(
    (room) => room === 'rest' || room === 'shop',
  ).length
  if (eliteAhead > 0) {
    tags.push('elite_ahead')
  }
  if (recoveryAhead > 0) {
    tags.push('recovery_ahead')
  }
  if (forecast.level === 'high') {
    tags.push('pressure_spike')
  }
  return {
    ...forecast,
    reasonTags: tags.slice(0, 2),
  }
}
