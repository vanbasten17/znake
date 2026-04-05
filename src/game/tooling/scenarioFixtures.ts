import type { RouteMasterySummary, RunMapPreviewChoice, RunMapRoomType, Vec2 } from '../core/types'
import { createSeededRng } from '../simulation/rng'

export type ScenarioFixtureId =
  | 'route_risk_preview'
  | 'input_buffer_turn'
  | 'death_recap_cause'
  | 'telemetry_balance_snapshot'

export const SCENARIO_FIXTURE_SEEDS: Record<ScenarioFixtureId, number> = {
  route_risk_preview: 31001,
  input_buffer_turn: 31011,
  death_recap_cause: 31021,
  telemetry_balance_snapshot: 31031,
}

const ROOM_TYPES: RunMapRoomType[] = ['combat', 'elite', 'shop', 'rest', 'event']
const CARDINALS: Vec2[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
]

export const getScenarioFixtureSeed = (fixtureId: ScenarioFixtureId): number =>
  SCENARIO_FIXTURE_SEEDS[fixtureId]

export const buildRouteRiskPreviewFixture = (
  seed = SCENARIO_FIXTURE_SEEDS.route_risk_preview,
): Pick<RunMapPreviewChoice, 'roomType' | 'previewRoomTypes'> => {
  const rng = createSeededRng(seed)
  const roomType = ROOM_TYPES[rng.nextInt(0, ROOM_TYPES.length - 1)] ?? 'combat'
  const previewRoomTypes: RunMapRoomType[] = [roomType]
  const previewCount = 2 + rng.nextInt(0, 1)
  for (let index = 0; index < previewCount; index += 1) {
    previewRoomTypes.push(ROOM_TYPES[rng.nextInt(0, ROOM_TYPES.length - 1)] ?? 'combat')
  }
  return {
    roomType,
    previewRoomTypes,
  }
}

export const buildInputBufferFixture = (
  seed = SCENARIO_FIXTURE_SEEDS.input_buffer_turn,
): {
  currentDir: Vec2
  next: Vec2
  moveQueue: Vec2[]
  maxTurnQueue: number
  graceSteps: number
  currentStep: number
} => {
  const rng = createSeededRng(seed)
  const currentDir = CARDINALS[rng.nextInt(0, CARDINALS.length - 1)] ?? { x: 1, y: 0 }
  const next = CARDINALS[rng.nextInt(0, CARDINALS.length - 1)] ?? { x: 0, y: 1 }
  return {
    currentDir,
    next,
    moveQueue: [],
    maxTurnQueue: 1,
    graceSteps: 1,
    currentStep: 10 + rng.nextInt(0, 4),
  }
}

export const buildDeathRecapCauseFixture = (
  seed = SCENARIO_FIXTURE_SEEDS.death_recap_cause,
): {
  deathReasonHistory: string[]
  routeMastery: RouteMasterySummary
} => {
  const rng = createSeededRng(seed)
  const reasons = ['enemy', 'wall', 'elite', 'boss', 'projectile']
  return {
    deathReasonHistory: Array.from(
      { length: 6 },
      () => reasons[rng.nextInt(0, reasons.length - 1)] ?? 'unknown',
    ),
    routeMastery: {
      routeDecisions: 2 + rng.nextInt(0, 3),
      branchDecisions: 1 + rng.nextInt(0, 2),
      eliteChoices: 1 + rng.nextInt(0, 2),
      nonCombatChoices: rng.nextInt(0, 2),
      biomePivotChoices: rng.nextInt(0, 2),
      previewEliteSeen: 1 + rng.nextInt(0, 2),
    },
  }
}
