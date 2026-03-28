import type {
  BiomeId,
  DepthBalanceBandId,
  RunMapPreviewChoice,
  RunMapRoomType,
} from '../core/types'
import { resolveRouteRiskForecast } from './routeRiskForecast'

export type RouteChoiceInsights = {
  riskLevel: 'low' | 'medium' | 'high'
  riskScore: number
  pressureDelta: number
  eliteAheadCount: number
  recoveryAheadCount: number
  depthBand: DepthBalanceBandId
  biomePivot: boolean
  futureOne: RunMapRoomType | null
  futureTwo: RunMapRoomType | null
}

const isRecoveryRoom = (roomType: RunMapRoomType): boolean =>
  roomType === 'shop' || roomType === 'rest'

export const resolveRouteChoiceInsights = (
  choice: Pick<RunMapPreviewChoice, 'roomType' | 'previewRoomTypes' | 'depthBand' | 'biomeId'>,
  currentBiomeId: BiomeId,
): RouteChoiceInsights => {
  const risk = resolveRouteRiskForecast(choice)
  const ahead = choice.previewRoomTypes.slice(1)
  const eliteAheadCount = ahead.filter((roomType) => roomType === 'elite').length
  const recoveryAheadCount = ahead.filter((roomType) => isRecoveryRoom(roomType)).length
  const combatAheadCount = ahead.filter((roomType) => roomType === 'combat').length
  const pressureDelta = eliteAheadCount * 2 + combatAheadCount - recoveryAheadCount

  return {
    riskLevel: risk.level,
    riskScore: risk.score,
    pressureDelta,
    eliteAheadCount,
    recoveryAheadCount,
    depthBand: choice.depthBand,
    biomePivot: choice.biomeId !== currentBiomeId,
    futureOne: choice.previewRoomTypes[1] ?? null,
    futureTwo: choice.previewRoomTypes[2] ?? null,
  }
}
