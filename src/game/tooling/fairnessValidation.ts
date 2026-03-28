import { BALANCE, getDepthBandForFloor, getFloorSetup } from '../core/balance'
import { BASE_COLS, BASE_ROWS } from '../core/constants'
import type { DepthBalanceBandId, Vec2 } from '../core/types'
import { type OccupancySnapshot, isOccupied } from '../simulation/grid'
import { generateClassicWalls } from '../simulation/layout'
import { createSeededRng } from '../simulation/rng'
import { isFairSpawnCell } from '../simulation/spawn'

type FairnessThreshold = {
  minReactionWindowMs: number
  minRecoverabilityRate: number
  maxCheapHitRate: number
}

type BandProbe = {
  seed: number
  reactionWindowMs: number
  recoverabilityRate: number
  cheapHitRate: number
}

type BandSummary = {
  floor: number
  seedCount: number
  thresholds: FairnessThreshold
  metrics: {
    reactionWindowMsAvg: number
    recoverabilityRateAvg: number
    cheapHitRateAvg: number
  }
  pass: {
    reactionWindowMs: boolean
    recoverabilityRate: boolean
    cheapHitRate: boolean
  }
  probes: BandProbe[]
}

export type FairnessValidationReport = {
  generatedAt: string
  seeds: number[]
  sampleSpawnAttemptsPerBand: number
  summary: {
    passed: boolean
    failures: string[]
  }
  depthBands: Record<DepthBalanceBandId, BandSummary>
}

const representativeFloorByBand = (): Record<DepthBalanceBandId, number> => ({
  early: BALANCE.depthBalance.bands.find((band) => band.id === 'early')?.maxFloor ?? 3,
  mid: BALANCE.depthBalance.bands.find((band) => band.id === 'mid')?.maxFloor ?? 8,
  late: BALANCE.depthBalance.bands.find((band) => band.id === 'late')?.maxFloor ?? 13,
})

const mean = (values: number[]): number =>
  values.length > 0 ? values.reduce((acc, value) => acc + value, 0) / values.length : 0

const isCheapHitCell = (
  cell: Vec2,
  playerHead: Vec2,
  playerDir: Vec2,
  minManhattanDistance: number,
  avoidForwardLaneSteps: number,
): boolean => {
  const distance = Math.abs(cell.x - playerHead.x) + Math.abs(cell.y - playerHead.y)
  if (distance < minManhattanDistance) {
    return true
  }
  for (let step = 1; step <= avoidForwardLaneSteps; step += 1) {
    if (
      cell.x === playerHead.x + playerDir.x * step &&
      cell.y === playerHead.y + playerDir.y * step
    ) {
      return true
    }
  }
  return false
}

const evaluateBandProbe = (params: {
  floor: number
  seed: number
  sampleSpawnAttemptsPerBand: number
}): BandProbe => {
  const floorSetup = getFloorSetup(params.floor, 1)
  const rng = createSeededRng(params.seed + params.floor * 1000)
  const walls = generateClassicWalls({
    cols: BASE_COLS,
    rows: BASE_ROWS,
    wallCount: floorSetup.wallCount,
    centerSafeRadius: 4,
    rng,
  })
  const center = { x: Math.floor(BASE_COLS / 2), y: Math.floor(BASE_ROWS / 2) }
  const occupancy: OccupancySnapshot = {
    walls,
    snake: [center, { x: center.x - 1, y: center.y }, { x: center.x - 2, y: center.y }],
    enemies: [],
    portals: [],
    food: null,
    powerup: null,
    biomeItem: null,
    rift: null,
  }

  const fairness = {
    playerHead: center,
    playerDir: { x: 1, y: 0 },
    minManhattanDistance: BALANCE.combatFairness.spawn.enemyMinDistanceFromPlayer,
    avoidForwardLaneSteps: BALANCE.combatFairness.spawn.avoidPlayerForwardLaneSteps,
    minOpenNeighborCount: BALANCE.combatFairness.spawn.minOpenNeighborCount,
    bodyLength: 2,
  }

  let total = 0
  let cheapHits = 0
  let recoverable = 0
  for (
    let attempts = 0;
    attempts < params.sampleSpawnAttemptsPerBand * 10 && total < params.sampleSpawnAttemptsPerBand;
    attempts += 1
  ) {
    const cell = {
      x: rng.nextInt(1, BASE_COLS - 2),
      y: rng.nextInt(1, BASE_ROWS - 2),
    }
    if (isOccupied(cell.x, cell.y, occupancy)) {
      continue
    }
    total += 1
    if (
      isCheapHitCell(
        cell,
        fairness.playerHead,
        fairness.playerDir,
        fairness.minManhattanDistance,
        fairness.avoidForwardLaneSteps,
      )
    ) {
      cheapHits += 1
    }
    if (isFairSpawnCell(cell, BASE_COLS, BASE_ROWS, occupancy, fairness)) {
      recoverable += 1
    }
  }

  const denominator = Math.max(1, total)
  const reactionWindowMs = Math.max(
    BALANCE.combatFairness.grace.postHitMs,
    BALANCE.combatFairness.telegraph.ambusherDashTicks * floorSetup.enemyIntervalMs,
  )
  return {
    seed: params.seed,
    reactionWindowMs,
    recoverabilityRate: recoverable / denominator,
    cheapHitRate: cheapHits / denominator,
  }
}

