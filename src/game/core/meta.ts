import { STORAGE_KEYS } from './constants'
import type {
  PlayerProfile,
  RelicDefinition,
  RelicId,
  RunConfig,
  TalentDefinition,
  TalentId,
} from './types'

const PROFILE_VERSION = 1

const defaultProfile = (): PlayerProfile => ({
  profileVersion: PROFILE_VERSION,
  currency: 0,
  unlockedTalents: [],
  lifetimeStats: {
    runsPlayed: 0,
    totalScore: 0,
    totalKills: 0,
    bestFloor: 1,
  },
})

export const TALENT_TREE: TalentDefinition[] = [
  {
    id: 'speed_1',
    name: 'Speed I',
    description: 'Start 5% faster.',
    cost: 20,
    requires: null,
    apply: (cfg) => {
      cfg.moveInterval = Math.max(90, Math.floor(cfg.moveInterval * 0.95))
    },
  },
  {
    id: 'speed_2',
    name: 'Speed II',
    description: 'Start 10% faster.',
    cost: 55,
    requires: 'speed_1',
    apply: (cfg) => {
      cfg.moveInterval = Math.max(80, Math.floor(cfg.moveInterval * 0.9))
    },
  },
  {
    id: 'survival_1',
    name: 'Survival I',
    description: 'Start with +1 shield.',
    cost: 25,
    requires: null,
    apply: (cfg) => {
      cfg.bonusShields += 1
    },
  },
  {
    id: 'survival_2',
    name: 'Survival II',
    description: 'Start with +2 length.',
    cost: 50,
    requires: 'survival_1',
    apply: (cfg) => {
      cfg.bonusStartLength += 2
    },
  },
  {
    id: 'hunt_1',
    name: 'Hunt I',
    description: 'Higher score multiplier.',
    cost: 30,
    requires: null,
    apply: (cfg) => {
      cfg.scoreMult *= 1.2
    },
  },
  {
    id: 'hunt_2',
    name: 'Hunt II',
    description: 'Enemies move slower.',
    cost: 60,
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
  const raw = localStorage.getItem(STORAGE_KEYS.profile)
  if (!raw) {
    return defaultProfile()
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PlayerProfile>
    if (
      parsed.profileVersion !== PROFILE_VERSION ||
      typeof parsed.currency !== 'number' ||
      !Array.isArray(parsed.unlockedTalents) ||
      !parsed.lifetimeStats ||
      typeof parsed.lifetimeStats.runsPlayed !== 'number' ||
      typeof parsed.lifetimeStats.totalScore !== 'number' ||
      typeof parsed.lifetimeStats.totalKills !== 'number' ||
      typeof parsed.lifetimeStats.bestFloor !== 'number'
    ) {
      return defaultProfile()
    }
    return {
      profileVersion: PROFILE_VERSION,
      currency: Math.max(0, Math.floor(parsed.currency)),
      unlockedTalents: parsed.unlockedTalents.filter(isTalentId),
      lifetimeStats: {
        runsPlayed: Math.max(0, Math.floor(parsed.lifetimeStats.runsPlayed)),
        totalScore: Math.max(0, Math.floor(parsed.lifetimeStats.totalScore)),
        totalKills: Math.max(0, Math.floor(parsed.lifetimeStats.totalKills)),
        bestFloor: Math.max(1, Math.floor(parsed.lifetimeStats.bestFloor)),
      },
    }
  } catch {
    return defaultProfile()
  }
}

export const saveProfile = (profile: PlayerProfile): void => {
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile))
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
  const scorePart = Math.floor(score / 30)
  const killPart = kills * 3
  const floorPart = Math.max(0, floor - 1) * 6
  return Math.max(3, scorePart + killPart + floorPart)
}

export const createDefaultProfileForTests = defaultProfile
