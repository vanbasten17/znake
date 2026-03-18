import { BALANCE } from './balance'
import { STORAGE_KEYS } from './constants'
import type {
  GoalDefinition,
  GoalId,
  PlayerProfile,
  RelicDefinition,
  RelicId,
  RunConfig,
  TalentDefinition,
  TalentId,
} from './types'

const PROFILE_VERSION = 2

const createDefaultGoalProgress = (): PlayerProfile['goalProgress'] => ({
  floor_5: 0,
  elite_hunter_12: 0,
})

const createDefaultClaimedGoals = (): PlayerProfile['claimedGoals'] => ({
  floor_5: false,
  elite_hunter_12: false,
})

export const PROGRESSION_GOALS: GoalDefinition[] = [
  {
    id: 'floor_5',
    target: BALANCE.economy.goals.floor_5.target,
    reward: BALANCE.economy.goals.floor_5.reward,
  },
  {
    id: 'elite_hunter_12',
    target: BALANCE.economy.goals.elite_hunter_12.target,
    reward: BALANCE.economy.goals.elite_hunter_12.reward,
  },
]

const isGoalId = (value: unknown): value is GoalId =>
  PROGRESSION_GOALS.some((goal) => goal.id === value)

const defaultProfile = (): PlayerProfile => ({
  profileVersion: PROFILE_VERSION,
  currency: 0,
  unlockedTalents: [],
  lifetimeStats: {
    runsPlayed: 0,
    totalScore: 0,
    totalKills: 0,
    eliteKills: 0,
    bestFloor: 1,
  },
  goalProgress: createDefaultGoalProgress(),
  claimedGoals: createDefaultClaimedGoals(),
})

export const TALENT_TREE: TalentDefinition[] = [
  {
    id: 'speed_1',
    name: 'Speed I',
    description: 'Start 5% faster.',
    cost: BALANCE.talents.costs.speed_1,
    requires: null,
    apply: (cfg) => {
      cfg.moveInterval = Math.max(90, Math.floor(cfg.moveInterval * 0.95))
    },
  },
  {
    id: 'speed_2',
    name: 'Speed II',
    description: 'Start 10% faster.',
    cost: BALANCE.talents.costs.speed_2,
    requires: 'speed_1',
    apply: (cfg) => {
      cfg.moveInterval = Math.max(80, Math.floor(cfg.moveInterval * 0.9))
    },
  },
  {
    id: 'survival_1',
    name: 'Survival I',
    description: 'Start with +1 shield.',
    cost: BALANCE.talents.costs.survival_1,
    requires: null,
    apply: (cfg) => {
      cfg.bonusShields += 1
    },
  },
  {
    id: 'survival_2',
    name: 'Survival II',
    description: 'Start with +2 length.',
    cost: BALANCE.talents.costs.survival_2,
    requires: 'survival_1',
    apply: (cfg) => {
      cfg.bonusStartLength += 2
    },
  },
  {
    id: 'hunt_1',
    name: 'Hunt I',
    description: 'Higher score multiplier.',
    cost: BALANCE.talents.costs.hunt_1,
    requires: null,
    apply: (cfg) => {
      cfg.scoreMult *= 1.2
    },
  },
  {
    id: 'hunt_2',
    name: 'Hunt II',
    description: 'Enemies move slower.',
    cost: BALANCE.talents.costs.hunt_2,
    requires: 'hunt_1',
    apply: (cfg) => {
      cfg.enemySlow *= 1.1
    },
  },
]

export const RELIC_POOL: RelicDefinition[] = [
  {
    id: 'plasma_core',
    name: 'Plasma Core',
    description: 'Start longer and faster.',
    apply: (cfg) => {
      cfg.bonusStartLength += 4
      cfg.moveInterval = Math.max(75, Math.floor(cfg.moveInterval * 0.9))
    },
  },
  {
    id: 'void_shadow',
    name: 'Void Shadow',
    description: 'Start with ghost pass + shield.',
    apply: (cfg) => {
      cfg.ghostCharges += 1
      cfg.bonusShields += 1
    },
  },
  {
    id: 'symbiont',
    name: 'Symbiont',
    description: 'Stronger hunt scoring.',
    apply: (cfg) => {
      cfg.scoreMult *= 1.35
    },
  },
]