export const evaluateFairnessValidationSuite = (params?: {
  nowIso?: string
  seeds?: number[]
  sampleSpawnAttemptsPerBand?: number
  thresholdsByBand?: Partial<Record<DepthBalanceBandId, FairnessThreshold>>
}): FairnessValidationReport => {
  const floors = representativeFloorByBand()
  const seeds = params?.seeds ?? [...BALANCE.validation.fairnessSuite.seeds]
  const sampleSpawnAttemptsPerBand =
    params?.sampleSpawnAttemptsPerBand ??
    BALANCE.validation.fairnessSuite.sampleSpawnAttemptsPerBand

  const summaries = (['early', 'mid', 'late'] as const).reduce<
    Record<DepthBalanceBandId, BandSummary>
  >(
    (acc, band) => {
      const floor = floors[band]
      const probes = seeds.map((seed) =>
        evaluateBandProbe({
          floor,
          seed,
          sampleSpawnAttemptsPerBand,
        }),
      )
      const thresholds =
        params?.thresholdsByBand?.[band] ?? BALANCE.validation.fairnessSuite.byDepthBand[band]
      const reactionWindowMsAvg = mean(probes.map((probe) => probe.reactionWindowMs))
      const recoverabilityRateAvg = mean(probes.map((probe) => probe.recoverabilityRate))
      const cheapHitRateAvg = mean(probes.map((probe) => probe.cheapHitRate))
      acc[band] = {
        floor,
        seedCount: seeds.length,
        thresholds,
        metrics: {
          reactionWindowMsAvg,
          recoverabilityRateAvg,
          cheapHitRateAvg,
        },
        pass: {
          reactionWindowMs: reactionWindowMsAvg >= thresholds.minReactionWindowMs,
          recoverabilityRate: recoverabilityRateAvg >= thresholds.minRecoverabilityRate,
          cheapHitRate: cheapHitRateAvg <= thresholds.maxCheapHitRate,
        },
        probes,
      }
      return acc
    },
    {
      early: {} as BandSummary,
      mid: {} as BandSummary,
      late: {} as BandSummary,
    },
  )

  const failures: string[] = []
  for (const band of ['early', 'mid', 'late'] as const) {
    const summary = summaries[band]
    if (!summary.pass.reactionWindowMs) {
      failures.push(`${band}:reactionWindowMs`)
    }
    if (!summary.pass.recoverabilityRate) {
      failures.push(`${band}:recoverabilityRate`)
    }
    if (!summary.pass.cheapHitRate) {
      failures.push(`${band}:cheapHitRate`)
    }
  }

  return {
    generatedAt: params?.nowIso ?? new Date().toISOString(),
    seeds,
    sampleSpawnAttemptsPerBand,
    summary: {
      passed: failures.length === 0,
      failures,
    },
    depthBands: summaries,
  }
}

export const getDepthBandForFairnessFloor = (floor: number): DepthBalanceBandId =>
  getDepthBandForFloor(floor)
