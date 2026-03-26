import type { Vec2 } from '../core/types'
import type { GameRng } from './rng'

export type RoomRect = { x: number; y: number; w: number; h: number; cx: number; cy: number }

export type RoomTemplateLayout = {
  walls: Set<string>
  roomCells: Set<string>
  corridorCells: Set<string>
}

export type RoomTemplateConfig = {
  minRooms: number
  maxRooms: number
  minRoomSize: number
  maxRoomSize: number
  minRoomGap: number
}

const key = (x: number, y: number): string => `${x},${y}`

export const generateClassicWalls = (options: {
  cols: number
  rows: number
  wallCount: number
  centerSafeRadius: number
  rng: GameRng
}): Set<string> => {
  const { cols, rows, wallCount, centerSafeRadius, rng } = options
  const walls = new Set<string>()
  const cx = Math.floor(cols / 2)
  const cy = Math.floor(rows / 2)
  const attempts = wallCount * 8
  for (let attempt = 0; attempt < attempts && walls.size < wallCount * 3; attempt += 1) {
    const x = rng.nextInt(2, cols - 3)
    const y = rng.nextInt(2, rows - 3)
    const len = rng.nextInt(2, 4)
    const horizontal = rng.nextFloat() < 0.5
    let valid = true
    for (let i = 0; i < len; i += 1) {
      const wx = horizontal ? x + i : x
      const wy = horizontal ? y : y + i
      if (Math.abs(wx - cx) < centerSafeRadius && Math.abs(wy - cy) < centerSafeRadius) {
        valid = false
        break
      }
    }
    if (!valid) {
      continue
    }
    for (let i = 0; i < len; i += 1) {
      const wx = horizontal ? x + i : x
      const wy = horizontal ? y : y + i
      if (wx > 0 && wx < cols - 1 && wy > 0 && wy < rows - 1) {
        walls.add(key(wx, wy))
      }
    }
  }
  return walls
}

export const generateRoomTemplateLayout = (options: {
  cols: number
  rows: number
  config: RoomTemplateConfig
  rng: GameRng
}): RoomTemplateLayout | null => {
  const { cols, rows, config, rng } = options
  const roomTarget = rng.nextInt(config.minRooms, config.maxRooms)
  const roomAttempts = roomTarget * 40
  const rooms: RoomRect[] = []
  for (let attempt = 0; attempt < roomAttempts && rooms.length < roomTarget; attempt += 1) {
    const w = rng.nextInt(config.minRoomSize, config.maxRoomSize)
    const h = rng.nextInt(config.minRoomSize, config.maxRoomSize)
    const maxX = cols - 1 - w
    const maxY = rows - 1 - h
    if (maxX <= 1 || maxY <= 1) {
      continue
    }
    const x = rng.nextInt(1, maxX)
    const y = rng.nextInt(1, maxY)
    const gap = config.minRoomGap
    const overlaps = rooms.some((room) => {
      const left = x - gap
      const right = x + w - 1 + gap
      const top = y - gap
      const bottom = y + h - 1 + gap
      const otherLeft = room.x
      const otherRight = room.x + room.w - 1
      const otherTop = room.y
      const otherBottom = room.y + room.h - 1
      return !(right < otherLeft || left > otherRight || bottom < otherTop || top > otherBottom)
    })
    if (overlaps) {
      continue
    }
    rooms.push({
      x,
      y,
      w,
      h,
      cx: Math.floor(x + w / 2),
      cy: Math.floor(y + h / 2),
    })
  }

  if (rooms.length < 2) {
    return null
  }

  rooms.sort((a, b) => a.cx - b.cx)
  const walkable = new Set<string>()
  const roomCells = new Set<string>()
  const corridorCells = new Set<string>()

  const carve = (x: number, y: number, zone: 'room' | 'corridor'): void => {
    if (x < 1 || x >= cols - 1 || y < 1 || y >= rows - 1) {
      return
    }
    const cell = key(x, y)
    walkable.add(cell)
    if (zone === 'room') {
      roomCells.add(cell)
    } else {
      corridorCells.add(cell)
    }
  }

  for (const room of rooms) {
    for (let y = room.y; y < room.y + room.h; y += 1) {
      for (let x = room.x; x < room.x + room.w; x += 1) {
        carve(x, y, 'room')
      }
    }
  }

  const carveCorridor = (from: RoomRect, to: RoomRect): void => {
    const stepX = from.cx <= to.cx ? 1 : -1
    for (let x = from.cx; x !== to.cx; x += stepX) {
      carve(x, from.cy, 'corridor')
    }
    carve(to.cx, from.cy, 'corridor')
    const stepY = from.cy <= to.cy ? 1 : -1
    for (let y = from.cy; y !== to.cy; y += stepY) {
      carve(to.cx, y, 'corridor')
    }
    carve(to.cx, to.cy, 'corridor')
  }

  for (let i = 0; i < rooms.length - 1; i += 1) {
    const from = rooms[i]
    const to = rooms[i + 1]
    if (from && to) {
      carveCorridor(from, to)
    }
  }

  if (rooms.length >= 3) {
    const from = rooms[0]
    const to = rooms[rooms.length - 1]
    if (from && to) {
      carveCorridor(from, to)
    }
  }

  const centerX = Math.floor(cols / 2)
  const centerY = Math.floor(rows / 2)
  for (let y = centerY - 1; y <= centerY + 1; y += 1) {
    for (let x = centerX - 1; x <= centerX + 1; x += 1) {
      carve(x, y, 'corridor')
    }
  }

  if (!isConnected(walkable)) {
    return null
  }

  const walls = new Set<string>()
  for (let y = 1; y < rows - 1; y += 1) {
    for (let x = 1; x < cols - 1; x += 1) {
      const cell = key(x, y)
      if (!walkable.has(cell)) {
        walls.add(cell)
      }
    }
  }

  return { walls, roomCells, corridorCells }
}

const isConnected = (cells: Set<string>): boolean => {
  const first = cells.values().next().value
  if (!first) {
    return false
  }
  const [sxRaw, syRaw] = first.split(',')
  const sx = Number(sxRaw)
  const sy = Number(syRaw)
  const queue: Vec2[] = [{ x: sx, y: sy }]
  const visited = new Set<string>([first])
  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) {
      continue
    }
    const neighbors: Vec2[] = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ]
    for (const next of neighbors) {
      const cell = key(next.x, next.y)
      if (!cells.has(cell) || visited.has(cell)) {
        continue
      }
      visited.add(cell)
      queue.push(next)
    }
  }
  return visited.size === cells.size
}

export const generateScatterTiles = (options: {
  cols: number
  rows: number
  tileCount: number
  blocked: Set<string>
  centerSafeRadius: number
  rng: GameRng
}): Set<string> => {
  const { cols, rows, tileCount, blocked, centerSafeRadius, rng } = options
  const tiles = new Set<string>()
  if (tileCount <= 0) {
    return tiles
  }
  const cx = Math.floor(cols / 2)
  const cy = Math.floor(rows / 2)
  const attempts = tileCount * 20
  for (let i = 0; i < attempts && tiles.size < tileCount; i += 1) {
    const x = rng.nextInt(1, cols - 2)
    const y = rng.nextInt(1, rows - 2)
    const cell = key(x, y)
    if (blocked.has(cell)) {
      continue
    }
    if (Math.abs(x - cx) < centerSafeRadius && Math.abs(y - cy) < centerSafeRadius) {
      continue
    }
    tiles.add(cell)
  }
  return tiles
}
