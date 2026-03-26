export type DirectionName = 'up' | 'down' | 'left' | 'right'

export type Vec2 = {
  x: number
  y: number
}

export type SnakeSegment = Vec2

export type PowerupType = 'shield' | 'slow' | 'ghost' | 'score' | 'venom'
export type EnemyKind = 'normal' | 'stalker' | 'ambusher' | 'boss' | 'egg' | 'mirror'
export type WorldItemType = 'core' | 'rift_battery' | 'portal_beacon'

export type UpgradeFamily = 'aggro' | 'control' | 'survival'
export type UpgradeTag =
  | 'speed'
  | 'routing'
  | 'burst'
  | 'zoning'
  | 'pickup-control'
  | 'body-control'
  | 'shield'
  | 'recovery'
  | 'stability'

export type UpgradeFamilyDefinition = {
  id: UpgradeFamily
  label: string
  summary: string
  color: number
}

export type Upgrade = {
  id: string
  family: UpgradeFamily
  name: string
  desc: string
  icon: string
  color: number
  gameplay: string
  tradeoff: string
  synergy: string
  tags: UpgradeTag[]
  apply: (cfg: RunConfig) => void
}

export type RewardId = 'fortified_core' | 'volatile_fangs' | 'long_coil'

export type RewardEffectSet = {
  moveIntervalMultiplier?: number
  enemySlowMultiplier?: number
  bonusShields?: number
  bonusLength?: number
  venomCharges?: number
  maxTurnQueue?: number
}

export type RewardOption = {
  id: RewardId
  icon: string
  color: number
  effects: RewardEffectSet
}

export type RunConfig = {
  moveInterval: number
  bonusStartLength: number
  bonusShields: number
  hasMagnet: boolean
  magnetRadius: number
  ghostCharges: number
  scoreMult: number
  powerupScoreMult: number
  powerupGrowth: number
  enemySlow: number
  hasRegen: boolean
  regenIntervalMs: number
  maxTurnQueue: number
}

export type Enemy = {
  body: SnakeSegment[]
  dir: Vec2
  alive: boolean
  kind: EnemyKind
  health: number
  dashCooldown: number
  hatchTurnsRemaining: number
  mirrorDelaySteps: number
  telegraph: EnemyTelegraph | null
}

export type EnemyTelegraph = {
  kind: 'ambusher_dash'
  dir: Vec2
  ticksRemaining: number
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
  currentRunSeed: number | null
  runObjectiveOffset: number
  persistentUpgrades: Upgrade[]
  persistentRewards: RewardOption[]
  selectedRelicId: RelicId | null
  pendingFloorRoute: FloorRouteChoice | null
}

export type VirtualInput = {
  dir: DirectionName | null
  turn: 'left' | 'right' | null
  start: boolean
  pause: boolean
  ability: boolean
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

export type RoomObjectiveKind = 'survive' | 'collect_cores' | 'defeat_elite' | 'activate_terminals'

export type RoomObjectiveDefinition = {
  kind: RoomObjectiveKind
  target: number
}

export type RoomObjectiveState = {
  kind: RoomObjectiveKind
  progress: number
  target: number
  completed: boolean
  rewardClaimed: boolean
}

export type NonBossObjectiveKind = 'portal' | 'score' | 'kills'
export type FloorObjectiveKind = NonBossObjectiveKind | 'boss'
export type FloorRouteChoice = 'safer' | 'riskier'
export type FloorTemplate = 'classic' | 'rooms_v1'

export type PlayerProfile = {
  profileVersion: number
  currency: number
  unlockedTalents: TalentId[]
  lifetimeStats: LifetimeStats
  goalProgress: GoalProgress
  claimedGoals: ClaimedGoals
}
