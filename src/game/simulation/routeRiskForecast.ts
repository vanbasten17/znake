import type { RunMapPreviewChoice, RunMapRoomType } from '../core/types'

export type RouteRiskLevel = 'low' | 'medium' | 'high'

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
