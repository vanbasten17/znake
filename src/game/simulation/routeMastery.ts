import type { RouteMasterySummary, RunMapPreviewChoice } from '../core/types'

export const createEmptyRouteMasterySummary = (): RouteMasterySummary => ({
  routeDecisions: 0,
  branchDecisions: 0,
  eliteChoices: 0,
  nonCombatChoices: 0,
  biomePivotChoices: 0,
  previewEliteSeen: 0,
})

export const recordRouteMasteryDecision = (params: {
  summary: RouteMasterySummary
  currentBiomeId: RunMapPreviewChoice['biomeId']
  availableChoices: number
  choice: Pick<RunMapPreviewChoice, 'roomType' | 'biomeId' | 'previewRoomTypes'>
}): RouteMasterySummary => {
  const previewEliteSeen = params.choice.previewRoomTypes.filter((room) => room === 'elite').length
  const isNonCombat =
    params.choice.roomType === 'shop' ||
    params.choice.roomType === 'rest' ||
    params.choice.roomType === 'event'
  return {
    routeDecisions: params.summary.routeDecisions + 1,
    branchDecisions: params.summary.branchDecisions + (params.availableChoices > 1 ? 1 : 0),
    eliteChoices: params.summary.eliteChoices + (params.choice.roomType === 'elite' ? 1 : 0),
    nonCombatChoices: params.summary.nonCombatChoices + (isNonCombat ? 1 : 0),
    biomePivotChoices:
      params.summary.biomePivotChoices + (params.choice.biomeId !== params.currentBiomeId ? 1 : 0),
    previewEliteSeen: params.summary.previewEliteSeen + previewEliteSeen,
  }
}

export const getRouteMasteryReadout = (
  summary: RouteMasterySummary,
): {
  label: string
  short: string
  detail: string
} => {
  if (summary.routeDecisions <= 0) {
    return {
      label: 'Route Unformed',
      short: 'RM --',
      detail: 'No committed route decisions yet',
    }
  }
  const riskLean = summary.eliteChoices - summary.nonCombatChoices
  const label =
    riskLean >= 2 ? 'High-Risk Routing' : riskLean <= -1 ? 'Safe Routing' : 'Balanced Routing'
  return {
    label,
    short: `RM B${summary.branchDecisions} E${summary.eliteChoices} P${summary.biomePivotChoices}`,
    detail: `${label} · decisions ${summary.routeDecisions} · preview elite ${summary.previewEliteSeen}`,
  }
}
