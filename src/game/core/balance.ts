import type { NonBossObjectiveKind, RunConfig, TalentId } from './types'

export const BALANCE = {
  run: {
    moveIntervalMs: 160,
    baseSnakeLength: 4,
    bonusStartLength: 0,
    bonusShields: 0,
    hasMagnet: false,
    ghostCharges: 0,
    scoreMult: 1,
    enemySlow: 1,
    hasRegen: false,
  },
  floor: {
    wallBase: 2,
    wallPerFloor: 1,
    wallCap: 7,
    enemyBase: 1,
    enemyPerFloorStep: 2,
    enemyCap: 4,
    foodGoalBase: 7,
    foodGoalPerFloor: 2,
    lengthGoalBase: 8,
    lengthGoalPerFloor: 1,
    enemyIntervalBaseMs: 550,
    enemyIntervalPerFloorMs: 30,
    enemyIntervalMinMs: 350,
  },
  portal: {
    countdownBaseMs: 10000,
    countdownPerFloorMs: 0,
    countdownMinMs: 10000,
    graceMs: 7000,
    squeezeStepMs: 3600,
    squeezeMaxInset: 8,
  },
  modifiers: {
    darkness: {
      enabled: true,
      startFloor: 1,
      minVisibilityRadius: 6,
      maxVisibilityRadius: 4,
      minEdgeFalloff: 2,
      maxEdgeFalloff: 1,
      minAlphaOuter: 0.26,
      maxAlphaOuter: 0.76,
      minAlphaEdge: 0.16,
      maxAlphaEdge: 0.44,
    },
    ice: {
      enabled: true,
      startFloor: 2,
      cadence: 2,
      minTileCount: 3,
      maxTileCount: 7,
      slideSteps: 1,
    },
    sand: {
      enabled: true,
      startFloor: 3,
      cadence: 2,
      minTileCount: 3,
      maxTileCount: 6,
      movePenaltyMs: 45,
    },
  },
  objectives: {
    rotation: ['portal', 'score', 'kills'] satisfies ReadonlyArray<NonBossObjectiveKind>,
    scoreTargetBase: 36,
    scoreTargetPerFloor: 8,
    scoreTargetCap: 180,
    killTargetBase: 1,
    killTargetPerFloorStep: 2,
    killTargetCap: 4,
  },
  spawn: {
    powerupAtFloorStartChance: 0.4,
    powerupOnFoodChance: 0.3,
    powerupRespawnChance: 0.5,
    powerupRespawnDelayMs: 5000,
    enemyRespawnOnShieldHitChance: 0.3,
    enemyRespawnIdleChance: 0.05,
  },
  enemy: {
    scoreOnKill: 20,
    lengthBase: 2,
    lengthRandomRange: 2,
    lengthFloorStep: 3,
  },
  elite: {
    spawnByFloor: [
      {
        minFloor: 1,
        spawnChance: 0,
        kindWeights: {
          stalker: 1,
          ambusher: 0,
        },
      },
      {
        minFloor: 2,
        spawnChance: 0.3,
        kindWeights: {
          stalker: 1,
          ambusher: 0,
        },
      },
      {
        minFloor: 4,
        spawnChance: 0.38,
        kindWeights: {
          stalker: 0.7,
          ambusher: 0.3,
        },
      },
      {
        minFloor: 7,
        spawnChance: 0.44,
        kindWeights: {
          stalker: 0.55,
          ambusher: 0.45,
        },
      },
    ],
    stalker: {
      scoreOnKill: 35,
      speedMultiplier: 0.78,
    },
    ambusher: {
      scoreOnKill: 55,
      dashChanceWhenAligned: 0.75,
      dashSteps: 2,
      dashMinLaneDistance: 2,
      dashCooldownTurns: 3,
    },
  },
  item: {
    spawnByFloor: [
      { minFloor: 1, riftBatteryOnFoodChance: 0, portalBeaconOnFoodChance: 0 },
      { minFloor: 2, riftBatteryOnFoodChance: 0.08, portalBeaconOnFoodChance: 0.02 },
      { minFloor: 4, riftBatteryOnFoodChance: 0.14, portalBeaconOnFoodChance: 0.025 },
      { minFloor: 7, riftBatteryOnFoodChance: 0.2, portalBeaconOnFoodChance: 0.03 },
    ],
    effectDurations: {
      riftSuppressionMs: 9000,
      portalAccelerateMs: 4500,
    },
  },
  biome: {
    id: 'void-depths',
    name: 'VOID DEPTHS',
    starCount: 36,
    rift: {
      tickMs: 3200,
      scoreOnSurviveTick: 4,
    },
    coreItem: {
      spawnFloor: 2,
      spawnChanceOnFood: 0.18,
      scoreBonus: 45,
      growthBonus: 2,
    },
    boss: {
      floorInterval: 3,
      health: 3,
      length: 7,
      scoreOnDefeat: 140,
    },
  },
  food: {
    scoreOnEat: 10,
  },
  powerup: {
    scoreBonus: 30,
    slowMultiplier: 1.5,
  },
  regen: {
    intervalMs: 5000,
  },
  economy: {
    rewardScoreDivisor: 26,
    rewardKillValue: 4,
    rewardFloorValue: 8,
    rewardMin: 4,
    goals: {
      floor_5: {
        target: 5,
        reward: 35,
      },
      elite_hunter_12: {
        target: 12,
        reward: 45,
      },
    },
  },
  talents: {
    costs: {
      speed_1: 15,
      speed_2: 40,
      survival_1: 20,
      survival_2: 40,
      hunt_1: 25,
      hunt_2: 50,
    } satisfies Record<TalentId, number>,
  },
} as const

