import type {
  BodyTerrainGuardrailReason,
  BodyTerrainSnapshot,
  Enemy,
  SnakeSegment,
} from '../core/types'

type BodyTerrainConfig = {
  zoneRadius: number
  laneDistance: number
  guardrails: {
    minSafePocketNeighbors: number
    pressureSourceThreshold: number
  }
}

export const createEmptyBodyTerrainSnapshot = (): BodyTerrainSnapshot => ({
  laneControlSegments: 0,
  zoneControlSegments: 0,
  safePocketNeighbors: 0,
  trapRisk: false,
})

export const summarizeBodyTerrain = (params: {
  head: SnakeSegment | null
  snake: ReadonlyArray<SnakeSegment>
  enemies: ReadonlyArray<Enemy>
  isWall: (x: number, y: number) => boolean
  config: BodyTerrainConfig
}): BodyTerrainSnapshot => {
  const head = params.head
  if (!head) {
    return createEmptyBodyTerrainSnapshot()
  }
  const laneDistance = Math.max(1, Math.floor(params.config.laneDistance))
  const zoneRadius = Math.max(0, Math.floor(params.config.zoneRadius))
  const body = params.snake.slice(1)

  let laneControlSegments = 0
  let zoneControlSegments = 0
  for (const segment of body) {
    const dx = Math.abs(segment.x - head.x)
    const dy = Math.abs(segment.y - head.y)
    const manhattan = dx + dy
    if ((segment.x === head.x || segment.y === head.y) && manhattan <= laneDistance) {
      laneControlSegments += 1
    }
    if (manhattan <= zoneRadius) {
      zoneControlSegments += 1
    }
  }

  const occupiedBySnake = new Set(params.snake.map((segment) => `${segment.x},${segment.y}`))
  const occupiedByEnemy = new Set<string>()
  for (const enemy of params.enemies) {
    if (!enemy.alive) {
      continue
    }
    for (const segment of enemy.body) {
      occupiedByEnemy.add(`${segment.x},${segment.y}`)
    }
  }

  const dirs = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ]
  let safePocketNeighbors = 0
  for (const dir of dirs) {
    const nx = head.x + dir.x
    const ny = head.y + dir.y
    const key = `${nx},${ny}`
    if (params.isWall(nx, ny) || occupiedBySnake.has(key) || occupiedByEnemy.has(key)) {
      continue
    }
    safePocketNeighbors += 1
  }

  return {
    laneControlSegments,
    zoneControlSegments,
    safePocketNeighbors,
    trapRisk: safePocketNeighbors <= 1,
  }
}

export const shouldBlockBodySpendForTerrain = (params: {
  snapshot: BodyTerrainSnapshot
  activePressureSources: number
  config: BodyTerrainConfig
}): { allow: true; reason: null } | { allow: false; reason: BodyTerrainGuardrailReason } => {
  const minSafe = Math.max(0, Math.floor(params.config.guardrails.minSafePocketNeighbors))
  const pressureThreshold = Math.max(
    0,
    Math.floor(params.config.guardrails.pressureSourceThreshold),
  )
  if (
    params.activePressureSources >= pressureThreshold &&
    params.snapshot.safePocketNeighbors <= minSafe
  ) {
    return { allow: false, reason: 'low_safe_pocket_under_pressure' }
  }
  return { allow: true, reason: null }
}
