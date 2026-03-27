export type DirectionName = 'up' | 'down' | 'left' | 'right'

export type Vec2 = {
  x: number
  y: number
}

export type SnakeSegment = Vec2

export type PowerupType = 'shield' | 'slow' | 'ghost' | 'score' | 'venom'
export type EnemyKind = 'normal' | 'stalker' | 'ambusher' | 'boss' | 'egg' | 'mirror'
export type EnemyRole = 'sniper' | 'blocker' | 'summoner' | 'charger' | 'leech'
export type WorldItemType = 'core' | 'rift_battery' | 'portal_beacon'
export type EliteMinibossPatternPhase = 'telegraph' | 'commit' | 'recovery'
export type EliteMinibossFailureReason =
  | 'late_react'
  | 'trapped_path'
  | 'telegraph_missed'
  | 'stacked_pressure'
export type PredatorPreyPacingPhase = 'hunt' | 'escape' | 'reset'
export type PredatorPreyPacingTransitionReason =
  | 'encounter_start'
  | 'window_elapsed'
  | 'overlap_guardrail'
export type PredatorPreyPacingGuardrailReason =
  | 'overlap_budget_exceeded'
  | 'cadence_gap_enforced'
  | 'phase_escape_window'
export type PredatorPreyPacingGuardrailAction = 'defer'
export type BodyTerrainGuardrailReason = 'low_safe_pocket_under_pressure'

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

export type RunMapRoomType = 'combat' | 'elite' | 'shop' | 'rest' | 'event'

export type RunMapResolutionKind = 'objective_reward' | 'noncombat_hook'

export type BiomeId = 'void-depths' | 'crystal-caverns' | 'ember-fields'

export type BiomeRuleDomain = 'routing_pressure' | 'movement_constraint' | 'survival_rhythm'

export type BiomeRuleId =
  | 'void_flux'
  | 'void_flux_soft'
  | 'crystal_slip'
  | 'crystal_slip_soft'
  | 'ember_hunt'
  | 'ember_hunt_soft'

export type BiomeRuleGuardrailReason =
  | 'objective_conflict'
  | 'mutator_conflict'
  | 'body_economy_conflict'
  | 'pressure_budget'

export type BiomeRuleFallbackAction = 'downgrade' | 'replace' | 'defer'

export type BiomeRuleEffects = {
  enemyIntervalMultiplier?: number
  saferRouteEnemyDelta?: number
  riskierRouteEnemyDelta?: number
  bodySpendMinLengthDelta?: number
}

export type BiomeRuleDefinition = {
  id: BiomeRuleId
  biomeId: BiomeId
  domain: BiomeRuleDomain
  label: string
  summary: string
  tacticalTag: string
  pressureCost: number
  effects: BiomeRuleEffects
  blockedObjectiveKinds?: ReadonlyArray<RoomObjectiveKind>
  blockedMutatorDomains?: ReadonlyArray<ChallengeMutatorDomain>
  maxBodySpendMinLength?: number
  downgradeToRuleId?: BiomeRuleId
  replaceWithRuleId?: BiomeRuleId
}

export type BiomeRuleRuntime = {
  id: BiomeRuleId
  biomeId: BiomeId
  domain: BiomeRuleDomain
  label: string
  summary: string
  tacticalTag: string
  effects: BiomeRuleEffects
}

export type BiomeRuleBlockedCandidate = {
  id: BiomeRuleId
  reason: BiomeRuleGuardrailReason
}

export type BiomeRuleFallbackApplied = {
  candidateId: BiomeRuleId
  action: BiomeRuleFallbackAction
  reason: BiomeRuleGuardrailReason
  appliedRuleId: BiomeRuleId | null
}

export type BiomeRuleResolution = {
  biomeId: BiomeId
  active: BiomeRuleRuntime[]
  blocked: BiomeRuleBlockedCandidate[]
  fallbackApplied: BiomeRuleFallbackApplied[]
}

export type RunMapNode = {
  id: string
  depth: number
  roomType: RunMapRoomType
  biomeId: BiomeId
  nextNodeIds: string[]
  branchPoint: boolean
  resolutionKind: RunMapResolutionKind
}

export type RunMapPreviewChoice = {
  nodeId: string
  branchLabel: string
  roomType: RunMapRoomType
  biomeId: BiomeId
  previewRoomTypes: RunMapRoomType[]
}

export type RunMapPreview = {
  currentNode: RunMapNode
  choices: RunMapPreviewChoice[]
  previewHorizon: number
}

export type ChallengeMutatorDomain = 'pressure' | 'constraint' | 'economy' | 'routing'

export type ChallengeMutatorId = 'tempo_spike' | 'tight_turns' | 'lean_market' | 'route_tension'

export type ChallengeMutatorEffects = {
  moveIntervalMultiplier?: number
  enemyIntervalMultiplier?: number
  bodySpendMinLengthDelta?: number
  maxTurnQueueDelta?: number
  surviveObjectiveTargetMultiplier?: number
  saferRouteEnemyDelta?: number
  riskierRouteEnemyDelta?: number
  eventMinSnakeLengthDelta?: number
}

export type ChallengeMutatorDefinition = {
  id: ChallengeMutatorId
  label: string
  summary: string
  domain: ChallengeMutatorDomain
  minFloor: number
  weight: number
  pressureCost: number
  effects: ChallengeMutatorEffects
}

