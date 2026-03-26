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
        candidates.push({ x, y })
      }
    }
  }

  const picked = rng.pick(candidates)
  if (picked) {
    return picked
  }

  for (let attempts = 0; attempts < 300; attempts += 1) {
    const x = rng.nextInt(1, cols - 2)
    const y = rng.nextInt(1, rows - 2)
    if (!isOccupied(x, y, occupancy)) {
      return { x, y }
    }
  }
  return { x: cx, y: cy }
}
