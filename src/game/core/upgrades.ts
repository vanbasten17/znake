import { createSeededRng, deriveRunSeed } from '../simulation/rng'
import type { Upgrade, UpgradeFamily, UpgradeFamilyDefinition } from './types'

export const UPGRADE_FAMILIES: Record<UpgradeFamily, UpgradeFamilyDefinition> = {
  aggro: {
    id: 'aggro',
    label: 'AGGRO',
    summary: 'Tempo spikes, fast cuts, and proactive lane forcing.',
    tradeoff: 'Compresses reaction margins and punishes late turns.',
    color: 0xff8a3d,
  },
  control: {
    id: 'control',
    label: 'CONTROL',
    summary: 'Space shaping, safer routing, and lane ownership.',
    tradeoff: 'Lower burst payoff; value depends on clean path planning.',
    color: 0x57d4ff,
  },
  survival: {
    id: 'survival',
    label: 'SURVIVAL',
    summary: 'Mistake buffering, recovery, and run stability.',
    tradeoff: 'Less explosive tempo; wins through consistency over spikes.',
    color: 0x7dff9f,
  },
}

export const UPGRADE_POOL: Upgrade[] = [
  {
    id: 'overclock',
    family: 'aggro',
    name: 'OVERCLOCK',
    desc: 'Move faster, but the room feels tighter.',
    icon: 'S',
    color: 0xffc43d,
    gameplay: 'Cuts reaction windows so you can force shorter lines and greed harder routes.',
    tradeoff: 'High payoff when you read space early; punishes hesitation and sand lanes.',
    synergy: 'Pairs well with Phase Shift or Control tools that reopen safe lines.',
    tags: ['speed', 'routing', 'burst'],
    apply: (cfg) => {
      cfg.moveInterval = Math.max(72, Math.floor(cfg.moveInterval * 0.88))
      cfg.enemySlow *= 0.94
    },
  },
  {
    id: 'phase_shift',
    family: 'aggro',
    name: 'PHASE SHIFT',
    desc: 'Bank one wall pass for aggressive cuts.',
    icon: 'G',
    color: 0xb8b8ff,
    gameplay: 'Lets you route through edges instead of away from them.',
    tradeoff: 'Best when spent to steal tempo, not hoarded for perfect safety.',
    synergy: 'Combines with Overclock to convert speed into shortcut pressure.',
    tags: ['routing', 'burst'],
    apply: (cfg) => {
      cfg.ghostCharges += 1
      cfg.moveInterval = Math.max(72, Math.floor(cfg.moveInterval * 0.95))
    },
  },
  {
    id: 'core_surge',
    family: 'aggro',
    name: 'CORE SURGE',
    desc: 'Powerups pay extra score and growth if you can intercept them.',
    icon: 'C',
    color: 0xff6f61,
    gameplay: 'Turns pickup routes into burst windows that lengthen your pressure lines.',
    tradeoff: 'Value appears only if you detour into contested space to claim pickups.',
    synergy: 'Pairs well with Attractor and Time Rift to convert safe control into greed.',
    tags: ['burst', 'routing'],
    apply: (cfg) => {
      cfg.powerupScoreMult *= 1.75
      cfg.powerupGrowth += 1
    },
  },
  {
    id: 'attractor',
    family: 'control',
    name: 'ATTRACTOR',
    desc: 'Food bends toward your lane from farther away.',
    icon: 'M',
    color: 0x8e7cff,
    gameplay: 'Lets you claim food without overcommitting your full body path.',
    tradeoff: 'Strongest when you preserve open lanes instead of diving straight at targets.',
    synergy: 'Feeds Core Surge and buys time for Survival tools to stabilize.',
    tags: ['pickup-control', 'zoning'],
    apply: (cfg) => {
      cfg.hasMagnet = true
      cfg.magnetRadius = Math.max(cfg.magnetRadius, 6)
    },
  },
  {
    id: 'time_rift',
    family: 'control',
    name: 'TIME RIFT',
    desc: 'Enemy tempo slows so you can shape cleaner lines.',
    icon: 'T',
    color: 0xff88cc,
    gameplay: 'Creates more room to zone threats, pivot, and pre-plan turns.',
    tradeoff:
      'Gives safer tempo, but the payoff comes from cleaner decisions rather than raw damage.',
    synergy: 'Helps Overclock and Core Surge cash in on narrow windows without collapsing.',
    tags: ['zoning', 'stability'],
    apply: (cfg) => {
      cfg.enemySlow *= 1.28
    },
  },
  {
    id: 'biomass',
    family: 'control',
    name: 'BIOMASS',
    desc: 'Start longer so your body claims more space immediately.',
    icon: 'B',
    color: 0x00ff88,
    gameplay: 'Turns your body into a stronger zoning tool for corridors and pivots.',
    tradeoff: 'Extra length makes bad turns costlier, so lane planning matters more.',
    synergy: 'Plays nicely with Attractor and Cell Regen for controlled board ownership.',
    tags: ['body-control', 'zoning'],
    apply: (cfg) => {
      cfg.bonusStartLength += 3
    },
  },
  {
    id: 'void_shield',
    family: 'survival',
    name: 'VOID SHIELD',
    desc: 'Begin each floor with one more mistake buffered.',
    icon: 'D',
    color: 0x00aaff,
    gameplay: 'Adds forgiveness so risky rooms can be stabilized instead of instantly lost.',
    tradeoff: 'The shield buys time, but only if you use the breathing room to reset position.',
    synergy: 'Smooths out Aggro picks that compress your reaction window.',
    tags: ['shield', 'stability'],
    apply: (cfg) => {
      cfg.bonusShields += 1
    },
  },
  {
    id: 'cell_regen',
    family: 'survival',
    name: 'CELL REGEN',
    desc: 'Overgrown tails shed faster so bad body states recover.',
    icon: 'R',
    color: 0x44ffaa,
    gameplay:
      'Converts bloated body states into temporary pressure instead of permanent liability.',
    tradeoff: 'You regain control by giving up some long-tail map ownership over time.',
    synergy: 'Excellent with Biomass or any pickup-heavy route that grows often.',
    tags: ['recovery', 'body-control'],
    apply: (cfg) => {
      cfg.hasRegen = true
      cfg.regenIntervalMs = Math.min(cfg.regenIntervalMs, 3600)
    },
  },
  {
    id: 'reserve_bulk',
    family: 'survival',
    name: 'RESERVE BULK',
    desc: 'Start sturdier and cash pickups into safer recovery.',
    icon: 'H',
    color: 0x7dff9f,
    gameplay: 'Adds stable body mass while softening the risk of fighting over pickups.',
    tradeoff: 'Less explosive than Aggro tools; value comes from surviving crowded routes cleanly.',
    synergy: 'Stacks naturally with shields and lets Control tools hold space longer.',
    tags: ['shield', 'recovery', 'stability'],
    apply: (cfg) => {
      cfg.bonusStartLength += 2
      cfg.powerupGrowth += 1
    },
  },
]

