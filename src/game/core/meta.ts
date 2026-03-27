import { BALANCE } from './balance'
import { STORAGE_KEYS } from './constants'
import {
  CURRENT_PROFILE_VERSION,
  createDefaultProfile,
  parseAndMigrateProfile,
} from './profileVersioning'
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

export const loadProfile = (): PlayerProfile => {
  const primaryRaw = localStorage.getItem(STORAGE_KEYS.profile)
  if (primaryRaw) {
    const profile = parseAndMigrateProfile(primaryRaw)
    if (profile) {
      return profile
    }
  }

  const backupRaw = localStorage.getItem(STORAGE_KEYS.profileBackup)
  if (backupRaw) {
    const profile = parseAndMigrateProfile(backupRaw)
    if (profile) {
      return profile
    }
  }

  return createDefaultProfile()
}

export const saveProfile = (profile: PlayerProfile): void => {
  const payload = JSON.stringify({
    ...profile,
    profileVersion: CURRENT_PROFILE_VERSION,
  })
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

export const isChallengeMutatorsUnlocked = (profile: PlayerProfile): boolean =>
  profile.goalProgress.floor_5 >= BALANCE.challengeMutators.availability.requiredProgress

export const drawRelicDraft = (options?: {
  nextIndex?: (poolLength: number) => number
}): RelicDefinition[] => {
  const pool = [...RELIC_POOL]
  const picks: RelicDefinition[] = []
  const nextIndex =
    options?.nextIndex ??
    (() => {
      return 0
    })
  while (picks.length < 3 && pool.length > 0) {
    const idx = Math.max(0, Math.min(pool.length - 1, Math.floor(nextIndex(pool.length))))
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

export const createDefaultProfileForTests = createDefaultProfile

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