export type ChallengeMutatorRuntime = {
  id: ChallengeMutatorId
  label: string
  summary: string
  domain: ChallengeMutatorDomain
  effects: ChallengeMutatorEffects
}

export type EventChoiceKind = 'risky_trade' | 'curse_offer' | 'safe_vs_dangerous_route'

export type EventChoiceFamily = UpgradeFamily | 'utility'

export type EventChoiceEffects = {
  shieldDelta?: number
  lengthDelta?: number
  scoreDelta?: number
  enemyIntervalMultiplier?: number
  moveIntervalMultiplier?: number
  routeIntent?: FloorRouteChoice
}

export type EventChoiceOption = {
  id: string
  family: EventChoiceFamily
  labelKey: string
  upsideKey: string
  downsideKey: string
  summaryKey: string
  requiresConfirm: boolean
  effects: EventChoiceEffects
}

export type EventChoiceDefinition = {
  id: string
  kind: EventChoiceKind
  minFloor: number
  weight: number
  options: ReadonlyArray<EventChoiceOption>
}

export type EventChoiceDraft = {
  definitionId: string
  kind: EventChoiceKind
  options: EventChoiceOption[]
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
  bodySpendMinLength: number
  bodyPulseCost: number
  bodyPulseCooldownMs: number
  bodyPulseDurationMs: number
  bodyPulseRadius: number
  rewardOverclockCost: number
  rewardOverclockUsesPerObjective: number
}

export type BodySpendSource = 'damage' | 'body_pulse' | 'reward_overclock'

export type BodySpendBlockedReason =
  | 'below_floor'
  | 'on_cooldown'
  | 'usage_limit_reached'
  | 'not_reward_phase'

export type BodySpendOutcomeStatus = 'applied' | 'blocked' | 'on_cooldown'

export type BodySpendOutcome = {
  status: BodySpendOutcomeStatus
  source: BodySpendSource
  spentSegments: number
  blockedReason: BodySpendBlockedReason | null
}

export type BodyEconomyRuntimeState = {
  bodyPulseCooldownMs: number
  bodyPulseActiveMs: number
  rewardOverclockUsesInWindow: number
}

export type Enemy = {
  id: number
  body: SnakeSegment[]
  dir: Vec2
  alive: boolean
  kind: EnemyKind
  role: EnemyRole
  health: number
  dashCooldown: number
  hatchTurnsRemaining: number
  mirrorDelaySteps: number
  roleCooldown: number
  telegraph: EnemyTelegraph | null
  readability: EnemyReadabilityState
}

export type EnemyTelegraph = {
  kind: 'ambusher_dash' | 'sniper_lock' | 'leech_feed'
  dir: Vec2
  ticksRemaining: number
}

export type EnemyReadabilityState = {
  role: EnemyRole
  telegraphActive: boolean
  counterplayTicksRemaining: number
}

export type BodyTerrainSnapshot = {
  laneControlSegments: number
  zoneControlSegments: number
  safePocketNeighbors: number
  trapRisk: boolean
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
  currentRunMapNodeId: string | null
  pendingRunMapNodeId: string | null
  runCleanPlaySummary: RunCleanPlaySummary
  eliteMinibossReadability: EliteMinibossReadabilitySummary
  predatorPreyPacingSummary: PredatorPreyPacingSummary
  routeMasterySummary: RouteMasterySummary
  currentRunMutators: ChallengeMutatorRuntime[]
  biomeRuleSummary: BiomeRuleRunSummary
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

export type CleanPlayDamageKind = 'shield' | 'body'

export type RoomObjectiveCleanPlayState = {
  shieldHits: number
  bodyHits: number
  resolved: boolean
  bonusAwarded: boolean
}

export type RoomObjectiveState = {
  kind: RoomObjectiveKind
  progress: number
  target: number
  completed: boolean
  rewardClaimed: boolean
  cleanPlay: RoomObjectiveCleanPlayState
}

export type CleanPlayRewardType = 'score'

export type CleanPlayResultReason =
  | 'not_completed'
  | 'already_resolved'
  | 'took_hit'
  | 'objective_kind_cap_reached'
  | 'awarded'

export type CleanPlayObjectiveResult = {
  objectiveKind: RoomObjectiveKind
  eligible: boolean
  awarded: boolean
  rewardType: CleanPlayRewardType
  rewardAmount: number
  shieldHits: number
  bodyHits: number
  reason: CleanPlayResultReason
}

export type RunCleanPlaySummary = {
  completedObjectives: number
  cleanClears: number
  totalBonusScore: number
  awardedByKind: Record<RoomObjectiveKind, number>
}

export type EliteMinibossReadabilitySummary = {
  phaseWindowEvents: number
  damageEvents: number
  failureReasonCounts: Record<EliteMinibossFailureReason, number>
}

export type PredatorPreyPacingSummary = {
  transitionEvents: number
  transitionsByPhase: Record<PredatorPreyPacingPhase, number>
  guardrailInterventions: number
  guardrailReasonCounts: Record<PredatorPreyPacingGuardrailReason, number>
}

export type RouteMasterySummary = {
  routeDecisions: number
  branchDecisions: number
  eliteChoices: number
  nonCombatChoices: number
  biomePivotChoices: number
  previewEliteSeen: number
}

export type BiomeRuleRunSummary = {
  activationEvents: number
  transitionEvents: number
  blockedEvents: number
  fallbackEvents: number
  activatedBiomeIds: BiomeId[]
  activatedRuleIds: BiomeRuleId[]
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
