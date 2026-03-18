export type DirectionName = 'up' | 'down' | 'left' | 'right'

export type Vec2 = {
  x: number
  y: number
}

export type SnakeSegment = Vec2

export type PowerupType = 'shield' | 'slow' | 'ghost' | 'score'

export type Upgrade = {
  id: string
  name: string
  desc: string
  icon: string
  color: number
  apply: (cfg: RunConfig) => void
}

export type RunConfig = {
  moveInterval: number
  bonusStartLength: number
  bonusShields: number
  hasMagnet: boolean
  ghostCharges: number
  scoreMult: number
  enemySlow: number
  hasRegen: boolean
}

export type Enemy = {
  body: SnakeSegment[]
  dir: Vec2
  alive: boolean
}

export type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: number
  size: number
}

export type Food = {
  x: number
  y: number
  pulse: number
}

export type Powerup = {
  x: number
  y: number
  pulse: number
  type: PowerupType
}

export type GameState = {
  run: number
  totalScore: number
  kills: number
  floor: number
  persistentUpgrades: Upgrade[]
}

export type VirtualInput = {
  dir: DirectionName | null
  start: boolean
  pause: boolean
}
