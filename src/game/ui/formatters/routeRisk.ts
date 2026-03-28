import type { RouteRiskLevel } from '../../simulation/routeRiskForecast'

const SYMBOL_BY_RISK: Record<RouteRiskLevel, string> = {
  low: '○',
  medium: '△',
  high: '▲',
}

export const resolveRouteRiskSymbol = (level: RouteRiskLevel): string =>
  SYMBOL_BY_RISK[level] ?? '○'

export const formatRouteRiskCue = (params: {
  level: RouteRiskLevel
  localizedLabel: string
}): string => `${resolveRouteRiskSymbol(params.level)} [${params.localizedLabel}]`