export const getRelicById = (id: RelicId | null): RelicDefinition | null =>
  RELIC_POOL.find((relic) => relic.id === id) ?? null

const parseProfile = (raw: string): PlayerProfile | null => {
  try {
    const parsed = JSON.parse(raw) as Partial<PlayerProfile>
    if (typeof parsed.currency !== 'number' || !Array.isArray(parsed.unlockedTalents)) {
      return null
    }

    if (
      !parsed.lifetimeStats ||
      typeof parsed.lifetimeStats.runsPlayed !== 'number' ||
      typeof parsed.lifetimeStats.totalScore !== 'number' ||
      typeof parsed.lifetimeStats.totalKills !== 'number' ||
      typeof parsed.lifetimeStats.bestFloor !== 'number'
    ) {
      return null
    }

    const baseLifetimeStats = {
      runsPlayed: Math.max(0, Math.floor(parsed.lifetimeStats.runsPlayed)),
      totalScore: Math.max(0, Math.floor(parsed.lifetimeStats.totalScore)),
      totalKills: Math.max(0, Math.floor(parsed.lifetimeStats.totalKills)),
      eliteKills: Math.max(
        0,
        Math.floor(
          typeof parsed.lifetimeStats.eliteKills === 'number' ? parsed.lifetimeStats.eliteKills : 0,
        ),
      ),
      bestFloor: Math.max(1, Math.floor(parsed.lifetimeStats.bestFloor)),
    }

    const resolvedGoalProgress = createDefaultGoalProgress()
    const resolvedClaimedGoals = createDefaultClaimedGoals()

    if (parsed.profileVersion === PROFILE_VERSION) {
      const progressEntries = Object.entries(parsed.goalProgress ?? {})
      for (const [goalId, value] of progressEntries) {
        if (isGoalId(goalId) && typeof value === 'number') {
          resolvedGoalProgress[goalId] = Math.max(0, Math.floor(value))
        }
      }
      const claimedEntries = Object.entries(parsed.claimedGoals ?? {})
      for (const [goalId, value] of claimedEntries) {
        if (isGoalId(goalId) && typeof value === 'boolean') {
          resolvedClaimedGoals[goalId] = value
        }
      }
    }

    if (parsed.profileVersion === 1) {
      resolvedGoalProgress.floor_5 = Math.max(
        resolvedGoalProgress.floor_5,
        baseLifetimeStats.bestFloor,
      )
    }

    return {
      profileVersion: PROFILE_VERSION,
      currency: Math.max(0, Math.floor(parsed.currency)),
      unlockedTalents: parsed.unlockedTalents.filter(isTalentId),
      lifetimeStats: baseLifetimeStats,
      goalProgress: resolvedGoalProgress,
      claimedGoals: resolvedClaimedGoals,
    }
  } catch {
    return null
  }
}

export const loadProfile = (): PlayerProfile => {
  const primaryRaw = localStorage.getItem(STORAGE_KEYS.profile)
  if (primaryRaw) {
    const profile = parseProfile(primaryRaw)
    if (profile) {
      return profile
    }
  }

  const backupRaw = localStorage.getItem(STORAGE_KEYS.profileBackup)
  if (backupRaw) {
    const profile = parseProfile(backupRaw)
    if (profile) {
      return profile
    }
  }

  return defaultProfile()
}

export const saveProfile = (profile: PlayerProfile): void => {
  const payload = JSON.stringify(profile)
  try {
    localStorage.setItem(STORAGE_KEYS.profile, payload)
    localStorage.setItem(STORAGE_KEYS.profileBackup, payload)
  } catch {
    try {
      localStorage.setItem(STORAGE_KEYS.profileBackup, payload)
    } catch {
      console.warn('[profile] failed to persist profile payload')
    }
  }
}

const isTalentId = (value: unknown): value is TalentId =>
  TALENT_TREE.some((talent) => talent.id === value)

export const applyTalentEffects = (cfg: RunConfig, profile: PlayerProfile): void => {
  for (const talent of TALENT_TREE) {
    if (profile.unlockedTalents.includes(talent.id)) {
      talent.apply(cfg)
    }
  }
}