export const createBaseRunConfig = (): RunConfig => ({
  moveInterval: BALANCE.run.moveIntervalMs,
  bonusStartLength: BALANCE.run.bonusStartLength,
  bonusShields: BALANCE.run.bonusShields,
  hasMagnet: BALANCE.run.hasMagnet,
  ghostCharges: BALANCE.run.ghostCharges,
  scoreMult: BALANCE.run.scoreMult,
  enemySlow: BALANCE.run.enemySlow,
  hasRegen: BALANCE.run.hasRegen,
})

export type FloorSetup = {
  wallCount: number
  enemyCount: number
  snakeLengthGoal: number
  enemyIntervalMs: number
  darknessActive: boolean
  darknessRadius: number
  darknessEdgeFalloff: number
  darknessAlphaOuter: number
  darknessAlphaEdge: number
  iceActive: boolean
  iceTileCount: number
  iceSlideSteps: number
  sandActive: boolean
  sandTileCount: number
  sandMovePenaltyMs: number
}

export const getFloorSetup = (floor: number, enemySlowMultiplier = 1): FloorSetup => {
  const lerp = (from: number, to: number, t: number): number => from + (to - from) * t
  const clampedFloor = Math.max(1, Math.floor(floor))
  const isBossFloor = clampedFloor % BALANCE.biome.boss.floorInterval === 0
  const wallCount = Math.min(
    BALANCE.floor.wallBase + clampedFloor * BALANCE.floor.wallPerFloor,
    BALANCE.floor.wallCap,
  )
  const enemyCount = Math.min(
    BALANCE.floor.enemyBase + Math.floor(clampedFloor / BALANCE.floor.enemyPerFloorStep),
    BALANCE.floor.enemyCap,
  )
  const progressOffset = (clampedFloor - 1) % BALANCE.biome.boss.floorInterval
  const snakeLengthGoal = isBossFloor
    ? 0
    : BALANCE.floor.lengthGoalBase + progressOffset * BALANCE.floor.lengthGoalPerFloor
  const enemyIntervalMs =
    Math.max(
      BALANCE.floor.enemyIntervalMinMs,
      BALANCE.floor.enemyIntervalBaseMs - clampedFloor * BALANCE.floor.enemyIntervalPerFloorMs,
    ) * enemySlowMultiplier
  const darknessConfig = BALANCE.modifiers.darkness
  const iceConfig = BALANCE.modifiers.ice
  const sandConfig = BALANCE.modifiers.sand
  const bossInterval = Math.max(2, BALANCE.biome.boss.floorInterval)
  const cycleStep = (clampedFloor - 1) % bossInterval
  const preBossSteps = Math.max(1, bossInterval - 1)
  const preBossProgress = preBossSteps <= 1 ? 1 : cycleStep / (preBossSteps - 1)
  const darknessActive =
    darknessConfig.enabled &&
    !isBossFloor &&
    clampedFloor >= darknessConfig.startFloor &&
    cycleStep < preBossSteps
  const iceActive =
    iceConfig.enabled &&
    !isBossFloor &&
    clampedFloor >= iceConfig.startFloor &&
    (clampedFloor - iceConfig.startFloor) % Math.max(1, iceConfig.cadence) === 0
  const sandActive =
    sandConfig.enabled &&
    !isBossFloor &&
    clampedFloor >= sandConfig.startFloor &&
    (clampedFloor - sandConfig.startFloor) % Math.max(1, sandConfig.cadence) === 0
  const darknessT = darknessActive ? Math.min(1, Math.max(0, preBossProgress)) : 0
  const iceT = iceActive ? Math.min(1, Math.max(0, preBossProgress)) : 0
  const sandT = sandActive ? Math.min(1, Math.max(0, preBossProgress)) : 0

  return {
    wallCount,
    enemyCount,
    snakeLengthGoal,
    enemyIntervalMs,
    darknessActive,
    darknessRadius: Math.round(
      lerp(darknessConfig.minVisibilityRadius, darknessConfig.maxVisibilityRadius, darknessT),
    ),
    darknessEdgeFalloff: Math.max(
      0,
      Math.round(lerp(darknessConfig.minEdgeFalloff, darknessConfig.maxEdgeFalloff, darknessT)),
    ),
    darknessAlphaOuter: lerp(darknessConfig.minAlphaOuter, darknessConfig.maxAlphaOuter, darknessT),
    darknessAlphaEdge: lerp(darknessConfig.minAlphaEdge, darknessConfig.maxAlphaEdge, darknessT),
    iceActive,
    iceTileCount: Math.round(lerp(iceConfig.minTileCount, iceConfig.maxTileCount, iceT)),
    iceSlideSteps: Math.max(0, Math.floor(iceConfig.slideSteps)),
    sandActive,
    sandTileCount: Math.round(lerp(sandConfig.minTileCount, sandConfig.maxTileCount, sandT)),
    sandMovePenaltyMs: Math.max(0, Math.floor(sandConfig.movePenaltyMs)),
  }
}
