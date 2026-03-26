import type { Vec2 } from '../core/types'

export type OccupancySnapshot = {
  walls: Set<string>
  snake: ReadonlyArray<Vec2>
  enemies: ReadonlyArray<ReadonlyArray<Vec2>>
  portals?: ReadonlyArray<Vec2>
  rift?: Vec2 | null
  food?: Vec2 | null
  powerup?: Vec2 | null
  biomeItem?: Vec2 | null
}

export const cellKey = (x: number, y: number): string => `${x},${y}`

export const inInnerBounds = (x: number, y: number, cols: number, rows: number): boolean =>
  x > 0 && x < cols - 1 && y > 0 && y < rows - 1

export const isOccupied = (x: number, y: number, occupancy: OccupancySnapshot): boolean => {
  if (occupancy.walls.has(cellKey(x, y))) {
    return true
  }
  if (occupancy.snake.some((segment) => segment.x === x && segment.y === y)) {
    return true
  }
  if (
    occupancy.enemies.some((body) => body.some((segment) => segment.x === x && segment.y === y))
  ) {
    return true
  }
  if (occupancy.portals?.some((portal) => portal.x === x && portal.y === y)) {
    return true
  }
  if (occupancy.rift && occupancy.rift.x === x && occupancy.rift.y === y) {
    return true
  }
  if (occupancy.food && occupancy.food.x === x && occupancy.food.y === y) {
    return true
  }
  if (occupancy.powerup && occupancy.powerup.x === x && occupancy.powerup.y === y) {
    return true
  }
  if (occupancy.biomeItem && occupancy.biomeItem.x === x && occupancy.biomeItem.y === y) {
    return true
  }
  return false
}