export const applyRelicEffect = (cfg: RunConfig, relicId: RelicId | null): void => {
  const relic = getRelicById(relicId)
  if (!relic) {
    return
  }
  relic.apply(cfg)
}

export const drawRelicDraft = (): RelicDefinition[] => {
  const pool = [...RELIC_POOL]
  const picks: RelicDefinition[] = []
  while (picks.length < 3 && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length)
    const relic = pool.splice(idx, 1)[0]
    if (relic) {
      picks.push(relic)
    }
  }
  return picks
}

export const canUnlockTalent = (profile: PlayerProfile, talent: TalentDefinition): boolean => {
  if (profile.unlockedTalents.includes(talent.id)) {
    return false
  }
  if (profile.currency < talent.cost) {
    return false
  }
  if (talent.requires && !profile.unlockedTalents.includes(talent.requires)) {
    return false
  }
  return true
}

export const unlockTalent = (
  profile: PlayerProfile,
  talentId: TalentId,
): { ok: boolean; profile: PlayerProfile } => {
  const talent = TALENT_TREE.find((item) => item.id === talentId)
  if (!talent || !canUnlockTalent(profile, talent)) {
    return { ok: false, profile }
  }
  return {
    ok: true,
    profile: {
      ...profile,
      currency: profile.currency - talent.cost,
      unlockedTalents: [...profile.unlockedTalents, talent.id],
    },
  }
}

export const calculateRunReward = (score: number, kills: number, floor: number): number => {
  const breakdown = calculateRunRewardBreakdown(score, kills, floor)
  return breakdown.finalReward
}

export const calculateRunRewardBreakdown = (score: number, kills: number, floor: number) => {
  const scorePart = Math.floor(score / BALANCE.economy.rewardScoreDivisor)
  const killPart = kills * BALANCE.economy.rewardKillValue
  const floorPart = Math.max(0, floor - 1) * BALANCE.economy.rewardFloorValue
  const baseReward = scorePart + killPart + floorPart
  const finalReward = Math.max(BALANCE.economy.rewardMin, baseReward)
  return {
    scorePart,
    killPart,
    floorPart,
    baseReward,
    finalReward,
  }
}

export const createDefaultProfileForTests = defaultProfile

export const applyRunGoalProgress = (
  profile: PlayerProfile,
  payload: { floorReached: number; eliteKills: number },
): {
  profile: PlayerProfile
  transitions: Array<{
    goalId: GoalId
    from: number
    to: number
    target: number
    claimed: boolean
  }>
} => {
  const nextProgress = {
    ...profile.goalProgress,
  }
  const transitions: Array<{
    goalId: GoalId
    from: number
    to: number
    target: number
    claimed: boolean
  }> = []

  for (const goal of PROGRESSION_GOALS) {
    const from = nextProgress[goal.id]
    const to =
      goal.id === 'floor_5'
        ? Math.min(goal.target, Math.max(from, payload.floorReached))
        : Math.min(goal.target, from + Math.max(0, payload.eliteKills))
    if (to !== from) {
      nextProgress[goal.id] = to
      transitions.push({
        goalId: goal.id,
        from,
        to,
        target: goal.target,
        claimed: profile.claimedGoals[goal.id],
      })
    }
  }

  return {
    profile: {
      ...profile,
      goalProgress: nextProgress,
    },
    transitions,
  }
}

export const claimGoalReward = (
  profile: PlayerProfile,
  goalId: GoalId,
): { ok: boolean; reward: number; profile: PlayerProfile } => {
  const goal = PROGRESSION_GOALS.find((item) => item.id === goalId)
  if (!goal) {
    return { ok: false, reward: 0, profile }
  }
  if (profile.claimedGoals[goalId]) {
    return { ok: false, reward: 0, profile }
  }
  if (profile.goalProgress[goalId] < goal.target) {
    return { ok: false, reward: 0, profile }
  }
  return {
    ok: true,
    reward: goal.reward,
    profile: {
      ...profile,
      currency: profile.currency + goal.reward,
      claimedGoals: {
        ...profile.claimedGoals,
        [goalId]: true,
      },
    },
  }
}
