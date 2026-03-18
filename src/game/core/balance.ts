import type { RunConfig, TalentId } from './types'

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
  biome: {
    id: 'void-depths',
    name: 'VOID DEPTHS',
    starCount: 36,
    rift: {
      tickMs: 3200,
      scoreOnSurviveTick: 4,
    },
    stalker: {
      unlockFloor: 2,
      spawnChance: 0.3,
      scoreOnKill: 35,
      speedMultiplier: 0.78,
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
}

export const getFloorSetup = (floor: number, enemySlowMultiplier = 1): FloorSetup => {
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

  return {
    wallCount,
    enemyCount,
    snakeLengthGoal,
    enemyIntervalMs,
  }
}
