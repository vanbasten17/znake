import type { ClaimedGoals, GoalProgress, PlayerProfile, TalentId } from './types'

export const CURRENT_PROFILE_VERSION = 3

const TALENT_IDS: readonly TalentId[] = [
  'speed_1',
  'speed_2',
  'survival_1',
  'survival_2',
  'hunt_1',
  'hunt_2',
]

const GOAL_IDS = ['floor_5', 'elite_hunter_12'] as const

type GoalId = (typeof GOAL_IDS)[number]

type ProfileLike = Partial<PlayerProfile> & {
  profileVersion?: number
  lifetimeStats?: Partial<PlayerProfile['lifetimeStats']>
  goalProgress?: Record<string, unknown>
  claimedGoals?: Record<string, unknown>
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isGoalId = (value: string): value is GoalId => (GOAL_IDS as readonly string[]).includes(value)

export const createDefaultGoalProgress = (): GoalProgress => ({
  floor_5: 0,
  elite_hunter_12: 0,
})

export const createDefaultClaimedGoals = (): ClaimedGoals => ({
  floor_5: false,
  elite_hunter_12: false,
})

export const createDefaultProfile = (): PlayerProfile => ({
  profileVersion: CURRENT_PROFILE_VERSION,
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

const sanitizeProfileLike = (value: ProfileLike): PlayerProfile | null => {
  if (typeof value.currency !== 'number' || !Array.isArray(value.unlockedTalents)) {
    return null
  }
  if (!value.lifetimeStats) {
    return null
  }
  const stats = value.lifetimeStats
  if (
    typeof stats.runsPlayed !== 'number' ||
    typeof stats.totalScore !== 'number' ||
    typeof stats.totalKills !== 'number' ||
    typeof stats.bestFloor !== 'number'
  ) {
    return null
  }

  const normalized: PlayerProfile = {
    profileVersion: Math.max(1, Math.floor(value.profileVersion ?? 1)),
    currency: Math.max(0, Math.floor(value.currency)),
    unlockedTalents: value.unlockedTalents.filter(
      (talent): talent is TalentId =>
        typeof talent === 'string' && TALENT_IDS.includes(talent as TalentId),
    ),
    lifetimeStats: {
      runsPlayed: Math.max(0, Math.floor(stats.runsPlayed)),
      totalScore: Math.max(0, Math.floor(stats.totalScore)),
      totalKills: Math.max(0, Math.floor(stats.totalKills)),
      eliteKills: Math.max(
        0,
        Math.floor(typeof stats.eliteKills === 'number' ? stats.eliteKills : 0),
      ),
      bestFloor: Math.max(1, Math.floor(stats.bestFloor)),
    },
    goalProgress: createDefaultGoalProgress(),
    claimedGoals: createDefaultClaimedGoals(),
  }

  const goalEntries = Object.entries(value.goalProgress ?? {})
  for (const [goalId, progress] of goalEntries) {
    if (isGoalId(goalId) && typeof progress === 'number') {
      normalized.goalProgress[goalId] = Math.max(0, Math.floor(progress))
    }
  }
  const claimEntries = Object.entries(value.claimedGoals ?? {})
  for (const [goalId, claimed] of claimEntries) {
    if (isGoalId(goalId) && typeof claimed === 'boolean') {
      normalized.claimedGoals[goalId] = claimed
    }
  }

  return normalized
}

const migrateV1ToV2 = (profile: PlayerProfile): PlayerProfile => ({
  ...profile,
  profileVersion: 2,
  goalProgress: {
    ...createDefaultGoalProgress(),
    floor_5: Math.max(profile.goalProgress.floor_5, profile.lifetimeStats.bestFloor),
  },
  claimedGoals: createDefaultClaimedGoals(),
})

const migrateV2ToV3 = (profile: PlayerProfile): PlayerProfile => ({
  ...profile,
  profileVersion: 3,
  goalProgress: {
    floor_5: Math.max(0, Math.floor(profile.goalProgress.floor_5)),
    elite_hunter_12: Math.max(0, Math.floor(profile.goalProgress.elite_hunter_12)),
  },
  claimedGoals: {
    floor_5: Boolean(profile.claimedGoals.floor_5),
    elite_hunter_12: Boolean(profile.claimedGoals.elite_hunter_12),
  },
})

export const migrateProfileToCurrent = (profile: PlayerProfile): PlayerProfile => {
  let migrated = profile
  while (migrated.profileVersion < CURRENT_PROFILE_VERSION) {
    if (migrated.profileVersion === 1) {
      migrated = migrateV1ToV2(migrated)
      continue
    }
    if (migrated.profileVersion === 2) {
      migrated = migrateV2ToV3(migrated)
      continue
    }
    return createDefaultProfile()
  }
  return { ...migrated, profileVersion: CURRENT_PROFILE_VERSION }
}

export const parseAndMigrateProfile = (raw: string): PlayerProfile | null => {
  try {
    const parsed = JSON.parse(raw)
    if (!isObject(parsed)) {
      return null
    }
    const sanitized = sanitizeProfileLike(parsed)
    if (!sanitized) {
      return null
    }
    return migrateProfileToCurrent(sanitized)
  } catch {
    return null
  }
}
