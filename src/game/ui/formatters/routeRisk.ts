import type { RouteRiskLevel } from '../../simulation/routeRiskForecast'

const SYMBOL_BY_RISK: Record<RouteRiskLevel, string> = {
  low: '○',
  medium: '△',
  high: '▲',
}

export const formatRouteRiskCue = (params: {
  level: RouteRiskLevel
  localizedLabel: string
}): string => `${SYMBOL_BY_RISK[params.level]} [${params.localizedLabel}]`
