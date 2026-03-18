export type DirectionName = 'up' | 'down' | 'left' | 'right'

export type Vec2 = {
  x: number
  y: number
}

export type SnakeSegment = Vec2

export type PowerupType = 'shield' | 'slow' | 'ghost' | 'score'
export type EnemyKind = 'normal' | 'stalker' | 'ambusher' | 'boss'
export type WorldItemType = 'core' | 'rift_battery'

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
  kind: EnemyKind
  health: number
  dashCooldown: number
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

export type BiomeItem = {
  x: number
  y: number
  pulse: number
  type: WorldItemType
}

export type GameState = {
  run: number
  totalScore: number
  kills: number
  eliteKills: number
  floor: number
  persistentUpgrades: Upgrade[]
  selectedRelicId: RelicId | null
}

export type VirtualInput = {
  dir: DirectionName | null
  start: boolean
  pause: boolean
}

export type TalentId = 'speed_1' | 'speed_2' | 'survival_1' | 'survival_2' | 'hunt_1' | 'hunt_2'

export type RelicId = 'plasma_core' | 'void_shadow' | 'symbiont'

export type TalentDefinition = {
  id: TalentId
  name: string
  description: string
  cost: number
  requires: TalentId | null
  apply: (cfg: RunConfig) => void
}

export type RelicDefinition = {
  id: RelicId
  name: string
  description: string
  apply: (cfg: RunConfig) => void
}

export type LifetimeStats = {
  runsPlayed: number
  totalScore: number
  totalKills: number
  eliteKills: number
  bestFloor: number
}

export type GoalId = 'floor_5' | 'elite_hunter_12'

export type GoalProgress = Record<GoalId, number>
export type ClaimedGoals = Record<GoalId, boolean>

export type GoalDefinition = {
  id: GoalId
  target: number
  reward: number
}

export type PlayerProfile = {
  profileVersion: number
  currency: number
  unlockedTalents: TalentId[]
  lifetimeStats: LifetimeStats
  goalProgress: GoalProgress
  claimedGoals: ClaimedGoals
}
