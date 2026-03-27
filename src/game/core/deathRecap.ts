import type { RunCleanPlaySummary, Upgrade, UpgradeFamily } from './types'

export type DeathRecapBuildLeaning = UpgradeFamily | 'mixed' | 'none'

export type DeathRecapViewModel = {
  deathReason: string
  buildLeaning: DeathRecapBuildLeaning
  notableChoices: Upgrade[]
  cleanPlay: Pick<RunCleanPlaySummary, 'completedObjectives' | 'cleanClears' | 'totalBonusScore'>
}

const FAMILY_ORDER: UpgradeFamily[] = ['aggro', 'control', 'survival']
const MAX_NOTABLE_CHOICES = 3

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
  cleanPlay?: Pick<RunCleanPlaySummary, 'completedObjectives' | 'cleanClears' | 'totalBonusScore'>
}): DeathRecapViewModel => ({
  deathReason: params.deathReason ?? 'unknown',
  buildLeaning: getBuildLeaning(params.upgrades),
  notableChoices: params.upgrades.slice(-MAX_NOTABLE_CHOICES),
  cleanPlay: params.cleanPlay ?? {
    completedObjectives: 0,
    cleanClears: 0,
    totalBonusScore: 0,
  },
})
