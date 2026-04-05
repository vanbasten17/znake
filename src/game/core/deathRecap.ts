import type { RouteMasterySummary, RunCleanPlaySummary, Upgrade, UpgradeFamily } from './types'

export type DeathRecapBuildLeaning = UpgradeFamily | 'mixed' | 'none'

export type DeathRecapViewModel = {
  deathReason: string
  buildLeaning: DeathRecapBuildLeaning
  notableChoices: Upgrade[]
  causeTags: string[]
  routeMastery: {
    label: string
    detail: string
  }
  cleanPlay: Pick<RunCleanPlaySummary, 'completedObjectives' | 'cleanClears' | 'totalBonusScore'>
}

const FAMILY_ORDER: UpgradeFamily[] = ['aggro', 'control', 'survival']
const MAX_NOTABLE_CHOICES = 3
const MAX_CAUSE_TAGS = 3

const CAUSE_WEIGHT: Record<string, number> = {
  boss: 6,
  elite: 5,
  projectile: 4,
  enemy: 3,
  wall: 2,
  unknown: 1,
}

const rankCauseTags = (deathReason: string, history: ReadonlyArray<string>): string[] => {
  const tally = new Map<string, number>()
  const currentWeight = CAUSE_WEIGHT[deathReason] ?? CAUSE_WEIGHT.unknown
  tally.set(deathReason, currentWeight + 3)
  for (const reason of history) {
    const normalized = reason.trim() || 'unknown'
    const next = (tally.get(normalized) ?? 0) + (CAUSE_WEIGHT[normalized] ?? CAUSE_WEIGHT.unknown)
    tally.set(normalized, next)
  }
  return [...tally.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, MAX_CAUSE_TAGS)
    .map(([tag]) => tag)
}

const getRouteMasteryRecap = (summary: RouteMasterySummary): { label: string; detail: string } => {
  if (summary.routeDecisions <= 0) {
    return {
      label: 'Route unformed',
      detail: 'No committed route decisions',
    }
  }
  const riskLean = summary.eliteChoices - summary.nonCombatChoices
  const label =
    riskLean >= 2 ? 'High-risk routing' : riskLean <= -1 ? 'Safe routing' : 'Balanced routing'
  const detail = `B${summary.branchDecisions} · E${summary.eliteChoices} · Pivot ${summary.biomePivotChoices}`
  return { label, detail }
}

const getBuildLeaning = (upgrades: ReadonlyArray<Upgrade>): DeathRecapBuildLeaning => {
  if (upgrades.length === 0) {
    return 'none'
  }

  const counts = upgrades.reduce<Record<UpgradeFamily, number>>(
    (acc, upgrade) => {
      acc[upgrade.family] += 1
      return acc
    },
    { aggro: 0, control: 0, survival: 0 },
  )

  let bestFamily: UpgradeFamily = FAMILY_ORDER[0]
  let bestCount = counts[bestFamily]
  let tied = false

  for (const family of FAMILY_ORDER.slice(1)) {
    const count = counts[family]
    if (count > bestCount) {
      bestFamily = family
      bestCount = count
      tied = false
      continue
    }
    if (count === bestCount && count > 0) {
      tied = true
    }
  }

  if (bestCount === 0) {
    return 'none'
  }

  return tied ? 'mixed' : bestFamily
}

export const buildDeathRecap = (params: {
  deathReason?: string
  upgrades: ReadonlyArray<Upgrade>
  deathReasonHistory?: ReadonlyArray<string>
  routeMastery?: RouteMasterySummary
  cleanPlay?: Pick<RunCleanPlaySummary, 'completedObjectives' | 'cleanClears' | 'totalBonusScore'>
}): DeathRecapViewModel => ({
  deathReason: params.deathReason ?? 'unknown',
  buildLeaning: getBuildLeaning(params.upgrades),
  notableChoices: params.upgrades.slice(-MAX_NOTABLE_CHOICES),
  causeTags: rankCauseTags(params.deathReason ?? 'unknown', params.deathReasonHistory ?? []),
  routeMastery: getRouteMasteryRecap(
    params.routeMastery ?? {
      routeDecisions: 0,
      branchDecisions: 0,
      eliteChoices: 0,
      nonCombatChoices: 0,
      biomePivotChoices: 0,
      previewEliteSeen: 0,
    },
  ),
  cleanPlay: params.cleanPlay ?? {
    completedObjectives: 0,
    cleanClears: 0,
    totalBonusScore: 0,
  },
})
