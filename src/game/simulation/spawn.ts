import type { Vec2 } from '../core/types'
import type { OccupancySnapshot } from './grid'
import { inInnerBounds, isOccupied } from './grid'
import type { GameRng } from './rng'

export type PickOpenCellOptions = {
  cols: number
  rows: number
  occupancy: OccupancySnapshot
  rng: GameRng
  preferredZoneCells?: Set<string> | null
  minDistanceFromCenter?: number
  fairness?: SpawnFairnessOptions
}

export type SpawnFairnessOptions = {
  playerHead?: Vec2 | null
  playerDir?: Vec2 | null
  minManhattanDistance?: number
  avoidForwardLaneSteps?: number
  minOpenNeighborCount?: number
  bodyLength?: number
}

const parseCell = (value: string): Vec2 => {
  const [xRaw, yRaw] = value.split(',')
  return { x: Number(xRaw), y: Number(yRaw) }
}

export const pickOpenCell = (options: PickOpenCellOptions): Vec2 => {
  const {
    cols,
    rows,
    occupancy,
    rng,
    preferredZoneCells = null,
    minDistanceFromCenter = 0,
    fairness,
  } = options
  const cx = Math.floor(cols / 2)
  const cy = Math.floor(rows / 2)

  const candidates: Vec2[] = []
  if (preferredZoneCells && preferredZoneCells.size > 0) {
    for (const cell of preferredZoneCells) {
      const parsed = parseCell(cell)
      if (!inInnerBounds(parsed.x, parsed.y, cols, rows)) {
        continue
      }
      if (Math.abs(parsed.x - cx) + Math.abs(parsed.y - cy) < minDistanceFromCenter) {
        continue
      }
      if (isOccupied(parsed.x, parsed.y, occupancy)) {
        continue
      }
      if (!isFairSpawnCell(parsed, cols, rows, occupancy, fairness)) {
        continue
      }
      candidates.push(parsed)
    }
  } else {
    for (let y = 1; y < rows - 1; y += 1) {
      for (let x = 1; x < cols - 1; x += 1) {
        if (Math.abs(x - cx) + Math.abs(y - cy) < minDistanceFromCenter) {
          continue
        }
        if (isOccupied(x, y, occupancy)) {
          continue
        }
        if (!isFairSpawnCell({ x, y }, cols, rows, occupancy, fairness)) {
          continue
        }
        candidates.push({ x, y })
      }
    }
  }

  const picked = rng.pick(candidates)
  if (picked) {
    return picked
  }

  if (fairness) {
    return pickOpenCell({
      ...options,
      fairness: undefined,
    })
  }

  for (let attempts = 0; attempts < 300; attempts += 1) {
    const x = rng.nextInt(1, cols - 2)
    const y = rng.nextInt(1, rows - 2)
    if (
      !isOccupied(x, y, occupancy) &&
      isFairSpawnCell({ x, y }, cols, rows, occupancy, fairness)
    ) {
      return { x, y }
    }
  }
  return { x: cx, y: cy }
}

const countOpenNeighbors = (
  cell: Vec2,
  cols: number,
  rows: number,
  occupancy: OccupancySnapshot,
): number => {
  const dirs: Vec2[] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ]
  let count = 0
  for (const dir of dirs) {
    const nx = cell.x + dir.x
    const ny = cell.y + dir.y
    if (!inInnerBounds(nx, ny, cols, rows)) {
      continue
    }
    if (isOccupied(nx, ny, occupancy)) {
      continue
    }
    count += 1
  }
  return count
}

export const isFairSpawnCell = (
  cell: Vec2,
  cols: number,
  rows: number,
  occupancy: OccupancySnapshot,
  fairness?: SpawnFairnessOptions,
): boolean => {
  if (!fairness) {
    return true
  }
  const {
    playerHead = null,
    playerDir = null,
    minManhattanDistance = 0,
    avoidForwardLaneSteps = 0,
    minOpenNeighborCount = 0,
    bodyLength = 1,
  } = fairness

  if (playerHead) {
    const distance = Math.abs(cell.x - playerHead.x) + Math.abs(cell.y - playerHead.y)
    if (distance < minManhattanDistance) {
      return false
    }
    if (playerDir && avoidForwardLaneSteps > 0) {
      for (let step = 1; step <= avoidForwardLaneSteps; step += 1) {
        const laneX = playerHead.x + playerDir.x * step
        const laneY = playerHead.y + playerDir.y * step
        if (cell.x === laneX && cell.y === laneY) {
          return false
        }
      }
    }
  }

  for (let i = 0; i < bodyLength; i += 1) {
    const bodyX = cell.x - i
    if (!inInnerBounds(bodyX, cell.y, cols, rows)) {
      return false
    }
    if (isOccupied(bodyX, cell.y, occupancy)) {
      return false
    }
  }

  if (
    minOpenNeighborCount > 0 &&
    countOpenNeighbors(cell, cols, rows, occupancy) < minOpenNeighborCount
  ) {
    return false
  }

  return true
}
