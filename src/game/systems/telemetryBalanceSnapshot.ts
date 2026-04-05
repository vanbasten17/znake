import type { BodyEconomyRuntimeState, RouteMasterySummary } from '../core/types'
import { normalizeTelemetryPayload } from './telemetryGateway'

export const BALANCE_SNAPSHOT_SCHEMA_VERSION = 1

export type BalanceSnapshotInput = {
  runSeed: number
  floor: number
  score: number
  kills: number
  shields: number
  snakeLength: number
  routeMastery: RouteMasterySummary
  bodyEconomy: Pick<BodyEconomyRuntimeState, 'rewardOverclockUsesInWindow'>
}

export type BalanceSnapshotEnvelope = {
  schemaVersion: number
  eventType: 'balance_snapshot'
  payload: Record<string, unknown>
}

export const buildBalanceSnapshotEnvelope = (
  input: BalanceSnapshotInput,
): BalanceSnapshotEnvelope => ({
  schemaVersion: BALANCE_SNAPSHOT_SCHEMA_VERSION,
  eventType: 'balance_snapshot',
  payload: normalizeTelemetryPayload({
    run_seed: input.runSeed,
    floor: input.floor,
    score: input.score,
    kills: input.kills,
    shields: input.shields,
    snake_length: input.snakeLength,
    route_mastery_decisions: input.routeMastery.routeDecisions,
    route_mastery_branch_decisions: input.routeMastery.branchDecisions,
    route_mastery_elite_choices: input.routeMastery.eliteChoices,
    route_mastery_non_combat_choices: input.routeMastery.nonCombatChoices,
    route_mastery_biome_pivots: input.routeMastery.biomePivotChoices,
    reward_overclock_uses: input.bodyEconomy.rewardOverclockUsesInWindow,
  }),
})
