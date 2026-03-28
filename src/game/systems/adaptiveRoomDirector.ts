import type { ProgressionDirectorSnapshot } from '../core/types'

export type AdaptivePressureBand = 'recovery' | 'neutral' | 'pressure'

export type AdaptiveRoomPressureInput = {
  snapshot: ProgressionDirectorSnapshot
  baseEnemyCount: number
  baseEnemyIntervalMs: number
  shields: number
}

export type AdaptiveRoomPressureResult = {
  pressureBand: AdaptivePressureBand
  enemyCount: number
  enemyIntervalMs: number
}

const resolvePressureBand = (shields: number): AdaptivePressureBand => {
  if (shields <= 0) {
    return 'recovery'
  }
  if (shields >= 2) {
    return 'pressure'
  }
  return 'neutral'
}

export const resolveAdaptiveRoomPressure = (
  input: AdaptiveRoomPressureInput,
): AdaptiveRoomPressureResult => {
  const pressureBand = resolvePressureBand(input.shields)
  const depthAggro =
    input.snapshot.depthBand === 'late' ? 1 : input.snapshot.depthBand === 'mid' ? 0.7 : 0.4

  if (pressureBand === 'recovery') {
    return {
      pressureBand,
      enemyCount: Math.max(1, input.baseEnemyCount - 1),
      enemyIntervalMs: Math.max(
        180,
        Math.floor(input.baseEnemyIntervalMs + 40 + 20 * (1 - depthAggro)),
      ),
    }
  }

  if (pressureBand === 'pressure') {
    return {
      pressureBand,
      enemyCount: Math.max(
        1,
        input.baseEnemyCount + (input.snapshot.depthBand === 'early' ? 0 : 1),
      ),
      enemyIntervalMs: Math.max(
        180,
        Math.floor(input.baseEnemyIntervalMs * (1 - 0.02 * depthAggro)),
      ),
    }
  }

  return {
    pressureBand,
    enemyCount: Math.max(1, input.baseEnemyCount),
    enemyIntervalMs: Math.max(180, Math.floor(input.baseEnemyIntervalMs)),
  }
}