const pickUpgradeForFamily = (
  family: UpgradeFamily,
  pool: Upgrade[],
  ownedIds: Set<string>,
  rng: ReturnType<typeof createSeededRng>,
): Upgrade | null => {
  const familyPool = pool.filter(
    (upgrade) => upgrade.family === family && !ownedIds.has(upgrade.id),
  )
  if (familyPool.length === 0) {
    return null
  }
  const upgrade = familyPool[rng.nextInt(0, familyPool.length - 1)] ?? null
  if (!upgrade) {
    return null
  }
  ownedIds.add(upgrade.id)
  return upgrade
}

const fillRandomUpgrades = (
  picks: Upgrade[],
  pool: Upgrade[],
  ownedIds: Set<string>,
  rng: ReturnType<typeof createSeededRng>,
  count: number,
): Upgrade[] => {
  const remainingPool = pool.filter((upgrade) => !ownedIds.has(upgrade.id))
  while (picks.length < count && remainingPool.length > 0) {
    const idx = rng.nextInt(0, remainingPool.length - 1)
    const upgrade = remainingPool.splice(idx, 1)[0]
    if (!upgrade) {
      continue
    }
    ownedIds.add(upgrade.id)
    picks.push(upgrade)
  }
  return picks
}

export const drawUpgradeDraft = (params: {
  runSeed: number
  floor: number
  ownedUpgradeIds?: ReadonlyArray<string>
  count?: number
}): Upgrade[] => {
  const count = Math.max(1, params.count ?? 3)
  const ownedIds = new Set(params.ownedUpgradeIds ?? [])
  const availablePool = UPGRADE_POOL.filter((upgrade) => !ownedIds.has(upgrade.id))
  if (availablePool.length === 0) {
    return []
  }

  const rng = createSeededRng(deriveRunSeed([params.runSeed, params.floor, 0x55504752]))
  const picks: Upgrade[] = []
  const contrastFamilies = ['aggro', 'control', 'survival'] as const

  if (count >= 3) {
    for (const family of contrastFamilies) {
      if (picks.length >= count) {
        break
      }
      const upgrade = pickUpgradeForFamily(family, availablePool, ownedIds, rng)
      if (upgrade) {
        picks.push(upgrade)
      }
    }
  }

  return fillRandomUpgrades(picks, UPGRADE_POOL, ownedIds, rng, count)
}
