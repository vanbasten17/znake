import Phaser from 'phaser'
import rewardStyles from '../../styles/rewardOverlay.module.css'
import routeStyles from '../../styles/routeOverlay.module.css'
import { pickEliteKind, pickPowerupType, pickSpecialEnemyKind } from '../config/content'
import {
  BALANCE,
  createBaseRunConfig,
  getDepthBandForFloor,
  getFloorSetup,
  getItemSpawnConfigForFloor,
  getRoleSpawnPolicyForFloor,
} from '../core/balance'
import { BASE_COLS, BASE_ROWS, CELL, COLORS, HEIGHT, WIDTH, cellPx } from '../core/constants'
import { getDevScenario, isDevMode } from '../core/devScenarios'
import type { DevScenarioId } from '../core/devScenarios'
import type { GlossaryMarkerTone } from '../core/glossary'
import { applyRelicEffect, applyTalentEffects, isChallengeMutatorsUnlocked } from '../core/meta'
import { getFloorObjective, getRoomObjectiveForRoomType } from '../core/objectives'
import {
  applyRewardEffectsToConfig,
  formatRewardTranslationKey,
  getRewardPool,
} from '../core/rewards'
import { gameState, playerProfile } from '../core/state'
import type {
  BiomeId,
  BiomeItem,
  BiomeRuleRuntime,
  BodyEconomyRuntimeState,
  BodySpendBlockedReason,
  BodyTerrainGuardrailReason,
  BodyTerrainSnapshot,
  BossEncounterPhase,
  ChallengeMutatorRuntime,
  CleanPlayObjectiveResult,
  EliteMinibossPatternPhase,
  Enemy,
  EnemyKind,
  EventChoiceDraft,
  EventChoiceOption,
  FloorObjectiveKind,
  FloorRouteChoice,
  FloorTemplate,
  Food,
  Particle,
  Powerup,
  PowerupType,
  PredatorPreyPacingGuardrailAction,
  PredatorPreyPacingGuardrailReason,
  PredatorPreyPacingPhase,
  RewardOption,
  RoomObjectiveKind,
  RoomObjectiveState,
  RunConfig,
  RunMapPreviewChoice,
  RunMapRoomType,
  SnakeSegment,
  Vec2,
  WorldItemType,
} from '../core/types'
import { setupRuntimeDevtools } from '../devtools/runtime'
import {
  bindReplayCaptureGetter,
  bindRestartWithSameSeed,
  getSlowMotionFactor,
  setDevRunSeed,
} from '../devtools/runtime'
import { markerTextureKey, registerMarkerHiResTextures } from '../render/markerHiRes'
import { PAINT_BY_TONE, drawPremiumSegmentPhaser } from '../render/markerVectorArt'
import { ArcadeEffectsPipeline } from '../render/shaders'
import {
  applyBiomeRulesToRuntime,
  getBiomeRuleHudLabels,
  resolveBiomeRuleActivation,
} from '../simulation/biomeRules'
import {
  collectBodyPulseHitEnemyIndexes,
  createInitialBodyEconomyRuntimeState,
  resetRewardOverclockWindow,
  resolveBodyPulseSpend,
  resolveRewardOverclockSpend,
  tickBodyEconomyRuntimeState,
} from '../simulation/bodyEconomy'
import {
  createEmptyBodyTerrainSnapshot,
  shouldBlockBodySpendForTerrain,
  summarizeBodyTerrain,
} from '../simulation/bodyTerrain'
import {
  applyChallengeMutatorsToEnemyInterval,
  applyChallengeMutatorsToRoomObjectiveTarget,
  applyChallengeMutatorsToRouteChoice,
  applyChallengeMutatorsToRunConfig,
  composeMutatorEventChoiceContext,
  getChallengeMutatorHudLabels,
  resolveChallengeMutators,
} from '../simulation/challengeMutators'
import {
  countOpenNeighborCells,
  createEmptyBossEncounterSummary,
  isEliteMinibossKind,
  isObjectiveCriticalEncounter,
  resolveBossHighestPhase,
  resolveEliteMinibossFailureReason,
  resolveEliteMinibossPatternPhase,
  shouldGuaranteeEliteCadence,
} from '../simulation/eliteMiniboss'
import {
  type EnemyCollisionMatch,
  type EnemyCollisionPart,
  applyStalkerExtraStep,
  detectEnemyCollision,
  resolveEnemyCollisionDamage,
  tickEnemy,
} from '../simulation/enemy'
import {
  type RoleSpawnCadenceState,
  createEnemyReadabilityState,
  createInitialRoleSpawnCadenceState,
  getEnemyRoleFromKind,
  pickRoleByPolicy,
  summarizeActiveRoles,
} from '../simulation/enemyRoles'
import {
  type EventChoiceProgressState,
  clearEventChoiceProgress,
  createEventChoiceProgressState,
  draftEventChoice,
  enterEventChoicePending,
  resolveEventChoiceOption,
  resolveEventChoiceProgress,
  setEventChoiceConfirmOption,
} from '../simulation/eventChoices'
import {
  type RoomTemplateLayout,
  generateClassicWalls,
  generateRoomTemplateLayout,
  generateScatterTiles,
} from '../simulation/layout'
import {
  addCorePressureCoolant,
  advanceRoomObjectiveState,
  applyPortalBeaconAcceleration,
  createEmptyRunCleanPlaySummary,
  draftRewardOptions,
  initCorePressureState,
  initPortalFlowState,
  initRoomObjectiveState,
  markRoomObjectiveRewardClaimed,
  resetCorePressureTimer,
  resolveCleanPlayBonusForObjective,
  shouldCompleteObjective,
  tickCorePressure,
  tickPortalFlow,
} from '../simulation/objectives'
import {
  type PredatorPreyPacingState,
  advancePredatorPreyPacingState,
  createInitialPredatorPreyPacingState,
  shouldAllowPredatorPreyPressureAction,
} from '../simulation/predatorPreyPacing'
import {
  type RunReplayCapture,
  appendReplayInput,
  createRunReplayCapture,
} from '../simulation/replay'
import { type GameRng, createSeededRng, deriveRunSeed } from '../simulation/rng'
import { getRouteMasteryReadout, recordRouteMasteryDecision } from '../simulation/routeMastery'
import {
  createDefaultRunMapNodeIdForFloor,
  getRunMapPreview,
  isCombatRunMapRoomType,
} from '../simulation/runMap'
import { pickOpenCell } from '../simulation/spawn'
import { isReducedEffectsEnabled } from '../systems/accessibility'
import { getControlMode } from '../systems/controlScheme'
import {
  getMoveHintText,
  getRestartHintText,
  pulseHudNode,
  setHintText,
  setObjectiveStatusText,
  setRouteStatusText,
  setRunStatusText,
  setSceneChrome,
  updateHud,
} from '../systems/domHud'
import { emitFeedback } from '../systems/feedback'
import { t } from '../systems/i18n'
import { resetVirtualInput } from '../systems/input'
import { transitionToScene } from '../systems/sceneFlow'
import { trackRetentionEvent } from '../systems/telemetry'
import { allowsMarkerGlow } from '../visual/visualLanguage'

type GameSceneData = {
  score?: number
  devScenarioId?: DevScenarioId
  runSeed?: number
}

type DeathReason = 'wall' | 'self' | 'enemy' | 'rift'
type PortalCell = Vec2 & { pulse: number; route: FloorRouteChoice }
type EnemyCollision = {
  enemy: Enemy
  part: EnemyCollisionPart
}
type VenomProjectile = {
  x: number
  y: number
  dir: Vec2
  stepTimerMs: number
  stepsRemaining: number
}

type FeedbackPulse = {
  x: number
  y: number
  color: number
  elapsed: number
  duration: number
  maxRadius: number
}

type ObjectiveTerminal = Vec2 & {
  activated: boolean
  pulse: number
}

type ReferenceMarker = {
  x: number
  y: number
  tone: GlossaryMarkerTone
  label: string
}

const directionMap: Record<string, Vec2> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  KeyW: { x: 0, y: -1 },
  KeyS: { x: 0, y: 1 },
  KeyA: { x: -1, y: 0 },
  KeyD: { x: 1, y: 0 },
}

export class GameScene extends Phaser.Scene {
  private readonly devMode = isDevMode()
  private score = 0
  private paused = false
  private moveQueue: Vec2[] = []
  private currentDir: Vec2 = { x: 1, y: 0 }
  private moveTimer = 0
  private particles: Particle[] = []
  private feedbackPulses: FeedbackPulse[] = []
  private shakeTimer = 0
  private flashTimer = 0
  private flashColor = 0xffffff
  private hitStopMsRemaining = 0

  private cfg: RunConfig = createBaseRunConfig()

  private shields = 0
  private ghostCharges = 0
  private regenTimer = 0
  private wallCount = 0
  private floorTemplate: FloorTemplate = 'classic'
  private floorTemplateFallbackUsed = false
  private runSeed = 0
  private rng: GameRng = createSeededRng(1)
  private fxRng: GameRng = createSeededRng(2)
  private replayCapture: RunReplayCapture | null = null
  private enemyCount = 0
  private roleSpawnCadence: RoleSpawnCadenceState = createInitialRoleSpawnCadenceState()
  private pendingGrowth = 0
  private venomCharges = 0
  private venomCooldownMs = 0
  private venomProjectiles: VenomProjectile[] = []
  private bodyEconomyState: BodyEconomyRuntimeState = createInitialBodyEconomyRuntimeState()
  private bodyTerrainSnapshot: BodyTerrainSnapshot = createEmptyBodyTerrainSnapshot()
  private challengeMutators: ChallengeMutatorRuntime[] = []
  private objectiveType: FloorObjectiveKind = 'portal'
  private objectiveScoreStart = 0
  private objectiveScoreTarget = 0
  private objectiveKillsStart = 0
  private objectiveKillsTarget = 0
  private roomObjective: RoomObjectiveState | null = null
  private lastCleanPlayResult: CleanPlayObjectiveResult | null = null
  private objectiveTerminals: ObjectiveTerminal[] = []
  private rewardChoices: RewardOption[] = []
  private rewardPending = false
  private rewardOverlayRoot: HTMLDivElement | null = null
  private rewardOverclockButton: HTMLButtonElement | null = null
  private eventChoiceProgress: EventChoiceProgressState = createEventChoiceProgressState()
  private eventChoiceOverlayRoot: HTMLDivElement | null = null
  private routeChoices: RunMapPreviewChoice[] = []
  private routeOverlayRoot: HTMLDivElement | null = null
  private roomResolveOverlayRoot: HTMLDivElement | null = null
  private currentRoomType: RunMapRoomType = 'combat'
  private currentBiomeId: BiomeId = 'void-depths'
  private activeBiomeRules: BiomeRuleRuntime[] = []
  private biomeRouteEnemyDeltaSafer = 0
  private biomeRouteEnemyDeltaRiskier = 0
  private currentRunMapNodeId = createDefaultRunMapNodeIdForFloor(1)
  private portals: PortalCell[] = []
  private portalCountdownMs = 0
  private portalGraceMs = 0
  private portalGraceSecondCue = -1
  private squeezeStepTimerMs = 0
  private squeezeInset = 0
  private snake: SnakeSegment[] = []
  private playerHeadHistory: SnakeSegment[] = []
  private walls = new Set<string>()
  private roomCells = new Set<string>()
  private corridorCells = new Set<string>()
  private enemies: Enemy[] = []
  private nextEnemyId = 1
  private eliteMinibossPhaseByEnemyId = new Map<number, EliteMinibossPatternPhase>()
  private predatorPreyPacingState: PredatorPreyPacingState = createInitialPredatorPreyPacingState(
    BALANCE.predatorPreyPacing,
  )
  private predatorPreyTick = 0
  private lastPredatorPreyPressureTick = -9999
  private food: Food | null = null
  private powerup: Powerup | null = null
  private biomeItem: BiomeItem | null = null
  private bossSupportShieldRespawnMs = 0
  private contactGraceMsRemaining = 0
  private enemyMoveTimer = 0
  private enemyInterval = 400
  private riftTimer = 0
  private riftSuppressionMsRemaining = 0
  private riftCell: Vec2 | null = null
  private corePressureActive = false
  private corePressureIntervalMs = 0
  private corePressureRemainingMs = 0
  private corePressureCoolantCharges = 0
  private stars: Array<{ x: number; y: number; size: number; alpha: number }> = []
  private isBossFloor = false
  private bossPhase: BossEncounterPhase = 'alpha'
  private appliedFloorRoute: FloorRouteChoice | null = null
  private darknessActive = false
  private darknessRadius = 0
  private darknessEdgeFalloff = 0
  private darknessAlphaOuter = 0
  private darknessAlphaEdge = 0
  private iceTiles = new Set<string>()
  private iceActive = false
  private iceTileCount = 0
  private iceSlideSteps = 0
  private sandTiles = new Set<string>()
  private sandActive = false
  private sandTileCount = 0
  private sandMovePenaltyMs = 0
  private runStartMs = 0
  private isDying = false
  private pauseText?: Phaser.GameObjects.Text
  private referenceBoardMode = false
  private referenceMarkers: ReferenceMarker[] = []
  /** Hi-res marker previews (same textures as gameplay); dev reference board only. */
  private referenceMarkerImages: Phaser.GameObjects.Image[] = []
  private referenceHoverLabelByCell = new Map<string, string>()
  private referenceHoverLabel: string | null = null
  /** False until async `create()` finishes — Phaser may call `update` before then. */
  private gameCreateComplete = false

  private bgGraphics!: Phaser.GameObjects.Graphics
  private wallGraphics!: Phaser.GameObjects.Graphics
  /** Sand + ice — redrawn only when tiles change (not every frame). */
  private terrainGraphics!: Phaser.GameObjects.Graphics
  private gameGraphics!: Phaser.GameObjects.Graphics
  private fxGraphics!: Phaser.GameObjects.Graphics
  private arcadeEffects?: ArcadeEffectsPipeline

  /** Hi-res marker sprites (8× logical, same as `pnpm generate:sprites`), drawn above glow. */
  private markerFood!: Phaser.GameObjects.Image
  private markerPortal0!: Phaser.GameObjects.Image
  private markerPortal1!: Phaser.GameObjects.Image
  private markerRift!: Phaser.GameObjects.Image
  private markerPowerup!: Phaser.GameObjects.Image
  private markerBiome!: Phaser.GameObjects.Image

  public constructor() {
    super('Game')
  }

  public async create(data: GameSceneData): Promise<void> {
    this.gameCreateComplete = false
    resetVirtualInput()
    setupRuntimeDevtools()
    const debugScenario = data.devScenarioId ? getDevScenario(data.devScenarioId) : null
    if (debugScenario) {
      gameState.floor = debugScenario.floor
    }
    this.score = debugScenario?.score ?? data.score ?? 0
    this.resetLocalState()
    if (
      gameState.floor <= 1 &&
      this.score <= 0 &&
      gameState.persistentUpgrades.length === 0 &&
      gameState.persistentRewards.length === 0
    ) {
      gameState.runCleanPlaySummary = createEmptyRunCleanPlaySummary()
    } else if (!gameState.runCleanPlaySummary) {
      gameState.runCleanPlaySummary = createEmptyRunCleanPlaySummary()
    }
    if (!gameState.eliteMinibossReadability) {
      gameState.eliteMinibossReadability = {
        phaseWindowEvents: 0,
        damageEvents: 0,
        failureReasonCounts: {
          late_react: 0,
          trapped_path: 0,
          telegraph_missed: 0,
          stacked_pressure: 0,
        },
      }
    }
    if (!gameState.bossEncounterSummary) {
      gameState.bossEncounterSummary = createEmptyBossEncounterSummary()
    }
    if (!gameState.predatorPreyPacingSummary) {
      gameState.predatorPreyPacingSummary = {
        transitionEvents: 0,
        transitionsByPhase: {
          hunt: 0,
          escape: 0,
          reset: 0,
        },
        guardrailInterventions: 0,
        guardrailReasonCounts: {
          overlap_budget_exceeded: 0,
          cadence_gap_enforced: 0,
          phase_escape_window: 0,
        },
      }
    }
    if (!gameState.routeMasterySummary) {
      gameState.routeMasterySummary = {
        routeDecisions: 0,
        branchDecisions: 0,
        eliteChoices: 0,
        nonCombatChoices: 0,
        biomePivotChoices: 0,
        previewEliteSeen: 0,
      }
    }
    if (!gameState.biomeRuleSummary) {
      gameState.biomeRuleSummary = {
        activationEvents: 0,
        transitionEvents: 0,
        blockedEvents: 0,
        fallbackEvents: 0,
        activatedBiomeIds: [],
        activatedRuleIds: [],
      }
    }
    this.runStartMs = this.time.now
    this.isDying = false
    this.runSeed =
      data.runSeed ??
      gameState.currentRunSeed ??
      deriveRunSeed([Date.now(), gameState.run, gameState.floor, this.score])
    gameState.currentRunSeed = this.runSeed
    this.applyPendingRunMapNode()
    this.rng = createSeededRng(this.runSeed)
    this.fxRng = createSeededRng(deriveRunSeed([this.runSeed, 0x9e3779b9]))
    this.replayCapture = createRunReplayCapture(this.runSeed, this.time.now)
    setDevRunSeed(this.runSeed)
    bindReplayCaptureGetter(() => this.replayCapture)
    bindRestartWithSameSeed(() => {
      transitionToScene(this, 'Game', {
        chrome: 'run',
        data: { score: 0, runSeed: this.runSeed },
      })
    })
    setSceneChrome('run')

    applyTalentEffects(this.cfg, playerProfile)
    applyRelicEffect(this.cfg, gameState.selectedRelicId)
    for (const upgrade of gameState.persistentUpgrades) {
      upgrade.apply(this.cfg)
    }
    for (const reward of gameState.persistentRewards) {
      applyRewardEffectsToConfig(this.cfg, reward.effects)
    }
    this.shields = this.cfg.bonusShields
    this.ghostCharges = this.cfg.ghostCharges
    if (debugScenario?.forceMagnet) {
      this.cfg.hasMagnet = true
    }
    if (debugScenario?.startShields) {
      this.shields += debugScenario.startShields
    }

    const floorSetup = getFloorSetup(gameState.floor, this.cfg.enemySlow)
    const mutatorResolution = resolveChallengeMutators({
      runSeed: this.runSeed,
      floor: gameState.floor,
      available: isChallengeMutatorsUnlocked(playerProfile),
      baseConfig: this.cfg,
      baseEnemyInterval: floorSetup.enemyIntervalMs,
    })
    this.challengeMutators = mutatorResolution.active
    gameState.currentRunMutators = this.challengeMutators.map((mutator) => ({
      ...mutator,
      effects: { ...mutator.effects },
    }))
    for (const mutator of this.challengeMutators) {
      trackRetentionEvent('drafted', {
        system: 'challenge_mutators',
        mutatorId: mutator.id,
        domain: mutator.domain,
        floor: gameState.floor,
        runSeed: this.runSeed,
      })
      trackRetentionEvent('activated', {
        system: 'challenge_mutators',
        mutatorId: mutator.id,
        domain: mutator.domain,
        floor: gameState.floor,
        runSeed: this.runSeed,
      })
    }
    for (const blocked of mutatorResolution.blocked) {
      trackRetentionEvent('blocked', {
        system: 'challenge_mutators',
        mutatorId: blocked.id,
        reason: blocked.reason,
        floor: gameState.floor,
        runSeed: this.runSeed,
      })
    }
    applyChallengeMutatorsToRunConfig(this.cfg, this.challengeMutators)
    this.wallCount = floorSetup.wallCount
    this.enemyCount = floorSetup.enemyCount
    this.enemyInterval = applyChallengeMutatorsToEnemyInterval(
      floorSetup.enemyIntervalMs,
      this.challengeMutators,
    )
    this.darknessActive = floorSetup.darknessActive
    this.darknessRadius = floorSetup.darknessRadius
    this.darknessEdgeFalloff = floorSetup.darknessEdgeFalloff
    this.darknessAlphaOuter = floorSetup.darknessAlphaOuter
    this.darknessAlphaEdge = floorSetup.darknessAlphaEdge
    this.iceActive = floorSetup.iceActive
    this.iceTileCount = floorSetup.iceTileCount
    this.iceSlideSteps = floorSetup.iceSlideSteps
    this.sandActive = floorSetup.sandActive
    this.sandTileCount = floorSetup.sandTileCount
    this.sandMovePenaltyMs = floorSetup.sandMovePenaltyMs
    this.floorTemplate = floorSetup.floorTemplate
    if (debugScenario?.forceIce) {
      this.iceActive = true
      this.iceTileCount = Math.max(this.iceTileCount, 8)
      this.iceSlideSteps = Math.max(this.iceSlideSteps, 1)
    }
    if (debugScenario?.forceSand) {
      this.sandActive = true
      this.sandTileCount = Math.max(this.sandTileCount, 8)
      this.sandMovePenaltyMs = Math.max(this.sandMovePenaltyMs, 65)
    }
    this.isBossFloor = gameState.floor % BALANCE.biome.boss.floorInterval === 0
    if (this.isBossFloor) {
      this.currentRoomType = 'combat'
    }
    this.bossPhase = 'alpha'
    if (this.isBossFloor) {
      gameState.bossEncounterSummary.encountered = true
      gameState.bossEncounterSummary.identityId = BALANCE.biome.boss.identity.id
      gameState.bossEncounterSummary.highestPhase = resolveBossHighestPhase(
        gameState.bossEncounterSummary.highestPhase,
        'alpha',
      )
    }
    if (this.isBossFloor) {
      // Boss floors must start without preloaded shields; shield access comes from pickups.
      this.shields = 0
    }
    const floorObjective = getFloorObjective(gameState.floor, gameState.runObjectiveOffset)
    this.objectiveType = floorObjective.kind
    this.objectiveScoreStart = this.score
    this.objectiveKillsStart = gameState.kills
    this.objectiveScoreTarget = floorObjective.scoreTarget
    this.objectiveKillsTarget = floorObjective.killsTarget
    this.refreshRunMapPreview()
    const roomObjectiveDefinition = getRoomObjectiveForRoomType(
      gameState.floor,
      this.currentRoomType,
      gameState.runObjectiveOffset,
    )
    const composedRoomObjectiveDefinition = roomObjectiveDefinition
      ? {
          ...roomObjectiveDefinition,
          target: applyChallengeMutatorsToRoomObjectiveTarget({
            kind: roomObjectiveDefinition.kind,
            target: roomObjectiveDefinition.target,
            mutators: this.challengeMutators,
          }),
        }
      : null
    this.roomObjective = composedRoomObjectiveDefinition
      ? initRoomObjectiveState(composedRoomObjectiveDefinition)
      : null
    this.resolveActiveBiomeRules(composedRoomObjectiveDefinition?.kind ?? null)
    this.applyPendingFloorRoute()
    this.applyRoomTypeSetup()

    this.bgGraphics = this.add.graphics()
    this.wallGraphics = this.add.graphics()
    this.terrainGraphics = this.add.graphics()
    this.gameGraphics = this.add.graphics()
    this.fxGraphics = this.add.graphics()
    if (!isReducedEffectsEnabled()) {
      this.cameras.main.setPostPipeline(ArcadeEffectsPipeline)
      this.arcadeEffects = this.cameras.main.getPostPipeline(
        ArcadeEffectsPipeline,
      ) as ArcadeEffectsPipeline
    }

    await registerMarkerHiResTextures(this)
    const markerDepth = 8
    const mk = (tone: Parameters<typeof markerTextureKey>[0]) =>
      this.add
        .image(0, 0, markerTextureKey(tone))
        .setOrigin(0.5, 0.5)
        .setVisible(false)
        .setDepth(markerDepth)
    this.markerFood = mk('core')
    this.markerPortal0 = mk('portal')
    this.markerPortal1 = mk('portal')
    this.markerRift = mk('rift')
    this.markerPowerup = mk('shield')
    this.markerBiome = mk('biomeCore')

    this.generateFloorLayout()
    this.iceTiles = this.generateIceTiles()
    this.sandTiles = this.generateSandTiles()
    this.snake = this.spawnSnake()
    this.playerHeadHistory = this.snake[0] ? [{ ...this.snake[0] }] : []
    if (debugScenario?.forceIce) {
      this.seedDebugIceLane()
    }
    if (debugScenario?.forceSand) {
      this.seedDebugSandLane()
    }
    this.setupPortalFlow()
    this.setupCorePressureFlow()
    if (debugScenario?.portalCountdownMs !== undefined) {
      this.portalCountdownMs = Math.max(0, debugScenario.portalCountdownMs)
    }
    this.enemies = []
    if (this.isBossFloor) {
      this.enemyCount = 1
      this.spawnEnemy('boss')
    } else if (this.usesCombatRoomFlow()) {
      for (let i = 0; i < this.enemyCount; i += 1) {
        this.spawnEnemy()
      }
      if (debugScenario?.forceEggMirror) {
        this.spawnEnemy('egg')
        this.spawnEnemy('mirror')
      }
    }
    this.setupRoomObjectiveActors()

    if (this.usesCombatRoomFlow()) {
      this.spawnFood()
    }
    if (debugScenario?.placeFoodNearHead && this.usesCombatRoomFlow()) {
      const head = this.snake[0]
      if (head) {
        const candidate = { x: Math.min(BASE_COLS - 2, head.x + 1), y: head.y }
        const occupiedBySnake = this.snake.some(
          (segment, index) => index > 0 && segment.x === candidate.x && segment.y === candidate.y,
        )
        if (!this.isWall(candidate.x, candidate.y) && !occupiedBySnake) {
          this.food = { x: candidate.x, y: candidate.y, pulse: 0 }
        }
      }
    }
    if (
      this.usesCombatRoomFlow() &&
      !this.isBossFloor &&
      this.rng.nextFloat() < BALANCE.spawn.powerupAtFloorStartChance
    ) {
      this.spawnPowerup()
    }
    if (this.isBossFloor) {
      this.powerup = null
      this.spawnPowerup('venom')
      this.bossSupportShieldRespawnMs = BALANCE.biome.boss.supportShieldRespawnMs
    }
    if (this.usesCombatRoomFlow() && this.objectiveType === 'kills' && !this.isBossFloor) {
      this.spawnPowerup('venom')
    }
    this.startContactGrace(BALANCE.combatFairness.grace.roomEntryMs)
    this.stars = Array.from({ length: BALANCE.biome.starCount }, () => ({
      x: this.fxRng.nextInt(0, WIDTH - 1),
      y: this.fxRng.nextInt(0, HEIGHT - 1),
      size: this.fxRng.nextInt(1, 2),
      alpha: 0.15 + this.fxRng.nextFloat() * 0.4,
    }))
    this.riftCell = this.pickOpenCell()
    if (debugScenario?.forceDarkness) {
      this.darknessActive = true
    }
    trackRetentionEvent('floor_template_selected', {
      floor: gameState.floor,
      template: this.floorTemplate,
      fallbackUsed: this.floorTemplateFallbackUsed,
      depthBand: getDepthBandForFloor(gameState.floor),
    })
    trackRetentionEvent('depth_balance_resolved', {
      floor: gameState.floor,
      depthBand: getDepthBandForFloor(gameState.floor),
      objectiveType: this.objectiveType,
      roomType: this.currentRoomType,
      enemyCount: this.enemyCount,
      enemyInterval: Math.floor(this.enemyInterval),
      rolePolicyBand: getDepthBandForFloor(gameState.floor),
    })
    this.emitRoleCompositionTelemetry('room_start')
    this.showRoomRoleContext()
    if (this.challengeMutators.length > 0) {
      trackRetentionEvent('resolved_impact', {
        system: 'challenge_mutators',
        floor: gameState.floor,
        runSeed: this.runSeed,
        mutatorCount: this.challengeMutators.length,
        moveInterval: Math.floor(this.cfg.moveInterval),
        enemyInterval: Math.floor(this.enemyInterval),
        bodySpendMinLength: this.cfg.bodySpendMinLength,
      })
    }

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (this.rewardPending) {
        if (event.code === 'KeyE') {
          this.recordReplayInput('ability', 'keyboard')
          this.tryRewardOverclock()
        }
        if (event.code === 'Digit1' || event.code === 'Numpad1') {
          this.pickRewardChoice(0)
        }
        if (event.code === 'Digit2' || event.code === 'Numpad2') {
          this.pickRewardChoice(1)
        }
        if (event.code === 'Digit3' || event.code === 'Numpad3') {
          this.pickRewardChoice(2)
        }
        return
      }
      if (this.routeOverlayRoot) {
        if (event.code === 'Digit1' || event.code === 'Numpad1') {
          this.pickRouteChoice(0)
        }
        if (event.code === 'Digit2' || event.code === 'Numpad2') {
          this.pickRouteChoice(1)
        }
        return
      }
      if (this.eventChoiceOverlayRoot) {
        if (event.code === 'Digit1' || event.code === 'Numpad1') {
          this.pickEventChoice(0)
        }
        if (event.code === 'Digit2' || event.code === 'Numpad2') {
          this.pickEventChoice(1)
        }
        if (event.code === 'Digit3' || event.code === 'Numpad3') {
          this.pickEventChoice(2)
        }
        if (event.code === 'Escape') {
          this.cancelEventChoiceConfirmation()
        }
        if (event.code === 'Enter' || event.code === 'Space') {
          this.confirmPendingEventChoice()
        }
        return
      }
      if (this.roomResolveOverlayRoot) {
        if (event.code === 'Enter' || event.code === 'Space') {
          this.continueResolvedRoom()
        }
        return
      }
      const dir = directionMap[event.code]
      if (dir) {
        this.recordReplayInput('key', event.code)
        this.pushDirection(dir)
      }
      if (event.code === 'KeyE') {
        this.recordReplayInput('ability', 'keyboard')
        window.virtualInput.ability = true
      }
      if (this.devMode && event.code === 'KeyR') {
        this.recordReplayInput('key', event.code)
        transitionToScene(this, 'Game', {
          chrome: 'run',
          data: { score: 0, runSeed: this.runSeed },
        })
      }
      if (event.code === 'Space') {
        this.recordReplayInput('pause', 'keyboard')
        this.togglePause()
      }
    })
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.removeAllListeners()
      if (this.pauseText) {
        this.pauseText.destroy()
        this.pauseText = undefined
      }
      this.teardownRewardOverlay()
      this.teardownRouteOverlay()
      this.teardownEventChoiceOverlay()
      this.teardownRoomResolveOverlay()
      setObjectiveStatusText('')
      setRouteStatusText('')
      setRunStatusText('')
    })

    this.drawBackground()
    this.drawWalls()
    this.redrawTerrainGraphics()
    this.refreshBodyTerrainSnapshot()
    updateHud(this.score)
    this.refreshObjectiveHud()
    this.refreshRunMapHud()
    this.refreshHintText()

    if (debugScenario?.referenceBoard) {
      this.setupReferenceBoardScenario()
    }

    if (!this.usesCombatRoomFlow()) {
      this.mountRoomResolveOverlay()
    }

    this.gameCreateComplete = true
  }

  public update(_time: number, delta: number): void {
    if (!this.gameCreateComplete) {
      return
    }

    if (window.virtualInput.pause) {
      window.virtualInput.pause = false
      this.recordReplayInput('pause', 'virtual')
      this.togglePause()
    }

    if (window.virtualInput.dir) {
      const dmap: Record<string, Vec2> = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
      }
      const dir = dmap[window.virtualInput.dir]
      if (dir) {
        this.pushDirection(dir)
      }
      window.virtualInput.dir = null
    }
    if (window.virtualInput.turn) {
      this.recordReplayInput('turn', window.virtualInput.turn)
      const turnDirection = this.resolveRelativeTurn(window.virtualInput.turn)
      if (turnDirection) {
        this.pushDirection(turnDirection)
      }
      window.virtualInput.turn = null
    }
    if (window.virtualInput.ability) {
      this.recordReplayInput('ability', 'virtual')
      if (this.rewardPending) {
        this.tryRewardOverclock()
      } else {
        this.tryUseCombatAbility()
      }
      window.virtualInput.ability = false
    }

    this.updateFeedbackPulses(delta / 1000)

    if (this.paused) {
      return
    }

    if (this.referenceBoardMode) {
      this.updateReferenceBoardHover()
      const status = this.referenceHoverLabel
        ? `DEV REFERENCE · ${this.referenceHoverLabel}`
        : 'DEV REFERENCE · Hover any marker/cell'
      setRunStatusText(status)
      this.drawBackground()
      this.drawFrame()
      return
    }

    this.updateCameraShake(delta / 1000)
    if (this.hitStopMsRemaining > 0) {
      this.hitStopMsRemaining = Math.max(0, this.hitStopMsRemaining - delta)
      this.drawBackground()
      this.drawFrame()
      return
    }

    const simDelta = delta * getSlowMotionFactor()
    const dt = simDelta / 1000
    this.updateRoomObjectiveByTime(simDelta)
    this.refreshBodyTerrainSnapshot()
    this.refreshObjectiveHud()
    this.refreshRunMapHud()
    if (this.rewardPending) {
      this.drawBackground()
      this.drawFrame()
      return
    }
    if (this.routeOverlayRoot || this.eventChoiceOverlayRoot || this.roomResolveOverlayRoot) {
      this.drawBackground()
      this.drawFrame()
      return
    }
    this.drawBackground()
    this.updateEnemyMovement(simDelta)
    this.ensureObjectiveEnemyAvailability()
    this.ensureRoomObjectiveAvailability()
    this.updateVoidRift(simDelta)
    this.updatePortalFlow(simDelta)
    this.updateCorePressure(simDelta)
    this.updateBossSupport(simDelta)
    this.updateVenomState(simDelta)
    this.updateBodyEconomyState(simDelta)
    this.updateContactGrace(simDelta)
    this.updateRegen(simDelta)
    this.updateSnakeMovement(simDelta)
    this.updateMagnetFood()
    this.updateParticles(dt)

    if (this.food) {
      this.food.pulse += dt * 3
    }
    if (this.powerup) {
      this.powerup.pulse += dt * 4
    }
    if (this.biomeItem) {
      this.biomeItem.pulse += dt * 4.5
    }
    for (const terminal of this.objectiveTerminals) {
      if (!terminal.activated) {
        terminal.pulse += dt * 3.1
      }
    }
    for (const portal of this.portals) {
      portal.pulse += dt * 4.2
    }
    const localizedBiome = this.getBiomeLabel(this.currentBiomeId)
    const hazardParts: string[] = []
    if (this.riftSuppressionMsRemaining > 0) {
      hazardParts.push(
        t('game.riftSuppressed', {
          seconds: Math.ceil(this.riftSuppressionMsRemaining / 1000),
        }),
      )
    }
    const corePressureStatus = this.getCorePressureStatusText()
    if (corePressureStatus) {
      hazardParts.push(corePressureStatus)
    }
    const objectiveInfo = this.getObjectiveStatusText()
    const activeModifiers: string[] = []
    if (this.darknessActive) {
      activeModifiers.push(t('game.modifierDarkness'))
    }
    if (this.iceActive) {
      activeModifiers.push(t('game.modifierIce'))
    }
    if (this.sandActive) {
      activeModifiers.push(t('game.modifierSand'))
    }
    if (this.appliedFloorRoute) {
      activeModifiers.push(
        this.appliedFloorRoute === 'safer' ? t('game.routeSafer') : t('game.routeRiskier'),
      )
    }
    for (const label of getChallengeMutatorHudLabels(this.challengeMutators)) {
      activeModifiers.push(label)
    }
    for (const label of getBiomeRuleHudLabels(this.activeBiomeRules)) {
      activeModifiers.push(label)
    }
    const modifierInfo = activeModifiers.length > 0 ? ` · ${activeModifiers.join(' · ')}` : ''
    const hudStatus =
      hazardParts.length > 0
        ? `${localizedBiome} · ${objectiveInfo}${modifierInfo} · ${hazardParts.join(' · ')}`
        : `${localizedBiome} · ${objectiveInfo}${modifierInfo}`
    const debugSuffix = this.devMode
      ? ` · seed:${this.runSeed} · x${getSlowMotionFactor().toFixed(2)}`
      : ''
    setRunStatusText(`${hudStatus}${debugSuffix}`)

    this.drawFrame()
  }

  private resetLocalState(): void {
    this.paused = false
    this.moveQueue = []
    this.currentDir = { x: 1, y: 0 }
    this.moveTimer = 0
    this.particles = []
    this.feedbackPulses = []
    this.shakeTimer = 0
    this.flashTimer = 0
    this.flashColor = 0xffffff
    this.hitStopMsRemaining = 0
    this.cfg = createBaseRunConfig()
    this.shields = 0
    this.ghostCharges = 0
    this.regenTimer = 0
    this.floorTemplate = 'classic'
    this.floorTemplateFallbackUsed = false
    this.pendingGrowth = 0
    this.replayCapture = null
    this.venomCharges = 0
    this.venomCooldownMs = 0
    this.venomProjectiles = []
    this.bodyEconomyState = createInitialBodyEconomyRuntimeState()
    this.bodyTerrainSnapshot = createEmptyBodyTerrainSnapshot()
    this.challengeMutators = []
    this.objectiveType = 'portal'
    this.objectiveScoreStart = 0
    this.objectiveScoreTarget = 0
    this.objectiveKillsStart = 0
    this.objectiveKillsTarget = 0
    this.roomObjective = null
    this.lastCleanPlayResult = null
    this.objectiveTerminals = []
    this.rewardChoices = []
    this.rewardPending = false
    this.teardownRewardOverlay()
    this.rewardOverclockButton = null
    this.eventChoiceProgress = createEventChoiceProgressState()
    this.teardownEventChoiceOverlay()
    this.routeChoices = []
    this.teardownRouteOverlay()
    this.teardownRoomResolveOverlay()
    this.currentRoomType = 'combat'
    this.currentBiomeId = 'void-depths'
    this.activeBiomeRules = []
    this.biomeRouteEnemyDeltaSafer = 0
    this.biomeRouteEnemyDeltaRiskier = 0
    this.currentRunMapNodeId = createDefaultRunMapNodeIdForFloor(1)
    this.portals = []
    this.portalCountdownMs = 0
    this.portalGraceMs = 0
    this.portalGraceSecondCue = -1
    this.squeezeStepTimerMs = 0
    this.squeezeInset = 0
    this.playerHeadHistory = []
    this.roomCells = new Set<string>()
    this.corridorCells = new Set<string>()
    this.nextEnemyId = 1
    this.eliteMinibossPhaseByEnemyId.clear()
    this.predatorPreyPacingState = createInitialPredatorPreyPacingState(BALANCE.predatorPreyPacing)
    this.predatorPreyTick = 0
    this.lastPredatorPreyPressureTick = -9999
    this.enemyMoveTimer = 0
    this.roleSpawnCadence = createInitialRoleSpawnCadenceState()
    this.riftTimer = 0
    this.riftSuppressionMsRemaining = 0
    this.riftCell = null
    this.corePressureActive = false
    this.corePressureIntervalMs = 0
    this.corePressureRemainingMs = 0
    this.corePressureCoolantCharges = 0
    this.biomeItem = null
    this.bossSupportShieldRespawnMs = 0
    this.contactGraceMsRemaining = 0
    this.stars = []
    this.isBossFloor = false
    this.bossPhase = 'alpha'
    this.appliedFloorRoute = null
    this.darknessActive = false
    this.darknessRadius = 0
    this.darknessEdgeFalloff = 0
    this.darknessAlphaOuter = 0
    this.darknessAlphaEdge = 0
    this.iceTiles = new Set<string>()
    this.iceActive = false
    this.iceTileCount = 0
    this.iceSlideSteps = 0
    this.sandTiles = new Set<string>()
    this.sandActive = false
    this.sandTileCount = 0
    this.sandMovePenaltyMs = 0
    this.isDying = false
    gameState.currentRunMutators = []
    this.destroyReferenceMarkerImages()
    this.referenceBoardMode = false
    this.referenceMarkers = []
    this.referenceHoverLabelByCell.clear()
    this.referenceHoverLabel = null
  }

  private pushDirection(next: Vec2): void {
    const last =
      this.moveQueue.length > 0 ? this.moveQueue[this.moveQueue.length - 1] : this.currentDir
    if (next.x === -last.x && next.y === -last.y) {
      return
    }
    if (this.moveQueue.length < this.cfg.maxTurnQueue) {
      this.moveQueue.push(next)
      this.recordReplayInput('dir', this.vectorToInputLabel(next))
    }
  }

  private vectorToInputLabel(vec: Vec2): string {
    if (vec.x === 1 && vec.y === 0) return 'right'
    if (vec.x === -1 && vec.y === 0) return 'left'
    if (vec.x === 0 && vec.y === 1) return 'down'
    if (vec.x === 0 && vec.y === -1) return 'up'
    return `${vec.x},${vec.y}`
  }

  private recordReplayInput(
    type: 'dir' | 'turn' | 'ability' | 'pause' | 'key',
    value: string,
  ): void {
    if (!this.replayCapture) {
      return
    }
    this.replayCapture = appendReplayInput(this.replayCapture, {
      nowMs: this.time.now,
      type,
      value,
    })
  }

  private resolveRelativeTurn(turn: 'left' | 'right'): Vec2 | null {
    const dir = this.currentDir
    if (turn === 'left') {
      if (dir.x === 1 && dir.y === 0) return { x: 0, y: -1 }
      if (dir.x === -1 && dir.y === 0) return { x: 0, y: 1 }
      if (dir.x === 0 && dir.y === 1) return { x: 1, y: 0 }
      if (dir.x === 0 && dir.y === -1) return { x: -1, y: 0 }
      return null
    }
    if (dir.x === 1 && dir.y === 0) return { x: 0, y: 1 }
    if (dir.x === -1 && dir.y === 0) return { x: 0, y: -1 }
    if (dir.x === 0 && dir.y === 1) return { x: -1, y: 0 }
    if (dir.x === 0 && dir.y === -1) return { x: 1, y: 0 }
    return null
  }

  private togglePause(): void {
    this.paused = !this.paused
    if (this.paused) {
      this.pauseText = this.add
        .text(WIDTH / 2, HEIGHT / 2, t('controls.pause'), {
          font: '900 36px Orbitron',
          color: '#ffffff',
        })
        .setOrigin(0.5)
      return
    }
    if (this.pauseText) {
      this.pauseText.destroy()
      this.pauseText = undefined
    }
  }

  private updateCameraShake(dt: number): void {
    if (isReducedEffectsEnabled()) {
      this.shakeTimer = 0
      this.cameras.main.setScroll(0, 0)
      return
    }
    if (this.shakeTimer <= 0) {
      return
    }
    this.cameras.main.setScroll(
      (this.fxRng.nextFloat() - 0.5) * this.shakeTimer * 5,
      (this.fxRng.nextFloat() - 0.5) * this.shakeTimer * 5,
    )
    this.shakeTimer -= dt
    if (this.shakeTimer <= 0) {
      this.cameras.main.setScroll(0, 0)
    }
  }

  private updateEnemyMovement(delta: number): void {
    this.enemyMoveTimer += delta
    if (this.enemyMoveTimer < this.enemyInterval) {
      return
    }
    this.enemyMoveTimer = 0
    this.predatorPreyTick += 1
    this.advancePredatorPreyPacing(false)
    for (let i = 0; i < this.enemies.length; i += 1) {
      const enemy = this.enemies[i]
      if (!enemy || !enemy.alive) {
        continue
      }
      const playerHead = this.snake[0] ?? null
      const runTick = (): { ateFood: boolean; hatched: boolean } => {
        const current = this.enemies[i]
        if (!current) {
          return { ateFood: false, hatched: false }
        }
        const result = tickEnemy(current, {
          playerHead,
          playerHeadHistory: this.playerHeadHistory,
          isWall: (x, y) => this.isWall(x, y),
          foodCell: this.food ? { x: this.food.x, y: this.food.y } : null,
          rng: this.rng,
          ambusher: {
            dashMinLaneDistance: BALANCE.elite.ambusher.dashMinLaneDistance,
            dashChanceWhenAligned: BALANCE.elite.ambusher.dashChanceWhenAligned,
            dashSteps: BALANCE.elite.ambusher.dashSteps,
            dashCooldownTurns: BALANCE.elite.ambusher.dashCooldownTurns,
            telegraphTicks: BALANCE.combatFairness.telegraph.ambusherDashTicks,
          },
          stalkerSpeedMultiplier: BALANCE.elite.stalker.speedMultiplier,
          egg: {
            hatchLength: BALANCE.enemyVariants.egg.hatchLength,
          },
          roles: {
            sniper: {
              telegraphTicks: BALANCE.enemyRoles.roleKnobs.sniper.telegraphTicks,
              cooldownTurns: BALANCE.enemyRoles.roleKnobs.sniper.cooldownTurns,
              minLaneDistance: BALANCE.combatFairness.spawn.enemyMinDistanceFromPlayer,
              chanceWhenAligned: 0.55,
            },
          },
        })
        this.enemies[i] = result.enemy
        this.trackEliteMinibossPhaseWindow(result.enemy)
        if (result.ateFood) {
          if (result.rolePressureOutcome === 'leech_food_stolen') {
            this.score = Math.max(
              0,
              this.score - BALANCE.enemyRoles.roleKnobs.leech.scoreDrainOnFoodSteal,
            )
            updateHud(this.score)
            trackRetentionEvent('role_pressure_outcome', {
              role: 'leech',
              outcome: 'food_stolen',
              floor: gameState.floor,
              score: this.score,
            })
          }
          this.spawnFood()
        }
        if (result.hatched) {
          const hatchHead = result.enemy.body[0]
          if (hatchHead) {
            this.spawnParticles(hatchHead.x, hatchHead.y, COLORS.enemyHead, 8)
          }
        }
        return { ateFood: result.ateFood, hatched: result.hatched }
      }
      runTick()
      const nextEnemy = this.enemies[i]
      if (
        nextEnemy &&
        applyStalkerExtraStep(nextEnemy.kind, this.rng, BALANCE.elite.stalker.speedMultiplier)
      ) {
        runTick()
      }
    }
  }

  private updateContactGrace(delta: number): void {
    this.contactGraceMsRemaining = Math.max(0, this.contactGraceMsRemaining - delta)
  }

  private startContactGrace(durationMs: number): void {
    this.contactGraceMsRemaining = Math.max(this.contactGraceMsRemaining, durationMs)
  }

  private hasContactGrace(): boolean {
    return this.contactGraceMsRemaining > 0
  }

  private updateVoidRift(delta: number): void {
    if (this.riftSuppressionMsRemaining > 0) {
      const next = Math.max(0, this.riftSuppressionMsRemaining - delta)
      this.riftSuppressionMsRemaining = next
      this.riftCell = null
      if (next === 0) {
        trackRetentionEvent('rift_suppressed', {
          phase: 'end',
          floor: gameState.floor,
          score: this.score,
        })
      }
      return
    }

    this.riftTimer += delta
    if (this.riftTimer < BALANCE.biome.rift.tickMs) {
      return
    }
    this.riftTimer = 0
    const head = this.snake[0]
    if (!head) {
      return
    }
    this.score += BALANCE.biome.rift.scoreOnSurviveTick
    updateHud(this.score)
    this.riftCell = this.pickOpenCell()
    if (!this.riftCell) {
      return
    }
    if (head.x !== this.riftCell.x || head.y !== this.riftCell.y) {
      return
    }
    if (this.shields > 0) {
      this.shields -= 1
      this.triggerDamageFeedback(head.x, head.y, COLORS.shield, true)
      this.advanceRoomObjective({ type: 'damage_taken', damageKind: 'shield' })
      return
    }
    this.die('rift')
  }

  private updateRegen(delta: number): void {
    if (!this.cfg.hasRegen) {
      return
    }
    this.regenTimer += delta
    if (
      this.regenTimer > this.cfg.regenIntervalMs &&
      this.snake.length > BALANCE.run.baseSnakeLength
    ) {
      this.snake.pop()
      this.regenTimer = 0
    }
  }

  private updateBossSupport(delta: number): void {
    if (!this.isBossFloor || this.isDying || this.paused) {
      return
    }
    if (this.powerup) {
      return
    }
    this.bossSupportShieldRespawnMs = Math.max(0, this.bossSupportShieldRespawnMs - delta)
    if (this.bossSupportShieldRespawnMs > 0) {
      return
    }
    // Keep boss fights supplied with actionable pickups.
    // If the player has no shield, prioritize survival support.
    // If shielded already, prioritize venom so offense keeps flowing.
    if (this.shields <= 0) {
      this.spawnPowerup(this.rng.nextFloat() < 0.65 ? 'shield' : 'venom')
    } else {
      this.spawnPowerup(this.rng.nextFloat() < 0.85 ? 'venom' : 'shield')
    }
    this.bossSupportShieldRespawnMs = BALANCE.biome.boss.supportShieldRespawnMs
  }

  private updateSnakeMovement(delta: number): void {
    const head = this.snake[0]
    const sandPenalty = head && this.isSand(head.x, head.y) ? this.sandMovePenaltyMs : 0
    const moveInterval = this.cfg.moveInterval + sandPenalty
    this.moveTimer += delta
    if (this.moveTimer < moveInterval) {
      return
    }
    this.moveTimer = 0
    if (this.moveQueue.length > 0) {
      const queued = this.moveQueue.shift()
      if (queued) {
        if (head && (queued.x !== this.currentDir.x || queued.y !== this.currentDir.y)) {
          this.spawnParticles(head.x, head.y, 0x00ffff, 4)
        }
        this.currentDir = queued
      }
    }
    this.moveSnake()
  }

  private updateMagnetFood(): void {
    if (!this.cfg.hasMagnet || !this.food) {
      return
    }
    const head = this.snake[0]
    if (!head) {
      return
    }
    if (this.food.x === head.x && this.food.y === head.y) {
      this.spawnFood()
      return
    }

    const dx = head.x - this.food.x
    const dy = head.y - this.food.y
    if (Math.abs(dx) + Math.abs(dy) > this.cfg.magnetRadius) {
      return
    }
    const candidates: Array<{ x: number; y: number }> = []
    if (dx > 0) {
      candidates.push({ x: this.food.x + 1, y: this.food.y })
    } else if (dx < 0) {
      candidates.push({ x: this.food.x - 1, y: this.food.y })
    }
    if (dy > 0) {
      candidates.push({ x: this.food.x, y: this.food.y + 1 })
    } else if (dy < 0) {
      candidates.push({ x: this.food.x, y: this.food.y - 1 })
    }
    for (const candidate of candidates) {
      const blocked =
        this.isWall(candidate.x, candidate.y) ||
        this.snake.some((segment) => segment.x === candidate.x && segment.y === candidate.y) ||
        this.enemies.some((enemy) =>
          enemy.body.some((segment) => segment.x === candidate.x && segment.y === candidate.y),
        ) ||
        (this.powerup && this.powerup.x === candidate.x && this.powerup.y === candidate.y) ||
        (this.biomeItem && this.biomeItem.x === candidate.x && this.biomeItem.y === candidate.y) ||
        this.portals.some((portal) => portal.x === candidate.x && portal.y === candidate.y) ||
        (this.riftCell && this.riftCell.x === candidate.x && this.riftCell.y === candidate.y)
      if (!blocked) {
        this.food.x = candidate.x
        this.food.y = candidate.y
        return
      }
    }
  }

  private updateParticles(dt: number): void {
    this.particles = this.particles.filter((p) => {
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.92
      p.vy *= 0.92
      p.life -= dt / p.maxLife
      return p.life > 0
    })
  }

  private updateFeedbackPulses(dt: number): void {
    this.feedbackPulses = this.feedbackPulses.filter((pulse) => {
      pulse.elapsed += dt
      return pulse.elapsed < pulse.duration
    })
  }

  private queueHitStop(durationMs: number): void {
    if (isReducedEffectsEnabled()) {
      return
    }
    this.hitStopMsRemaining = Math.max(this.hitStopMsRemaining, durationMs)
  }

  private addFeedbackPulse(
    x: number,
    y: number,
    color: number,
    duration: number,
    radiusCells: number,
  ): void {
    this.feedbackPulses.push({
      x,
      y,
      color,
      elapsed: 0,
      duration,
      maxRadius: CELL * radiusCells,
    })
  }

  private triggerDamageFeedback(x: number, y: number, color: number, shieldOnly = false): void {
    const profile = shieldOnly ? BALANCE.feedback.shieldDamage : BALANCE.feedback.damage
    this.flashColor = color
    this.flashTimer = Math.max(this.flashTimer, profile.flashSeconds)
    this.shakeTimer = Math.max(this.shakeTimer, profile.shakeSeconds)
    this.queueHitStop(profile.hitStopMs)
    this.addFeedbackPulse(
      x * CELL + CELL / 2,
      y * CELL + CELL / 2,
      color,
      profile.pulseSeconds,
      profile.pulseRadiusCells,
    )
    pulseHudNode('run', 'danger', BALANCE.feedback.hudPulseMs)
    pulseHudNode('objective', 'danger', BALANCE.feedback.hudPulseMs)
    emitFeedback('danger')
  }

  private triggerPickupFeedback(x: number, y: number, color: number, major = false): void {
    const profile = major ? BALANCE.feedback.pickupMajor : BALANCE.feedback.pickupMinor
    this.flashColor = color
    this.flashTimer = Math.max(this.flashTimer, profile.flashSeconds)
    this.shakeTimer = Math.max(this.shakeTimer, profile.shakeSeconds)
    this.queueHitStop(profile.hitStopMs)
    this.addFeedbackPulse(
      x * CELL + CELL / 2,
      y * CELL + CELL / 2,
      color,
      profile.pulseSeconds,
      profile.pulseRadiusCells,
    )
    pulseHudNode('run', 'pickup', BALANCE.feedback.hudPulseMs)
    emitFeedback(major ? 'success' : 'pickup')
  }

  private triggerObjectiveFeedback(completedFloorObjective = false): void {
    const profile = completedFloorObjective
      ? BALANCE.feedback.objectiveComplete
      : BALANCE.feedback.objectiveReady
    this.flashColor = COLORS.beacon
    this.flashTimer = Math.max(this.flashTimer, profile.flashSeconds)
    this.shakeTimer = Math.max(this.shakeTimer, profile.shakeSeconds)
    this.queueHitStop(profile.hitStopMs)
    this.addFeedbackPulse(
      WIDTH / 2,
      HEIGHT / 2,
      COLORS.beacon,
      profile.pulseSeconds,
      profile.pulseRadiusCells,
    )
    pulseHudNode('objective', 'reward', profile.hudPulseMs)
    pulseHudNode('run', 'reward', profile.hudPulseMs)
    emitFeedback('reward')
  }

  private cellKey(x: number, y: number): string {
    return `${x},${y}`
  }

  private destroyReferenceMarkerImages(): void {
    for (const img of this.referenceMarkerImages) {
      img.destroy()
    }
    this.referenceMarkerImages = []
  }

  private markReferenceLabel(x: number, y: number, label: string): void {
    this.referenceHoverLabelByCell.set(this.cellKey(x, y), label)
  }

  private setupReferenceBoardScenario(): void {
    this.referenceBoardMode = true

    this.currentDir = { x: 1, y: 0 }
    this.moveQueue = []
    this.moveTimer = 0
    this.enemyMoveTimer = 0
    this.venomCooldownMs = 0
    this.venomProjectiles = []
    this.portalCountdownMs = 0
    this.corePressureActive = false
    this.corePressureRemainingMs = 0
    this.squeezeInset = 0
    this.darknessActive = false
    this.darknessRadius = 0
    this.darknessEdgeFalloff = 0
    this.darknessAlphaOuter = 0
    this.darknessAlphaEdge = 0
    this.shields = 1
    this.ghostCharges = 1
    this.venomCharges = 1

    this.referenceMarkers = []
    this.referenceHoverLabelByCell.clear()
    this.referenceHoverLabel = null

    this.walls = new Set<string>([
      this.cellKey(1, 7),
      this.cellKey(2, 7),
      this.cellKey(3, 7),
      this.cellKey(16, 7),
      this.cellKey(17, 7),
      this.cellKey(18, 7),
      this.cellKey(9, 12),
      this.cellKey(10, 12),
    ])
    this.iceTiles = new Set<string>([
      this.cellKey(1, 10),
      this.cellKey(2, 10),
      this.cellKey(3, 10),
      this.cellKey(4, 10),
    ])
    this.sandTiles = new Set<string>([
      this.cellKey(15, 10),
      this.cellKey(16, 10),
      this.cellKey(17, 10),
      this.cellKey(18, 10),
    ])
    this.iceActive = true
    this.sandActive = true

    this.snake = [
      { x: 8, y: 14 },
      { x: 7, y: 14 },
      { x: 6, y: 14 },
      { x: 5, y: 14 },
    ]
    this.playerHeadHistory = this.snake[0] ? [{ ...this.snake[0] }] : []
    for (let i = 0; i < this.snake.length; i += 1) {
      this.markReferenceLabel(
        this.snake[i].x,
        this.snake[i].y,
        i === 0 ? 'Snake Head' : 'Snake Body',
      )
    }

    this.food = { x: 1, y: 1, pulse: 0 }
    this.powerup = null
    this.biomeItem = null
    this.portals = [{ x: 18, y: 1, pulse: 0, route: 'safer' }]
    this.riftCell = { x: 18, y: 4 }

    this.enemies = [
      {
        id: 1,
        body: [{ x: 1, y: 13 }],
        dir: { x: 1, y: 0 },
        alive: true,
        kind: 'normal',
        role: 'blocker',
        health: 1,
        dashCooldown: 0,
        hatchTurnsRemaining: 0,
        mirrorDelaySteps: 0,
        roleCooldown: 0,
        telegraph: null,
        readability: createEnemyReadabilityState('blocker'),
      },
      {
        id: 2,
        body: [{ x: 3, y: 13 }],
        dir: { x: 1, y: 0 },
        alive: true,
        kind: 'stalker',
        role: 'leech',
        health: 1,
        dashCooldown: 0,
        hatchTurnsRemaining: 0,
        mirrorDelaySteps: 0,
        roleCooldown: 0,
        telegraph: null,
        readability: createEnemyReadabilityState('leech'),
      },
      {
        id: 3,
        body: [{ x: 5, y: 13 }],
        dir: { x: 1, y: 0 },
        alive: true,
        kind: 'ambusher',
        role: 'charger',
        health: 1,
        dashCooldown: 0,
        hatchTurnsRemaining: 0,
        mirrorDelaySteps: 0,
        roleCooldown: 0,
        telegraph: null,
        readability: createEnemyReadabilityState('charger'),
      },
      {
        id: 4,
        body: [{ x: 15, y: 13 }],
        dir: { x: 1, y: 0 },
        alive: true,
        kind: 'egg',
        role: 'summoner',
        health: 1,
        dashCooldown: 0,
        hatchTurnsRemaining: 0,
        mirrorDelaySteps: 0,
        roleCooldown: 0,
        telegraph: null,
        readability: createEnemyReadabilityState('summoner'),
      },
      {
        id: 5,
        body: [{ x: 17, y: 13 }],
        dir: { x: 1, y: 0 },
        alive: true,
        kind: 'mirror',
        role: 'sniper',
        health: 1,
        dashCooldown: 0,
        hatchTurnsRemaining: 0,
        mirrorDelaySteps: 0,
        roleCooldown: 0,
        telegraph: null,
        readability: createEnemyReadabilityState('sniper'),
      },
      {
        id: 6,
        body: [
          { x: 9, y: 1 },
          { x: 9, y: 2 },
          { x: 9, y: 3 },
          { x: 9, y: 4 },
        ],
        dir: { x: 0, y: 1 },
        alive: true,
        kind: 'boss',
        role: 'blocker',
        health: 3,
        dashCooldown: 0,
        hatchTurnsRemaining: 0,
        mirrorDelaySteps: 0,
        roleCooldown: 0,
        telegraph: null,
        readability: createEnemyReadabilityState('blocker'),
      },
    ]
    this.nextEnemyId = 7
    this.markReferenceLabel(1, 13, 'Enemy · Normal')
    this.markReferenceLabel(3, 13, 'Enemy · Stalker')
    this.markReferenceLabel(5, 13, 'Enemy · Ambusher')
    this.markReferenceLabel(15, 13, 'Enemy · Egg')
    this.markReferenceLabel(17, 13, 'Enemy · Mirror')
    this.markReferenceLabel(9, 1, 'Enemy · Boss')

    const markerSpecs: Array<{ tone: GlossaryMarkerTone; label: string }> = [
      { tone: 'core', label: t('glossary.entry.red_core.name') },
      { tone: 'biomeCore', label: t('glossary.entry.coolant_charge.name') },
      { tone: 'portal', label: t('glossary.entry.portal.name') },
      { tone: 'battery', label: t('glossary.entry.rift_battery.name') },
      { tone: 'beacon', label: t('glossary.entry.portal_beacon.name') },
      { tone: 'shield', label: t('glossary.entry.power_shield.name') },
      { tone: 'slow', label: t('glossary.entry.power_slow.name') },
      { tone: 'ghost', label: t('glossary.entry.power_ghost.name') },
      { tone: 'score', label: t('glossary.entry.power_score.name') },
      { tone: 'venom', label: t('glossary.entry.power_venom.name') },
      { tone: 'darkness', label: t('glossary.entry.hazard_darkness.name') },
      { tone: 'squeeze', label: t('glossary.entry.hazard_squeeze.name') },
      { tone: 'ice', label: t('glossary.entry.hazard_ice.name') },
      { tone: 'sand', label: t('glossary.entry.hazard_sand.name') },
      { tone: 'rift', label: t('glossary.entry.hazard_rift.name') },
      { tone: 'enemyNormal', label: t('glossary.entry.enemy_normal.name') },
      { tone: 'enemyStalker', label: t('glossary.entry.enemy_stalker.name') },
      { tone: 'enemyAmbusher', label: t('glossary.entry.enemy_ambusher.name') },
      { tone: 'enemyEgg', label: t('glossary.entry.enemy_egg.name') },
      { tone: 'enemyMirror', label: t('glossary.entry.enemy_mirror.name') },
      { tone: 'enemyBoss', label: t('glossary.entry.enemy_boss.name') },
      { tone: 'talentSpeed', label: t('glossary.entry.talent_speed_1.name') },
      { tone: 'talentSurvival', label: t('glossary.entry.talent_survival_1.name') },
      { tone: 'talentHunt', label: t('glossary.entry.talent_hunt_1.name') },
    ]

    const startX = 2
    const startY = 2
    const cols = 6
    for (let i = 0; i < markerSpecs.length; i += 1) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = startX + col * 3
      const y = startY + row * 2
      const marker = markerSpecs[i]
      this.referenceMarkers.push({ x, y, tone: marker.tone, label: marker.label })
      this.markReferenceLabel(x, y, marker.label)
    }

    this.destroyReferenceMarkerImages()
    const refMarkerDepth = 8
    for (const marker of this.referenceMarkers) {
      const img = this.add
        .image(0, 0, markerTextureKey(marker.tone))
        .setOrigin(0.5, 0.5)
        .setVisible(false)
        .setDepth(refMarkerDepth)
      this.referenceMarkerImages.push(img)
    }

    for (const wall of this.walls) {
      const [x, y] = wall.split(',').map(Number)
      this.markReferenceLabel(x, y, 'Wall')
    }
    for (const ice of this.iceTiles) {
      const [x, y] = ice.split(',').map(Number)
      this.markReferenceLabel(x, y, 'Ice Tile')
    }
    for (const sand of this.sandTiles) {
      const [x, y] = sand.split(',').map(Number)
      this.markReferenceLabel(x, y, 'Sand Tile')
    }
    this.markReferenceLabel(18, 1, 'Portal')
    this.markReferenceLabel(18, 4, 'Void Rift')

    this.drawWalls()
    this.redrawTerrainGraphics()
    setHintText('DEV · Static reference board')
  }

  private updateReferenceBoardHover(): void {
    const pointer = this.input.activePointer
    if (!pointer) {
      this.referenceHoverLabel = null
      return
    }
    const x = Math.floor(pointer.worldX / CELL)
    const y = Math.floor(pointer.worldY / CELL)
    if (x < 0 || x >= BASE_COLS || y < 0 || y >= BASE_ROWS) {
      this.referenceHoverLabel = null
      return
    }
    this.referenceHoverLabel = this.referenceHoverLabelByCell.get(this.cellKey(x, y)) ?? null
  }

  private getVenomStatusText(): string {
    if (this.venomCooldownMs > 0) {
      return t('game.venomCooldown', { seconds: Math.ceil(this.venomCooldownMs / 1000) })
    }
    if (this.venomCharges > 0) {
      return t('game.venomReady', { charges: this.venomCharges })
    }
    return t('game.venomEmpty')
  }

  private getBodyPulseStatusText(): string {
    if (this.bodyEconomyState.bodyPulseCooldownMs > 0) {
      return t('game.bodyPulseCooldown', {
        seconds: Math.ceil(this.bodyEconomyState.bodyPulseCooldownMs / 1000),
      })
    }
    if (this.snake.length <= this.cfg.bodySpendMinLength) {
      return t('game.bodyPulseBlockedFloor', {
        min: this.cfg.bodySpendMinLength,
      })
    }
    return t('game.bodyPulseReady', {
      cost: this.cfg.bodyPulseCost,
    })
  }

  private refreshBodyTerrainSnapshot(): void {
    this.bodyTerrainSnapshot = summarizeBodyTerrain({
      head: this.snake[0] ?? null,
      snake: this.snake,
      enemies: this.enemies,
      isWall: (x, y) => this.isWall(x, y),
      config: BALANCE.bodyTerrain,
    })
  }

  private getBodyTerrainCueText(): string {
    const safe = this.bodyTerrainSnapshot.safePocketNeighbors
    if (this.bodyTerrainSnapshot.trapRisk) {
      return `TERRAIN TIGHT ${safe}`
    }
    return `TERRAIN SAFE ${safe}`
  }

  private emitBodyTerrainGuardrailTelemetry(
    action: 'body_pulse' | 'reward_overclock',
    reason: BodyTerrainGuardrailReason,
  ): void {
    trackRetentionEvent('body_terrain_guardrail', {
      action,
      reason,
      floor: gameState.floor,
      roomType: this.currentRoomType,
      safePocketNeighbors: this.bodyTerrainSnapshot.safePocketNeighbors,
      laneControlSegments: this.bodyTerrainSnapshot.laneControlSegments,
      zoneControlSegments: this.bodyTerrainSnapshot.zoneControlSegments,
      trapRisk: this.bodyTerrainSnapshot.trapRisk,
      pressureSources: this.getActivePredatorPreyPressureSources(),
    })
  }

  private updateVenomState(delta: number): void {
    this.venomCooldownMs = Math.max(0, this.venomCooldownMs - delta)
    if (this.venomProjectiles.length === 0) {
      return
    }
    const active: VenomProjectile[] = []
    for (const projectile of this.venomProjectiles) {
      projectile.stepTimerMs += delta
      while (projectile.stepTimerMs >= BALANCE.elimination.venomStepMs) {
        projectile.stepTimerMs -= BALANCE.elimination.venomStepMs
        projectile.x += projectile.dir.x
        projectile.y += projectile.dir.y
        projectile.stepsRemaining -= 1
        if (this.isWall(projectile.x, projectile.y) || projectile.stepsRemaining <= 0) {
          projectile.stepsRemaining = 0
          break
        }
        const enemyHit = this.enemies.find(
          (enemy) =>
            enemy.alive &&
            enemy.body.some((segment) => segment.x === projectile.x && segment.y === projectile.y),
        )
        if (enemyHit) {
          this.killEnemy(enemyHit)
          this.spawnParticles(projectile.x, projectile.y, COLORS.venom, 8)
          emitFeedback('success')
          projectile.stepsRemaining = 0
          break
        }
      }
      if (projectile.stepsRemaining > 0) {
        active.push(projectile)
      }
    }
    this.venomProjectiles = active
  }

  private updateBodyEconomyState(delta: number): void {
    this.bodyEconomyState = tickBodyEconomyRuntimeState(this.bodyEconomyState, delta)
  }

  private shouldUseVenomAbilityContext(): boolean {
    if (this.isBossFloor) {
      return true
    }
    if (this.objectiveType !== 'kills') {
      return false
    }
    return this.venomCharges > 0 || this.venomCooldownMs > 0
  }

  private tryUseCombatAbility(): void {
    if (this.shouldUseVenomAbilityContext()) {
      this.tryFireVenom()
      return
    }
    this.tryBodyPulse()
  }

  private applyBodySpendBlockedFeedback(
    blockedReason: BodySpendBlockedReason | null,
    spendKind: 'body_pulse' | 'reward_overclock',
  ): void {
    if (blockedReason === 'on_cooldown' && spendKind === 'body_pulse') {
      setHintText(
        t('game.bodyPulseCooldown', {
          seconds: Math.ceil(this.bodyEconomyState.bodyPulseCooldownMs / 1000),
        }),
      )
      emitFeedback('danger')
      return
    }
    if (blockedReason === 'below_floor') {
      const key =
        spendKind === 'body_pulse'
          ? 'game.bodyPulseBlockedFloor'
          : 'game.rewardOverclockBlockedFloor'
      setHintText(t(key, { min: this.cfg.bodySpendMinLength }))
      emitFeedback('danger')
      return
    }
    if (blockedReason === 'usage_limit_reached') {
      setHintText(t('game.rewardOverclockUsed'))
      emitFeedback('danger')
      return
    }
    if (blockedReason === 'not_reward_phase') {
      setHintText(t('game.rewardOverclockNotReady'))
      emitFeedback('danger')
    }
  }

  private removeSnakeSegments(
    amount: number,
    source: 'damage' | 'body_pulse' | 'reward_overclock',
  ): number {
    const loss = Math.max(1, Math.floor(amount))
    let removed = 0
    while (removed < loss && this.snake.length > 1) {
      this.snake.pop()
      removed += 1
    }
    if (source === 'damage' && removed > 0) {
      setHintText(t('game.tailDamaged', { lost: removed }))
    } else if (source === 'body_pulse' && removed > 0) {
      setHintText(t('game.bodyPulseSpent', { spent: removed }))
    } else if (source === 'reward_overclock' && removed > 0) {
      setHintText(t('game.rewardOverclockSpent', { spent: removed }))
    }
    return removed
  }

  private tryBodyPulse(): void {
    if (this.paused || this.isDying) {
      return
    }
    this.refreshBodyTerrainSnapshot()
    const terrainGuard = shouldBlockBodySpendForTerrain({
      snapshot: this.bodyTerrainSnapshot,
      activePressureSources: this.getActivePredatorPreyPressureSources(),
      config: BALANCE.bodyTerrain,
    })
    if (!terrainGuard.allow) {
      setHintText('Body terrain unsafe for spend')
      emitFeedback('danger')
      this.emitBodyTerrainGuardrailTelemetry('body_pulse', terrainGuard.reason)
      return
    }
    const resolved = resolveBodyPulseSpend({
      snakeLength: this.snake.length,
      state: this.bodyEconomyState,
      config: this.cfg,
    })
    this.bodyEconomyState = resolved.state
    if (resolved.outcome.status !== 'applied') {
      this.applyBodySpendBlockedFeedback(resolved.outcome.blockedReason, 'body_pulse')
      return
    }

    const removed = this.removeSnakeSegments(resolved.outcome.spentSegments, 'body_pulse')
    if (removed < resolved.outcome.spentSegments) {
      this.die('enemy')
      return
    }
    const head = this.snake[0]
    const hitIndexes = collectBodyPulseHitEnemyIndexes({
      head,
      enemies: this.enemies,
      radius: this.cfg.bodyPulseRadius,
    })
    for (const index of hitIndexes) {
      const target = this.enemies[index]
      if (target) {
        this.killEnemy(target)
      }
    }
    const hitCount = hitIndexes.length
    if (head) {
      this.spawnParticles(head.x, head.y, COLORS.powerup, 8 + hitCount * 2)
      this.triggerPickupFeedback(head.x, head.y, COLORS.powerup)
    }
    this.enemies = this.enemies.filter((enemy) => enemy.alive)
    this.cleanupEliteMinibossPhaseState()
    this.refreshBodyTerrainSnapshot()
    trackRetentionEvent('body_terrain_snapshot', {
      trigger: 'body_pulse',
      floor: gameState.floor,
      roomType: this.currentRoomType,
      safePocketNeighbors: this.bodyTerrainSnapshot.safePocketNeighbors,
      laneControlSegments: this.bodyTerrainSnapshot.laneControlSegments,
      zoneControlSegments: this.bodyTerrainSnapshot.zoneControlSegments,
      trapRisk: this.bodyTerrainSnapshot.trapRisk,
      hitCount,
    })
    emitFeedback(hitCount > 0 ? 'success' : 'confirm')
  }

  private tryFireVenom(): void {
    if (this.paused || this.isDying || this.venomCharges <= 0 || this.venomCooldownMs > 0) {
      return
    }
    const head = this.snake[0]
    if (!head) {
      return
    }
    const startX = head.x + this.currentDir.x
    const startY = head.y + this.currentDir.y
    if (this.isWall(startX, startY)) {
      setHintText(t('game.venomBlocked'))
      emitFeedback('danger')
      return
    }
    this.venomCharges -= 1
    this.venomCooldownMs = BALANCE.elimination.venomCooldownMs
    this.venomProjectiles.push({
      x: startX,
      y: startY,
      dir: { ...this.currentDir },
      stepTimerMs: 0,
      stepsRemaining: BALANCE.elimination.venomMaxTravelSteps,
    })
    emitFeedback('confirm')
  }

  private tryRewardOverclock(): void {
    this.refreshBodyTerrainSnapshot()
    const terrainGuard = shouldBlockBodySpendForTerrain({
      snapshot: this.bodyTerrainSnapshot,
      activePressureSources: this.getActivePredatorPreyPressureSources(),
      config: BALANCE.bodyTerrain,
    })
    if (!terrainGuard.allow) {
      setHintText('Body terrain unsafe for overclock')
      emitFeedback('danger')
      this.emitBodyTerrainGuardrailTelemetry('reward_overclock', terrainGuard.reason)
      this.refreshRewardOverclockButton()
      return
    }
    const resolved = resolveRewardOverclockSpend({
      snakeLength: this.snake.length,
      state: this.bodyEconomyState,
      config: this.cfg,
      inRewardWindow: this.rewardPending,
    })
    this.bodyEconomyState = resolved.state
    if (resolved.outcome.status !== 'applied') {
      this.applyBodySpendBlockedFeedback(resolved.outcome.blockedReason, 'reward_overclock')
      this.refreshRewardOverclockButton()
      return
    }

    const removed = this.removeSnakeSegments(resolved.outcome.spentSegments, 'reward_overclock')
    if (removed < resolved.outcome.spentSegments) {
      this.die('enemy')
      return
    }
    this.rewardChoices = draftRewardOptions(getRewardPool(), BALANCE.rewards.draftSize, this.rng)
    this.mountRewardOverlay()
    this.refreshHintText()
    this.refreshRewardOverclockButton()
    this.refreshBodyTerrainSnapshot()
    trackRetentionEvent('body_terrain_snapshot', {
      trigger: 'reward_overclock',
      floor: gameState.floor,
      roomType: this.currentRoomType,
      safePocketNeighbors: this.bodyTerrainSnapshot.safePocketNeighbors,
      laneControlSegments: this.bodyTerrainSnapshot.laneControlSegments,
      zoneControlSegments: this.bodyTerrainSnapshot.zoneControlSegments,
      trapRisk: this.bodyTerrainSnapshot.trapRisk,
    })
    emitFeedback('reward')
  }

  private getObjectiveScoreProgress(): number {
    return Math.max(0, this.score - this.objectiveScoreStart)
  }

  private applyPendingRunMapNode(): void {
    const resolvedNodeId =
      gameState.pendingRunMapNodeId ??
      gameState.currentRunMapNodeId ??
      createDefaultRunMapNodeIdForFloor(gameState.floor)
    gameState.pendingRunMapNodeId = null
    gameState.currentRunMapNodeId = resolvedNodeId
    this.currentRunMapNodeId = resolvedNodeId
  }

  private refreshRunMapPreview(): void {
    const preview = getRunMapPreview({
      runSeed: this.runSeed,
      currentNodeId: this.currentRunMapNodeId,
      runObjectiveOffset: gameState.runObjectiveOffset,
    })
    this.currentRoomType = this.isBossFloor ? 'combat' : preview.currentNode.roomType
    this.currentBiomeId = preview.currentNode.biomeId
    this.routeChoices = preview.choices
  }

  private usesCombatRoomFlow(): boolean {
    if (this.isBossFloor) {
      return true
    }
    return isCombatRunMapRoomType(this.currentRoomType)
  }

  private applyRoomTypeSetup(): void {
    if (this.currentRoomType === 'elite') {
      this.enemyCount = Math.max(1, this.enemyCount + BALANCE.runMap.elite.enemyCountDelta)
      this.enemyInterval = Math.max(
        180,
        this.enemyInterval * BALANCE.runMap.elite.enemyIntervalMultiplier,
      )
    }
    if (!this.usesCombatRoomFlow()) {
      this.enemyCount = 0
    }
  }

  private getRoomTypeLabel(roomType: RunMapRoomType): string {
    if (roomType === 'elite') {
      return t('game.roomTypeElite')
    }
    if (roomType === 'shop') {
      return t('game.roomTypeShop')
    }
    if (roomType === 'rest') {
      return t('game.roomTypeRest')
    }
    if (roomType === 'event') {
      return t('game.roomTypeEvent')
    }
    return t('game.roomTypeCombat')
  }

  private getRoomTypeDescription(roomType: RunMapRoomType): string {
    if (roomType === 'elite') {
      return t('game.roomTypeEliteDesc')
    }
    if (roomType === 'shop') {
      return t('game.roomTypeShopDesc')
    }
    if (roomType === 'rest') {
      return t('game.roomTypeRestDesc')
    }
    if (roomType === 'event') {
      return t('game.roomTypeEventDesc')
    }
    return t('game.roomTypeCombatDesc')
  }

  private getBiomeLabel(biomeId: BiomeId): string {
    return t(`biome.${biomeId.replaceAll('-', '_')}`, {
      defaultValue: biomeId.toUpperCase().replaceAll('-', ' '),
    })
  }

  private resolveActiveBiomeRules(roomObjectiveKind: RoomObjectiveKind | null): void {
    const previousBiomeId =
      gameState.biomeRuleSummary.activatedBiomeIds[
        gameState.biomeRuleSummary.activatedBiomeIds.length - 1
      ] ?? null
    const resolution = resolveBiomeRuleActivation({
      biomeId: this.currentBiomeId,
      roomObjectiveKind,
      mutatorDomains: this.challengeMutators.map((mutator) => mutator.domain),
      bodySpendMinLength: this.cfg.bodySpendMinLength,
    })
    this.activeBiomeRules = resolution.active

    if (previousBiomeId !== null && previousBiomeId !== resolution.biomeId) {
      gameState.biomeRuleSummary.transitionEvents += 1
      trackRetentionEvent('biome_rule_transition', {
        floor: gameState.floor,
        runSeed: this.runSeed,
        fromBiome: previousBiomeId,
        toBiome: resolution.biomeId,
        reason: 'room_entry',
      })
    }

    if (resolution.active.length > 0) {
      gameState.biomeRuleSummary.activationEvents += 1
      trackRetentionEvent('biome_rule_activation', {
        floor: gameState.floor,
        runSeed: this.runSeed,
        biomeId: resolution.biomeId,
        roomType: this.currentRoomType,
        ruleIds: resolution.active.map((rule) => rule.id).join(','),
      })
    }

    for (const blocked of resolution.blocked) {
      gameState.biomeRuleSummary.blockedEvents += 1
      trackRetentionEvent('biome_rule_blocked', {
        floor: gameState.floor,
        runSeed: this.runSeed,
        biomeId: resolution.biomeId,
        candidateId: blocked.id,
        reason: blocked.reason,
      })
    }
    for (const fallback of resolution.fallbackApplied) {
      gameState.biomeRuleSummary.fallbackEvents += 1
      trackRetentionEvent('biome_rule_fallback_applied', {
        floor: gameState.floor,
        runSeed: this.runSeed,
        biomeId: resolution.biomeId,
        candidateId: fallback.candidateId,
        action: fallback.action,
        reason: fallback.reason,
        appliedRuleId: fallback.appliedRuleId,
      })
    }

    if (!gameState.biomeRuleSummary.activatedBiomeIds.includes(resolution.biomeId)) {
      gameState.biomeRuleSummary.activatedBiomeIds.push(resolution.biomeId)
    }
    for (const rule of resolution.active) {
      if (!gameState.biomeRuleSummary.activatedRuleIds.includes(rule.id)) {
        gameState.biomeRuleSummary.activatedRuleIds.push(rule.id)
      }
    }

    const adjusted = applyBiomeRulesToRuntime({
      enemyInterval: this.enemyInterval,
      saferRouteEnemyDelta: 0,
      riskierRouteEnemyDelta: 0,
      bodySpendMinLength: this.cfg.bodySpendMinLength,
      activeRules: this.activeBiomeRules,
    })
    this.enemyInterval = adjusted.enemyInterval
    this.biomeRouteEnemyDeltaSafer = adjusted.saferRouteEnemyDelta
    this.biomeRouteEnemyDeltaRiskier = adjusted.riskierRouteEnemyDelta
    this.cfg.bodySpendMinLength = adjusted.bodySpendMinLength
  }

  private formatRouteChoicePreview(choice: RunMapPreviewChoice): string {
    const biome = this.getBiomeLabel(choice.biomeId)
    const firstFuture = choice.previewRoomTypes[1]
    if (!firstFuture) {
      const room = t('game.routeChoiceCompact', {
        index: choice.branchLabel,
        room: this.getRoomTypeLabel(choice.roomType),
      })
      return `${room} · ${biome}`
    }
    const room = t('game.routePreviewCompact', {
      room: t('game.routeChoiceCompact', {
        index: choice.branchLabel,
        room: this.getRoomTypeLabel(choice.roomType),
      }),
      next: this.getRoomTypeLabel(firstFuture),
    })
    return `${room} · ${biome}`
  }

  private refreshRunMapHud(): void {
    const mastery = getRouteMasteryReadout(gameState.routeMasterySummary)
    const currentRoom = t('game.routeCurrentRoom', {
      room: this.getRoomTypeLabel(this.currentRoomType),
    })
    const current = `${currentRoom} · ${this.getBiomeLabel(this.currentBiomeId)} · ${mastery.short}`
    if (this.routeChoices.length <= 0) {
      setRouteStatusText(current)
      return
    }
    if (this.routeChoices.length === 1) {
      setRouteStatusText(
        `${current} · ${t('game.routeNextOne', {
          choice: this.formatRouteChoicePreview(this.routeChoices[0]),
        })}`,
      )
      return
    }
    const choices = this.routeChoices
      .map((choice) => this.formatRouteChoicePreview(choice))
      .join(' · ')
    setRouteStatusText(`${current} · ${t('game.routeNextMany', { choices })}`)
  }

  private refreshHintText(): void {
    const keyboardMode = getControlMode() === 'keyboard'
    if (this.rewardPending) {
      setHintText(
        keyboardMode
          ? t('hint.rewardKeyboardWithOverclock', { cost: this.cfg.rewardOverclockCost })
          : t('hint.rewardTouchWithOverclock', { cost: this.cfg.rewardOverclockCost }),
      )
      return
    }
    if (this.routeOverlayRoot) {
      setHintText(keyboardMode ? t('hint.routeKeyboard') : t('hint.routeTouch'))
      return
    }
    if (this.eventChoiceOverlayRoot) {
      if (
        this.eventChoiceProgress.status === 'pending' &&
        this.eventChoiceProgress.confirmOptionId
      ) {
        setHintText(
          keyboardMode ? t('hint.eventChoiceConfirmKeyboard') : t('hint.eventChoiceConfirmTouch'),
        )
      } else {
        setHintText(keyboardMode ? t('hint.eventChoiceKeyboard') : t('hint.eventChoiceTouch'))
      }
      return
    }
    if (this.roomResolveOverlayRoot) {
      setHintText(keyboardMode ? t('hint.continueKeyboard') : t('hint.continueTouch'))
      return
    }
    if (!this.usesCombatRoomFlow()) {
      setHintText(keyboardMode ? t('hint.continueKeyboard') : t('hint.continueTouch'))
      return
    }
    if (this.objectiveType === 'portal' && this.portals.length > 0) {
      setHintText(t('game.routeChoiceHint'))
      return
    }
    setHintText(`${getMoveHintText()} · ${t('hint.itemLegend')}`)
  }

  private getObjectiveKillsProgress(): number {
    return Math.max(0, gameState.kills - this.objectiveKillsStart)
  }

  private getPressureStatusText(): string {
    let base = t('game.squeezeActive')
    if (this.portalCountdownMs > 0) {
      base = t('game.pressureIn', { seconds: Math.ceil(this.portalCountdownMs / 1000) })
    } else if (this.portalGraceMs > 0) {
      base = t('game.squeezeIn', { seconds: Math.ceil(this.portalGraceMs / 1000) })
    }
    if (!this.usesCombatRoomFlow() || this.isBossFloor) {
      return base
    }
    return `${base} · ${this.getPredatorPreyPhaseCueText()}`
  }

  private getCorePressureStatusText(): string | null {
    if (!this.corePressureActive) {
      return null
    }
    const seconds = Math.ceil(this.corePressureRemainingMs / 1000)
    if (this.corePressureCoolantCharges > 0) {
      return t('game.corePressureWithCoolant', {
        seconds,
        charges: this.corePressureCoolantCharges,
      })
    }
    return t('game.corePressure', { seconds })
  }

  private getObjectiveStatusText(): string {
    const abilityStatus = this.shouldUseVenomAbilityContext()
      ? this.getVenomStatusText()
      : this.getBodyPulseStatusText()
    if (!this.usesCombatRoomFlow() && !this.isBossFloor) {
      return this.getRoomTypeLabel(this.currentRoomType)
    }
    if (this.isBossFloor || this.objectiveType === 'boss') {
      const phaseLabel =
        this.bossPhase === 'rage' ? t('game.bossPhaseRage') : t('game.bossPhaseAlpha')
      return t('game.bossAdvanceWithPhase', { phase: phaseLabel })
    }
    if (this.objectiveType === 'portal') {
      if (this.portals.length === 0) {
        return `${t('game.portalIn', { seconds: Math.ceil(this.portalCountdownMs / 1000) })} · ${abilityStatus}`
      }
      if (this.portalGraceMs > 0) {
        return `${t('game.portalChoose')} · ${t('game.squeezeIn', { seconds: Math.ceil(this.portalGraceMs / 1000) })} · ${abilityStatus}`
      }
      return `${t('game.portalChoose')} · ${t('game.squeezeActive')} · ${abilityStatus}`
    }
    if (this.objectiveType === 'score') {
      return t('game.objectiveScoreStatus', {
        progress: this.getObjectiveScoreProgress(),
        target: this.objectiveScoreTarget,
        pressure: `${this.getPressureStatusText()} · ${abilityStatus}`,
      })
    }
    if (this.objectiveType === 'kills') {
      return t('game.objectiveKillsStatusWithVenom', {
        progress: this.getObjectiveKillsProgress(),
        target: this.objectiveKillsTarget,
        pressure: this.getPressureStatusText(),
        venomStatus: abilityStatus,
      })
    }
    return t('game.objectiveKillsStatus', {
      progress: this.getObjectiveKillsProgress(),
      target: this.objectiveKillsTarget,
      pressure: this.getPressureStatusText(),
    })
  }

  private getRoomObjectiveStatusText(): string {
    if (!this.roomObjective) {
      return ''
    }
    if (this.roomObjective.completed) {
      return t('game.roomObjectiveComplete')
    }
    if (this.roomObjective.kind === 'collect_cores') {
      return t('game.roomObjectiveCollectCoresStatus', {
        progress: this.roomObjective.progress,
        target: this.roomObjective.target,
      })
    }
    if (this.roomObjective.kind === 'defeat_elite') {
      return t('game.roomObjectiveDefeatEliteStatus', {
        progress: this.roomObjective.progress,
        target: this.roomObjective.target,
      })
    }
    if (this.roomObjective.kind === 'activate_terminals') {
      return t('game.roomObjectiveActivateTerminalsStatus', {
        progress: this.roomObjective.progress,
        target: this.roomObjective.target,
      })
    }
    const remainingMs = Math.max(0, this.roomObjective.target - this.roomObjective.progress)
    return t('game.roomObjectiveSurviveStatus', {
      seconds: Math.ceil(remainingMs / 1000),
    })
  }

  private refreshObjectiveHud(): void {
    const base = this.getRoomObjectiveStatusText()
    const prioritizeObjectiveOnly =
      this.rewardPending ||
      (this.roomObjective?.completed === true && !this.roomObjective.rewardClaimed)
    if (prioritizeObjectiveOnly) {
      setObjectiveStatusText(base)
      return
    }
    const cue = this.getEliteMinibossCueText()
    const pacing =
      this.usesCombatRoomFlow() && !this.isBossFloor ? this.getPredatorPreyPhaseCueText() : null
    const terrain =
      this.usesCombatRoomFlow() && !this.isBossFloor ? this.getBodyTerrainCueText() : null
    const parts = [base, cue, pacing, terrain].filter((part) => Boolean(part))
    setObjectiveStatusText(parts.join(' · '))
  }

  private setupRoomObjectiveActors(): void {
    if (!this.roomObjective || this.isBossFloor || !this.usesCombatRoomFlow()) {
      this.objectiveTerminals = []
      return
    }
    if (this.roomObjective.kind === 'activate_terminals') {
      this.objectiveTerminals = []
      for (let index = 0; index < this.roomObjective.target; index += 1) {
        const cell = this.pickOpenCell({
          preferredZone: this.floorTemplate === 'rooms_v1' ? 'room' : null,
        })
        this.objectiveTerminals.push({ ...cell, activated: false, pulse: 0 })
      }
      return
    }
    this.objectiveTerminals = []
  }

  private updateRoomObjectiveByTime(deltaMs: number): void {
    if (
      !this.roomObjective ||
      this.rewardPending ||
      this.isDying ||
      this.isBossFloor ||
      !this.usesCombatRoomFlow()
    ) {
      return
    }
    if (this.roomObjective.kind !== 'survive' || this.roomObjective.completed) {
      return
    }
    const next = advanceRoomObjectiveState(this.roomObjective, { type: 'tick', deltaMs })
    this.roomObjective = next.state
    if (next.completedNow) {
      this.triggerRewardDraft()
    }
  }

  private advanceRoomObjective(
    event:
      | { type: 'core_collected'; amount?: number }
      | { type: 'elite_defeated'; amount?: number }
      | { type: 'terminal_activated'; amount?: number }
      | { type: 'damage_taken'; damageKind: 'shield' | 'body' },
  ): void {
    if (
      !this.roomObjective ||
      this.rewardPending ||
      this.isBossFloor ||
      !this.usesCombatRoomFlow()
    ) {
      return
    }
    const next = advanceRoomObjectiveState(this.roomObjective, event)
    this.roomObjective = next.state
    if (next.completedNow) {
      this.triggerRewardDraft()
    }
  }

  private ensureRoomObjectiveAvailability(): void {
    if (
      !this.roomObjective ||
      this.roomObjective.completed ||
      this.isBossFloor ||
      !this.usesCombatRoomFlow()
    ) {
      return
    }
    if (this.roomObjective.kind === 'collect_cores') {
      if (!this.biomeItem) {
        this.biomeItem = { ...this.pickOpenCell(), pulse: 0, type: 'core' }
      }
      return
    }
    if (this.roomObjective.kind === 'defeat_elite') {
      const hasAliveElite = this.enemies.some(
        (enemy) => enemy.alive && (enemy.kind === 'stalker' || enemy.kind === 'ambusher'),
      )
      if (!hasAliveElite) {
        this.spawnEnemy(this.rng.nextFloat() < 0.5 ? 'stalker' : 'ambusher')
      }
    }
  }

  private triggerRewardDraft(): void {
    if (
      !this.roomObjective ||
      this.roomObjective.rewardClaimed ||
      this.rewardPending ||
      this.isBossFloor
    ) {
      return
    }
    const cleanPlayResolution = resolveCleanPlayBonusForObjective({
      state: this.roomObjective,
      runSummary: gameState.runCleanPlaySummary,
      invalidateOnShieldHit: BALANCE.cleanPlay.rules.invalidateOnShieldHit,
      invalidateOnBodyHit: BALANCE.cleanPlay.rules.invalidateOnBodyHit,
      scoreByObjectiveKind: BALANCE.cleanPlay.payout.scoreByObjectiveKind,
      maxAwardsPerRunByObjectiveKind: BALANCE.cleanPlay.payout.maxAwardsPerRunByObjectiveKind,
    })
    this.roomObjective = cleanPlayResolution.state
    gameState.runCleanPlaySummary = cleanPlayResolution.runSummary
    this.lastCleanPlayResult = cleanPlayResolution.result
    const objectiveWindowId = this.getCurrentObjectiveWindowId()
    trackRetentionEvent('objective_clean_play_resolved', {
      objectiveKind: cleanPlayResolution.result.objectiveKind,
      eligible: cleanPlayResolution.result.eligible,
      awarded: cleanPlayResolution.result.awarded,
      rewardType: cleanPlayResolution.result.rewardType,
      rewardAmount: cleanPlayResolution.result.rewardAmount,
      shieldHits: cleanPlayResolution.result.shieldHits,
      bodyHits: cleanPlayResolution.result.bodyHits,
      reason: cleanPlayResolution.result.reason,
      objectiveWindowId,
      floor: gameState.floor,
      score: this.score,
    })
    if (cleanPlayResolution.result.awarded && cleanPlayResolution.result.rewardAmount > 0) {
      this.score += cleanPlayResolution.result.rewardAmount
      updateHud(this.score)
      setHintText(
        t('game.cleanPlayBonusAwarded', {
          bonus: cleanPlayResolution.result.rewardAmount,
        }),
      )
      trackRetentionEvent('clean_play_bonus_awarded', {
        objectiveKind: cleanPlayResolution.result.objectiveKind,
        rewardType: cleanPlayResolution.result.rewardType,
        rewardAmount: cleanPlayResolution.result.rewardAmount,
        objectiveWindowId,
        floor: gameState.floor,
        score: this.score,
      })
    }
    this.bodyEconomyState = resetRewardOverclockWindow(this.bodyEconomyState)
    this.rewardChoices = draftRewardOptions(getRewardPool(), BALANCE.rewards.draftSize, this.rng)
    trackRetentionEvent('objective_completed', {
      objectiveKind: this.roomObjective.kind,
      objectiveWindowId,
      floor: gameState.floor,
      score: this.score,
      rewardOptionIds: this.rewardChoices.map((choice) => choice.id).join(','),
      cleanPlayEligible: cleanPlayResolution.result.eligible,
      cleanPlayAwarded: cleanPlayResolution.result.awarded,
      cleanPlayRewardAmount: cleanPlayResolution.result.rewardAmount,
    })
    this.rewardPending = true
    this.triggerObjectiveFeedback(false)
    this.mountRewardOverlay()
    setRunStatusText(t('game.rewardDecisionPending'))
    this.refreshHintText()
  }

  private pickRewardChoice(index: number): void {
    if (!this.rewardPending) {
      return
    }
    const reward = this.rewardChoices[index]
    if (!reward) {
      return
    }
    const objectiveWindowId = this.getCurrentObjectiveWindowId()
    trackRetentionEvent('reward_picked', {
      rewardId: reward.id,
      rewardIndex: index,
      objectiveKind: this.roomObjective?.kind ?? 'unknown',
      objectiveWindowId,
      floor: gameState.floor,
      scoreBeforePick: this.score,
      cleanPlayEligible: this.lastCleanPlayResult?.eligible ?? false,
      cleanPlayAwarded: this.lastCleanPlayResult?.awarded ?? false,
    })
    this.applyRewardChoice(reward)
    this.rewardPending = false
    this.rewardChoices = []
    if (this.roomObjective) {
      this.roomObjective = markRoomObjectiveRewardClaimed(this.roomObjective)
    }
    this.teardownRewardOverlay()
    this.refreshObjectiveHud()
    this.refreshHintText()
    emitFeedback('reward')
  }

  private applyRewardChoice(reward: RewardOption): void {
    gameState.persistentRewards.push(reward)
    applyRewardEffectsToConfig(this.cfg, reward.effects)
    if (reward.effects.bonusShields !== undefined) {
      this.shields = Math.max(0, this.shields + reward.effects.bonusShields)
    }
    if (reward.effects.bonusLength !== undefined) {
      this.pendingGrowth += Math.max(0, reward.effects.bonusLength)
    }
    if (reward.effects.venomCharges !== undefined) {
      this.venomCharges += reward.effects.venomCharges
    }
    if (reward.effects.enemySlowMultiplier !== undefined) {
      this.enemyInterval = Math.max(180, this.enemyInterval * reward.effects.enemySlowMultiplier)
    }
  }

  private mountRewardOverlay(): void {
    this.teardownRewardOverlay()
    const gameArea = document.getElementById('game-area')
    if (!gameArea) {
      return
    }
    const root = document.createElement('div')
    root.className = rewardStyles.overlay

    const title = document.createElement('h2')
    title.className = rewardStyles.title
    title.textContent = t('reward.objectiveComplete')
    root.append(title)

    const subtitle = document.createElement('p')
    subtitle.className = rewardStyles.subtitle
    subtitle.textContent = t('reward.chooseOne')
    root.append(subtitle)

    const framing = document.createElement('p')
    framing.className = rewardStyles.framing
    framing.textContent = t('reward.decisionFrame')
    root.append(framing)

    if (this.lastCleanPlayResult) {
      const cleanPlay = document.createElement('p')
      cleanPlay.className = rewardStyles.subtitle
      if (this.lastCleanPlayResult.awarded && this.lastCleanPlayResult.rewardAmount > 0) {
        cleanPlay.textContent = t('reward.cleanPlayAwarded', {
          bonus: this.lastCleanPlayResult.rewardAmount,
        })
      } else if (this.lastCleanPlayResult.eligible) {
        cleanPlay.textContent = t('reward.cleanPlayCapped')
      } else {
        cleanPlay.textContent = t('reward.cleanPlayMissed')
      }
      root.append(cleanPlay)
    }

    const overclockButton = document.createElement('button')
    overclockButton.type = 'button'
    overclockButton.className = rewardStyles.overclock
    overclockButton.addEventListener('click', () => this.tryRewardOverclock())
    root.append(overclockButton)
    this.rewardOverclockButton = overclockButton

    const objective = document.createElement('p')
    objective.className = rewardStyles.objective
    objective.textContent = this.getRoomObjectiveStatusText()
    root.append(objective)

    const cards = document.createElement('div')
    cards.className = rewardStyles.cards
    root.append(cards)

    for (const [index, reward] of this.rewardChoices.entries()) {
      cards.append(this.createRewardCard(reward, index))
    }
    this.refreshRewardOverclockButton()

    gameArea.append(root)
    this.rewardOverlayRoot = root
  }

  private createRewardCard(reward: RewardOption, index: number): HTMLButtonElement {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = rewardStyles.card
    button.addEventListener('click', () => this.pickRewardChoice(index))

    const icon = document.createElement('span')
    icon.className = rewardStyles.index
    icon.textContent = reward.icon
    button.append(icon)

    const content = document.createElement('span')
    content.className = rewardStyles.content
    button.append(content)

    const name = document.createElement('span')
    name.className = rewardStyles.name
    name.textContent = t(formatRewardTranslationKey(reward.id, 'name'))
    name.style.color = `#${reward.color.toString(16).padStart(6, '0')}`
    content.append(name)

    const upside = document.createElement('span')
    upside.className = rewardStyles.effectLine
    const upsideTag = document.createElement('span')
    upsideTag.className = rewardStyles.upsideTag
    upsideTag.textContent = t('reward.upsideTag')
    const upsideText = document.createElement('span')
    upsideText.className = rewardStyles.upsideText
    upsideText.textContent = t(formatRewardTranslationKey(reward.id, 'upside'))
    upside.append(upsideTag, upsideText)
    content.append(upside)

    const downside = document.createElement('span')
    downside.className = rewardStyles.effectLine
    const downsideTag = document.createElement('span')
    downsideTag.className = rewardStyles.downsideTag
    downsideTag.textContent = t('reward.downsideTag')
    const downsideText = document.createElement('span')
    downsideText.className = rewardStyles.downsideText
    downsideText.textContent = t(formatRewardTranslationKey(reward.id, 'downside'))
    downside.append(downsideTag, downsideText)
    content.append(downside)

    const hotkey = document.createElement('span')
    hotkey.className = rewardStyles.hotkey
    hotkey.textContent = String(index + 1)
    button.append(hotkey)

    return button
  }

  private teardownRewardOverlay(): void {
    if (this.rewardOverlayRoot) {
      this.rewardOverlayRoot.remove()
      this.rewardOverlayRoot = null
    }
    this.rewardOverclockButton = null
  }

  private getCurrentObjectiveWindowId(): string {
    return `${gameState.run}-${gameState.floor}-${gameState.runCleanPlaySummary.completedObjectives}`
  }

  private refreshRewardOverclockButton(): void {
    if (!this.rewardOverclockButton) {
      return
    }
    const uses = this.bodyEconomyState.rewardOverclockUsesInWindow
    const maxUses = this.cfg.rewardOverclockUsesPerObjective
    const exhausted = uses >= maxUses
    const blockedByLength =
      this.snake.length - this.cfg.rewardOverclockCost < this.cfg.bodySpendMinLength
    const blocked = exhausted || blockedByLength
    this.rewardOverclockButton.disabled = blocked
    if (exhausted) {
      this.rewardOverclockButton.textContent = t('game.rewardOverclockUsed')
      return
    }
    if (blockedByLength) {
      this.rewardOverclockButton.textContent = t('game.rewardOverclockBlockedFloor', {
        min: this.cfg.bodySpendMinLength,
      })
      return
    }
    this.rewardOverclockButton.textContent = t('game.rewardOverclockReady', {
      cost: this.cfg.rewardOverclockCost,
    })
  }

  private mountRouteOverlay(): void {
    this.teardownRouteOverlay()
    if (this.routeChoices.length <= 1) {
      return
    }
    const gameArea = document.getElementById('game-area')
    if (!gameArea) {
      return
    }

    const root = document.createElement('div')
    root.className = routeStyles.overlay

    const panel = document.createElement('section')
    panel.className = routeStyles.panel
    root.append(panel)

    const title = document.createElement('h2')
    title.className = routeStyles.title
    title.textContent = t('game.routeChoiceTitle')
    panel.append(title)

    const subtitle = document.createElement('p')
    subtitle.className = routeStyles.subtitle
    subtitle.textContent = t('game.routeChoiceSubtitle')
    panel.append(subtitle)

    const cards = document.createElement('div')
    cards.className = routeStyles.cards
    panel.append(cards)

    for (const [index, choice] of this.routeChoices.entries()) {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = routeStyles.card
      button.addEventListener('click', () => this.pickRouteChoice(index))

      const hotkey = document.createElement('span')
      hotkey.className = routeStyles.hotkey
      hotkey.textContent = String(index + 1)
      button.append(hotkey)

      const content = document.createElement('span')
      content.className = routeStyles.content
      button.append(content)

      const name = document.createElement('span')
      name.className = routeStyles.name
      name.textContent = this.getRoomTypeLabel(choice.roomType)
      content.append(name)

      const detail = document.createElement('span')
      detail.className = routeStyles.detail
      detail.textContent = `${this.getRoomTypeDescription(choice.roomType)} · ${this.getBiomeLabel(
        choice.biomeId,
      )}`
      content.append(detail)

      const nextPreview = choice.previewRoomTypes[1]
      if (nextPreview) {
        const preview = document.createElement('span')
        preview.className = routeStyles.preview
        preview.textContent = t('game.routeChoiceFuture', {
          preview: this.getRoomTypeLabel(nextPreview),
        })
        content.append(preview)
      }

      cards.append(button)
    }

    gameArea.append(root)
    this.routeOverlayRoot = root
    this.refreshHintText()
  }

  private teardownRouteOverlay(): void {
    if (this.routeOverlayRoot) {
      this.routeOverlayRoot.remove()
      this.routeOverlayRoot = null
    }
  }

  private pickRouteChoice(index: number): void {
    const choice = this.routeChoices[index]
    if (!choice) {
      return
    }
    gameState.routeMasterySummary = recordRouteMasteryDecision({
      summary: gameState.routeMasterySummary,
      currentBiomeId: this.currentBiomeId,
      availableChoices: this.routeChoices.length,
      choice: {
        roomType: choice.roomType,
        biomeId: choice.biomeId,
        previewRoomTypes: choice.previewRoomTypes,
      },
    })
    trackRetentionEvent('route_mastery_decision', {
      floor: gameState.floor,
      roomType: choice.roomType,
      biomeId: choice.biomeId,
      previewEliteSeen: choice.previewRoomTypes.filter((room) => room === 'elite').length,
      routeDecisions: gameState.routeMasterySummary.routeDecisions,
      branchDecisions: gameState.routeMasterySummary.branchDecisions,
      eliteChoices: gameState.routeMasterySummary.eliteChoices,
      nonCombatChoices: gameState.routeMasterySummary.nonCombatChoices,
      biomePivotChoices: gameState.routeMasterySummary.biomePivotChoices,
    })
    emitFeedback('confirm')
    gameState.pendingRunMapNodeId = choice.nodeId
    this.teardownRouteOverlay()
    this.refreshHintText()
    transitionToScene(this, 'Upgrade', {
      chrome: 'run',
      data: { score: this.score, floor: gameState.floor },
    })
  }

  private completeRoomExit(): void {
    if (this.routeChoices.length <= 0) {
      gameState.pendingRunMapNodeId = createDefaultRunMapNodeIdForFloor(gameState.floor + 1)
      transitionToScene(this, 'Upgrade', {
        chrome: 'run',
        data: { score: this.score, floor: gameState.floor },
      })
      return
    }
    if (this.routeChoices.length === 1) {
      this.pickRouteChoice(0)
      return
    }
    this.mountRouteOverlay()
  }

  private draftEventChoiceForRoom(): EventChoiceDraft | null {
    const baseContext = {
      floor: gameState.floor,
      currentShields: this.shields,
      snakeLength: this.snake.length,
      minSnakeLength: this.cfg.bodySpendMinLength,
      score: this.score,
    }
    return draftEventChoice({
      runSeed: this.runSeed,
      floor: gameState.floor,
      roomNodeId: this.currentRunMapNodeId,
      context: composeMutatorEventChoiceContext(baseContext, this.challengeMutators),
    })
  }

  private mountEventChoiceOverlay(): void {
    this.teardownEventChoiceOverlay()
    const draft = this.draftEventChoiceForRoom()
    if (!draft) {
      this.pendingGrowth += BALANCE.runMap.nonCombat.eventBonusLength
      this.completeRoomExit()
      return
    }
    this.eventChoiceProgress = enterEventChoicePending(draft)
    this.renderEventChoiceOverlay()
  }

  private renderEventChoiceOverlay(): void {
    this.teardownEventChoiceOverlay()
    if (this.eventChoiceProgress.status === 'idle') {
      return
    }
    const gameArea = document.getElementById('game-area')
    if (!gameArea) {
      return
    }

    const root = document.createElement('div')
    root.className = routeStyles.overlay

    const panel = document.createElement('section')
    panel.className = routeStyles.panel
    root.append(panel)

    const title = document.createElement('h2')
    title.className = routeStyles.title
    title.textContent =
      this.eventChoiceProgress.status === 'pending'
        ? t('game.eventChoiceTitle')
        : t('game.eventChoiceResolvedTitle')
    panel.append(title)

    const subtitle = document.createElement('p')
    subtitle.className = routeStyles.subtitle
    subtitle.textContent =
      this.eventChoiceProgress.status === 'pending'
        ? t('game.eventChoiceSubtitle')
        : t('game.eventChoiceResolvedSubtitle')
    panel.append(subtitle)

    if (this.eventChoiceProgress.status === 'pending') {
      const cards = document.createElement('div')
      cards.className = routeStyles.cards
      panel.append(cards)

      for (const [index, option] of this.eventChoiceProgress.draft.options.entries()) {
        const button = document.createElement('button')
        button.type = 'button'
        button.className = routeStyles.card
        button.addEventListener('click', () => this.pickEventChoice(index))

        const hotkey = document.createElement('span')
        hotkey.className = routeStyles.hotkey
        hotkey.textContent = String(index + 1)
        button.append(hotkey)

        const content = document.createElement('span')
        content.className = routeStyles.content
        button.append(content)

        const name = document.createElement('span')
        name.className = routeStyles.name
        name.textContent = t(option.labelKey)
        content.append(name)

        const upside = document.createElement('span')
        upside.className = routeStyles.detail
        upside.textContent = t(option.upsideKey)
        content.append(upside)

        const downside = document.createElement('span')
        downside.className = routeStyles.preview
        downside.textContent = t(option.downsideKey)
        content.append(downside)

        cards.append(button)
      }

      if (this.eventChoiceProgress.confirmOptionId) {
        const confirm = document.createElement('p')
        confirm.className = routeStyles.body
        confirm.textContent = t('game.eventChoiceConfirm')
        panel.append(confirm)
      }
    } else {
      const body = document.createElement('p')
      body.className = routeStyles.body
      body.textContent = t(this.eventChoiceProgress.option.summaryKey)
      panel.append(body)

      const cta = document.createElement('button')
      cta.type = 'button'
      cta.className = routeStyles.cta
      cta.textContent = t('game.eventChoiceContinue')
      cta.addEventListener('click', () => this.continueResolvedEventChoice())
      panel.append(cta)
    }

    gameArea.append(root)
    this.eventChoiceOverlayRoot = root
    this.refreshHintText()
  }

  private teardownEventChoiceOverlay(): void {
    if (!this.eventChoiceOverlayRoot) {
      return
    }
    this.eventChoiceOverlayRoot.remove()
    this.eventChoiceOverlayRoot = null
  }

  private cancelEventChoiceConfirmation(): void {
    if (
      this.eventChoiceProgress.status !== 'pending' ||
      !this.eventChoiceProgress.confirmOptionId
    ) {
      return
    }
    this.eventChoiceProgress = setEventChoiceConfirmOption(this.eventChoiceProgress, null)
    this.renderEventChoiceOverlay()
  }

  private confirmPendingEventChoice(): void {
    if (this.eventChoiceProgress.status === 'resolved') {
      this.continueResolvedEventChoice()
      return
    }
    if (
      this.eventChoiceProgress.status !== 'pending' ||
      !this.eventChoiceProgress.confirmOptionId
    ) {
      return
    }
    const confirmOptionId = this.eventChoiceProgress.confirmOptionId
    const option = this.eventChoiceProgress.draft.options.find(
      (candidate) => candidate.id === confirmOptionId,
    )
    if (!option) {
      return
    }
    this.applyEventChoice(option)
  }

  private pickEventChoice(index: number): void {
    if (this.eventChoiceProgress.status !== 'pending') {
      return
    }
    const option = this.eventChoiceProgress.draft.options[index]
    if (!option) {
      return
    }
    if (option.requiresConfirm && this.eventChoiceProgress.confirmOptionId !== option.id) {
      this.eventChoiceProgress = setEventChoiceConfirmOption(this.eventChoiceProgress, option.id)
      this.renderEventChoiceOverlay()
      return
    }
    this.applyEventChoice(option)
  }

  private applyEventChoice(option: EventChoiceOption): void {
    const resolved = resolveEventChoiceOption({
      option,
      currentShields: this.shields,
      currentPendingGrowth: this.pendingGrowth,
      currentScore: this.score,
      currentEnemyInterval: this.enemyInterval,
      currentMoveInterval: this.cfg.moveInterval,
    })

    if (resolved.consumedLength > 0) {
      const removed = this.removeSnakeSegments(resolved.consumedLength, 'damage')
      if (removed < resolved.consumedLength) {
        this.die('enemy')
        return
      }
    }

    this.shields = resolved.nextShields
    this.pendingGrowth = resolved.nextPendingGrowth
    this.score = resolved.nextScore
    this.enemyInterval = resolved.nextEnemyInterval
    this.cfg.moveInterval = resolved.nextMoveInterval
    if (resolved.routeIntent) {
      gameState.pendingFloorRoute = resolved.routeIntent
    }
    updateHud(this.score)

    this.eventChoiceProgress = resolveEventChoiceProgress(this.eventChoiceProgress, option)
    emitFeedback('reward')
    this.renderEventChoiceOverlay()
  }

  private continueResolvedEventChoice(): void {
    if (this.eventChoiceProgress.status !== 'resolved') {
      return
    }
    emitFeedback('confirm')
    this.eventChoiceProgress = clearEventChoiceProgress()
    this.teardownEventChoiceOverlay()
    this.completeRoomExit()
  }

  private mountRoomResolveOverlay(): void {
    this.teardownRoomResolveOverlay()
    if (this.usesCombatRoomFlow()) {
      return
    }
    if (this.currentRoomType === 'event') {
      this.mountEventChoiceOverlay()
      return
    }

    if (this.currentRoomType === 'shop') {
      this.score += Math.floor(BALANCE.runMap.nonCombat.shopScoreBonus * this.cfg.scoreMult)
      updateHud(this.score)
    } else if (this.currentRoomType === 'rest') {
      this.shields += BALANCE.runMap.nonCombat.restBonusShields
    }

    const gameArea = document.getElementById('game-area')
    if (!gameArea) {
      return
    }
    const root = document.createElement('div')
    root.className = routeStyles.overlay

    const panel = document.createElement('section')
    panel.className = routeStyles.panel
    root.append(panel)

    const title = document.createElement('h2')
    title.className = routeStyles.title
    title.textContent = t('game.roomResolveTitle', {
      room: this.getRoomTypeLabel(this.currentRoomType),
    })
    panel.append(title)

    const subtitle = document.createElement('p')
    subtitle.className = routeStyles.subtitle
    subtitle.textContent = this.getRoomTypeDescription(this.currentRoomType)
    panel.append(subtitle)

    const body = document.createElement('p')
    body.className = routeStyles.body
    body.textContent =
      this.currentRoomType === 'shop'
        ? t('game.roomResolveShopBody', { score: BALANCE.runMap.nonCombat.shopScoreBonus })
        : this.currentRoomType === 'rest'
          ? t('game.roomResolveRestBody', { shields: BALANCE.runMap.nonCombat.restBonusShields })
          : t('game.roomResolveEventBody', { length: BALANCE.runMap.nonCombat.eventBonusLength })
    panel.append(body)

    const cta = document.createElement('button')
    cta.type = 'button'
    cta.className = routeStyles.cta
    cta.textContent = t('game.roomResolveContinue')
    cta.addEventListener('click', () => this.continueResolvedRoom())
    panel.append(cta)

    gameArea.append(root)
    this.roomResolveOverlayRoot = root
    this.refreshHintText()
  }

  private teardownRoomResolveOverlay(): void {
    if (this.roomResolveOverlayRoot) {
      this.roomResolveOverlayRoot.remove()
      this.roomResolveOverlayRoot = null
    }
  }

  private continueResolvedRoom(): void {
    if (!this.roomResolveOverlayRoot) {
      return
    }
    emitFeedback('confirm')
    this.teardownRoomResolveOverlay()
    this.completeRoomExit()
  }

  private applyPendingFloorRoute(): void {
    const route = gameState.pendingFloorRoute
    if (!route) {
      this.appliedFloorRoute = null
      return
    }
    this.appliedFloorRoute = route
    gameState.pendingFloorRoute = null
    if (route === 'safer') {
      this.enemyCount = Math.max(
        1,
        this.enemyCount +
          applyChallengeMutatorsToRouteChoice({
            route: 'safer',
            enemyDelta:
              BALANCE.portal.routeChoice.safer.enemyDelta + this.biomeRouteEnemyDeltaSafer,
            mutators: this.challengeMutators,
          }),
      )
      this.wallCount = Math.max(1, this.wallCount + BALANCE.portal.routeChoice.safer.wallDelta)
      this.enemyInterval *= BALANCE.portal.routeChoice.safer.enemyIntervalMultiplier
      return
    }
    this.enemyCount = Math.max(
      1,
      this.enemyCount +
        applyChallengeMutatorsToRouteChoice({
          route: 'riskier',
          enemyDelta:
            BALANCE.portal.routeChoice.riskier.enemyDelta + this.biomeRouteEnemyDeltaRiskier,
          mutators: this.challengeMutators,
        }),
    )
    this.wallCount = Math.max(1, this.wallCount + BALANCE.portal.routeChoice.riskier.wallDelta)
    this.enemyInterval *= BALANCE.portal.routeChoice.riskier.enemyIntervalMultiplier
  }

  private spawnSnake(): SnakeSegment[] {
    const cx = Math.floor(BASE_COLS / 2)
    const cy = Math.floor(BASE_ROWS / 2)
    const len = BALANCE.run.baseSnakeLength + this.cfg.bonusStartLength
    return Array.from({ length: len }, (_, i) => ({ x: cx - i, y: cy }))
  }

  private generateFloorLayout(): void {
    this.floorTemplateFallbackUsed = false
    this.roomCells = new Set<string>()
    this.corridorCells = new Set<string>()
    if (this.floorTemplate !== 'rooms_v1') {
      this.walls = this.generateWalls()
      return
    }
    const attempts = BALANCE.floorTemplate.roomsV1.maxGenerateAttempts
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const layout = this.generateRoomTemplateLayout()
      if (!layout) {
        continue
      }
      this.walls = layout.walls
      this.roomCells = layout.roomCells
      this.corridorCells = layout.corridorCells
      return
    }
    this.floorTemplateFallbackUsed = true
    this.floorTemplate = 'classic'
    this.walls = this.generateWalls()
  }

  private generateWalls(): Set<string> {
    return generateClassicWalls({
      cols: BASE_COLS,
      rows: BASE_ROWS,
      wallCount: this.wallCount,
      centerSafeRadius: 4,
      rng: this.rng,
    })
  }

  private generateRoomTemplateLayout(): RoomTemplateLayout | null {
    return generateRoomTemplateLayout({
      cols: BASE_COLS,
      rows: BASE_ROWS,
      config: {
        minRooms: BALANCE.floorTemplate.roomsV1.minRooms,
        maxRooms: BALANCE.floorTemplate.roomsV1.maxRooms,
        minRoomSize: BALANCE.floorTemplate.roomsV1.minRoomSize,
        maxRoomSize: BALANCE.floorTemplate.roomsV1.maxRoomSize,
        minRoomGap: BALANCE.floorTemplate.roomsV1.minRoomGap,
      },
      rng: this.rng,
    })
  }

  private generateIceTiles(): Set<string> {
    if (!this.iceActive || this.iceTileCount <= 0) {
      return new Set<string>()
    }
    return generateScatterTiles({
      cols: BASE_COLS,
      rows: BASE_ROWS,
      tileCount: this.iceTileCount,
      blocked: this.walls,
      centerSafeRadius: 3,
      rng: this.rng,
    })
  }

  private generateSandTiles(): Set<string> {
    if (!this.sandActive || this.sandTileCount <= 0) {
      return new Set<string>()
    }
    const blocked = new Set<string>([...this.walls, ...this.iceTiles])
    return generateScatterTiles({
      cols: BASE_COLS,
      rows: BASE_ROWS,
      tileCount: this.sandTileCount,
      blocked,
      centerSafeRadius: 3,
      rng: this.rng,
    })
  }

  private seedDebugIceLane(): void {
    const head = this.snake[0]
    if (!head) {
      return
    }
    for (let step = 1; step <= 4; step += 1) {
      const x = head.x + this.currentDir.x * step
      const y = head.y + this.currentDir.y * step
      if (x < 1 || x >= BASE_COLS - 1 || y < 1 || y >= BASE_ROWS - 1) {
        continue
      }
      if (this.walls.has(`${x},${y}`)) {
        continue
      }
      this.iceTiles.add(`${x},${y}`)
    }
  }

  private seedDebugSandLane(): void {
    const head = this.snake[0]
    if (!head) {
      return
    }
    for (let step = 1; step <= 4; step += 1) {
      const x = head.x + this.currentDir.x * step
      const y = head.y + this.currentDir.y * step
      const key = `${x},${y}`
      if (x < 1 || x >= BASE_COLS - 1 || y < 1 || y >= BASE_ROWS - 1) {
        continue
      }
      if (this.walls.has(key)) {
        continue
      }
      this.iceTiles.delete(key)
      this.sandTiles.add(key)
    }
  }

  private isWall(x: number, y: number): boolean {
    const inset = this.squeezeInset
    const minX = inset
    const maxX = BASE_COLS - 1 - inset
    const minY = inset
    const maxY = BASE_ROWS - 1 - inset
    if (x < minX || x > maxX || y < minY || y > maxY) {
      return true
    }
    return this.walls.has(`${x},${y}`)
  }

  private isIce(x: number, y: number): boolean {
    if (!this.iceActive) {
      return false
    }
    return this.iceTiles.has(`${x},${y}`)
  }

  private isSand(x: number, y: number): boolean {
    if (!this.sandActive) {
      return false
    }
    return this.sandTiles.has(`${x},${y}`)
  }

  private isSafe(x: number, y: number): boolean {
    if (this.isWall(x, y)) {
      return false
    }
    if (this.snake.some((segment) => segment.x === x && segment.y === y)) {
      return false
    }
    if (this.portals.some((portal) => portal.x === x && portal.y === y)) {
      return false
    }
    if (this.objectiveTerminals.some((terminal) => terminal.x === x && terminal.y === y)) {
      return false
    }
    return !this.enemies.some((enemy) =>
      enemy.body.some((segment) => segment.x === x && segment.y === y),
    )
  }

  private setupPortalFlow(): void {
    const portalState = initPortalFlowState({
      isBossFloor: this.isBossFloor || !this.usesCombatRoomFlow(),
      floor: gameState.floor,
      objectiveType: this.objectiveType,
      countdownBaseMs: BALANCE.portal.countdownBaseMs,
      countdownPerFloorMs: BALANCE.portal.countdownPerFloorMs,
      countdownMinMs: BALANCE.portal.countdownMinMs,
      graceMs: BALANCE.portal.graceMs,
    })
    this.portals = []
    this.portalCountdownMs = portalState.countdownMs
    this.portalGraceMs = portalState.graceMs
    this.portalGraceSecondCue = portalState.graceSecondCue
    this.squeezeStepTimerMs = portalState.squeezeStepTimerMs
    this.squeezeInset = portalState.squeezeInset
  }

  private setupCorePressureFlow(): void {
    const pressure = initCorePressureState({
      enabled: BALANCE.biome.pressure.enabled && this.usesCombatRoomFlow(),
      isBossFloor: this.isBossFloor,
      floor: gameState.floor,
      startFloor: BALANCE.biome.pressure.startFloor,
      intervalBaseMs: BALANCE.biome.pressure.intervalBaseMs,
      intervalPerFloorMs: BALANCE.biome.pressure.intervalPerFloorMs,
      intervalMinMs: BALANCE.biome.pressure.intervalMinMs,
    })
    this.corePressureActive = pressure.active
    this.corePressureIntervalMs = pressure.intervalMs
    this.corePressureRemainingMs = pressure.remainingMs
    this.corePressureCoolantCharges = pressure.coolantCharges
  }

  private updateCorePressure(delta: number): void {
    if (!this.corePressureActive || this.isDying || !this.usesCombatRoomFlow()) {
      return
    }
    const step = tickCorePressure({
      deltaMs: delta,
      state: {
        active: this.corePressureActive,
        intervalMs: this.corePressureIntervalMs,
        remainingMs: this.corePressureRemainingMs,
        coolantCharges: this.corePressureCoolantCharges,
      },
      snakeLength: this.snake.length,
      decaySegments: BALANCE.biome.pressure.decaySegments,
    })
    this.corePressureActive = step.state.active
    this.corePressureIntervalMs = step.state.intervalMs
    this.corePressureRemainingMs = step.state.remainingMs
    this.corePressureCoolantCharges = step.state.coolantCharges
    for (const event of step.events) {
      if (event === 'consume_coolant') {
        trackRetentionEvent('core_pressure_absorbed', {
          floor: gameState.floor,
          coolantRemaining: this.corePressureCoolantCharges,
        })
        emitFeedback('confirm')
        continue
      }
      const decaySegments = Math.max(1, BALANCE.biome.pressure.decaySegments)
      let removed = 0
      while (removed < decaySegments && this.snake.length > 2) {
        this.snake.pop()
        removed += 1
      }
      trackRetentionEvent('core_pressure_tick', {
        floor: gameState.floor,
        removedSegments: removed,
        snakeLength: this.snake.length,
      })
      emitFeedback('urgent')
      if (event === 'fatal_decay' || removed === 0) {
        this.die('rift')
      }
    }
  }

  private spawnPortals(): void {
    if (
      this.portals.length > 0 ||
      this.isBossFloor ||
      this.objectiveType !== 'portal' ||
      !this.usesCombatRoomFlow()
    ) {
      return
    }
    const saferCell = this.pickOpenCell()
    this.portals = [{ ...saferCell, pulse: 0, route: 'safer' }]
    if (this.routeChoices.length > 1) {
      const riskierCell = this.pickOpenCell()
      this.portals.push({ ...riskierCell, pulse: 0, route: 'riskier' })
    }
    emitFeedback('portal')
    this.portalGraceSecondCue = Math.ceil(this.portalGraceMs / 1000) + 1
    this.refreshHintText()
  }

  private updatePortalFlow(delta: number): void {
    if (this.isBossFloor || this.isDying || !this.usesCombatRoomFlow()) {
      return
    }
    const step = tickPortalFlow({
      state: {
        countdownMs: this.portalCountdownMs,
        graceMs: this.portalGraceMs,
        graceSecondCue: this.portalGraceSecondCue,
        squeezeStepTimerMs: this.squeezeStepTimerMs,
        squeezeInset: this.squeezeInset,
        active: this.objectiveType === 'portal',
      },
      deltaMs: delta,
      objectiveType: this.objectiveType,
      isBossFloor: this.isBossFloor,
      squeezeStepMs: BALANCE.portal.squeezeStepMs,
      squeezeMaxInset: BALANCE.portal.squeezeMaxInset,
      isCellWall: (x, y) => this.isWall(x, y),
      snakeHead: this.snake[0] ?? null,
    })
    this.portalCountdownMs = step.state.countdownMs
    this.portalGraceMs = step.state.graceMs
    this.portalGraceSecondCue = step.state.graceSecondCue
    this.squeezeStepTimerMs = step.state.squeezeStepTimerMs
    this.squeezeInset = step.state.squeezeInset

    for (const event of step.events) {
      if (event === 'spawn_portals') {
        this.spawnPortals()
      } else if (event === 'urgent_second_tick') {
        emitFeedback('urgent')
      } else if (event === 'squeeze_step') {
        for (const portal of this.portals) {
          if (this.isWall(portal.x, portal.y)) {
            const portalCell = this.pickOpenCell()
            portal.x = portalCell.x
            portal.y = portalCell.y
          }
        }
      } else if (event === 'head_crushed') {
        this.die('wall')
      }
    }
  }

  private spawnFood(): void {
    if (this.objectiveType === 'kills') {
      this.food = null
      return
    }
    const cell = this.pickOpenCell({
      preferredZone: this.floorTemplate === 'rooms_v1' ? 'room' : null,
    })
    this.food = { x: cell.x, y: cell.y, pulse: 0 }
  }

  private spawnPowerup(forcedType?: PowerupType): void {
    const cell = this.pickOpenCell()
    const type = pickPowerupType({
      floor: gameState.floor,
      isBossFloor: this.isBossFloor,
      objectiveType: this.objectiveType,
      forcedType,
      rng: this.rng,
    })
    this.powerup = { x: cell.x, y: cell.y, type, pulse: 0 }
  }

  private pickOpenCell(options?: {
    preferredZone?: 'room' | 'corridor' | null
    minDistanceFromCenter?: number
    fairness?: {
      playerHead?: Vec2 | null
      playerDir?: Vec2 | null
      minManhattanDistance?: number
      avoidForwardLaneSteps?: number
      minOpenNeighborCount?: number
      bodyLength?: number
    }
  }): Vec2 {
    const zoneCells =
      options?.preferredZone === 'room'
        ? this.roomCells
        : options?.preferredZone === 'corridor'
          ? this.corridorCells
          : null
    return pickOpenCell({
      cols: BASE_COLS,
      rows: BASE_ROWS,
      preferredZoneCells: zoneCells,
      minDistanceFromCenter: options?.minDistanceFromCenter ?? 0,
      fairness: options?.fairness,
      rng: this.rng,
      occupancy: {
        walls: this.walls,
        snake: this.snake,
        enemies: this.enemies.map((enemy) => enemy.body),
        portals: this.portals,
        rift: this.riftCell,
        food: this.food,
        powerup: this.powerup,
        biomeItem: this.biomeItem,
        extra: this.objectiveTerminals.map((terminal) => ({ x: terminal.x, y: terminal.y })),
      },
    })
  }

  private getItemSpawnConfig(): {
    riftBatteryOnFoodChance: number
    portalBeaconOnFoodChance: number
  } {
    return getItemSpawnConfigForFloor({
      floor: gameState.floor,
      objectiveType: this.objectiveType,
      hasOpenPortals: this.portals.length > 0,
    })
  }

  private resolveEliteKind(): EnemyKind | null {
    const cadence = BALANCE.eliteMiniboss.cadence
    const forceSpawn = shouldGuaranteeEliteCadence({
      floor: gameState.floor,
      isBossFloor: this.isBossFloor,
      currentRoomType: this.currentRoomType,
      startFloor: cadence.startFloor,
      everyNFloors: cadence.everyNFloors,
      guaranteeInEliteRooms: cadence.guaranteeInEliteRooms,
    })
    return pickEliteKind({ floor: gameState.floor, rng: this.rng, forceSpawn })
  }

  private resolveSpecialEnemyKind(): EnemyKind | null {
    return pickSpecialEnemyKind({ floor: gameState.floor, rng: this.rng })
  }

  private getPredatorPreyPhaseCueText(): string {
    const ticks = Math.max(0, this.predatorPreyPacingState.phaseTicksRemaining)
    if (this.predatorPreyPacingState.phase === 'hunt') {
      return `PACE HUNT ${ticks}`
    }
    if (this.predatorPreyPacingState.phase === 'escape') {
      return `PACE ESCAPE ${ticks}`
    }
    return `PACE RESET ${ticks}`
  }

  private registerPredatorPreyTransition(params: {
    from: PredatorPreyPacingPhase
    to: PredatorPreyPacingPhase
    reason: string
  }): void {
    gameState.predatorPreyPacingSummary.transitionEvents += 1
    gameState.predatorPreyPacingSummary.transitionsByPhase[params.to] += 1
    trackRetentionEvent('predator_prey_pacing_transition', {
      from: params.from,
      to: params.to,
      reason: params.reason,
      floor: gameState.floor,
      roomType: this.currentRoomType,
      phaseTicksRemaining: this.predatorPreyPacingState.phaseTicksRemaining,
    })
  }

  private advancePredatorPreyPacing(guardrailIntervened: boolean): void {
    const next = advancePredatorPreyPacingState({
      state: this.predatorPreyPacingState,
      config: BALANCE.predatorPreyPacing,
      guardrailIntervened,
    })
    this.predatorPreyPacingState = next.state
    if (!next.transitioned || !next.previousPhase || !next.reason) {
      return
    }
    this.registerPredatorPreyTransition({
      from: next.previousPhase,
      to: next.state.phase,
      reason: next.reason,
    })
  }

  private registerPredatorPreyGuardrailIntervention(
    reason: PredatorPreyPacingGuardrailReason,
    action: PredatorPreyPacingGuardrailAction,
  ): void {
    gameState.predatorPreyPacingSummary.guardrailInterventions += 1
    gameState.predatorPreyPacingSummary.guardrailReasonCounts[reason] += 1
    trackRetentionEvent('predator_prey_pacing_guardrail', {
      reason,
      action,
      phase: this.predatorPreyPacingState.phase,
      floor: gameState.floor,
      roomType: this.currentRoomType,
    })
    this.advancePredatorPreyPacing(true)
  }

  private getActivePredatorPreyPressureSources(): number {
    let count = 0
    for (const enemy of this.enemies) {
      if (!enemy.alive) {
        continue
      }
      if (
        isEliteMinibossKind(enemy.kind) ||
        enemy.role === 'sniper' ||
        enemy.role === 'charger' ||
        enemy.role === 'summoner'
      ) {
        count += 1
      }
    }
    return count
  }

  private getEliteMinibossCueText(): string | null {
    let bossPhase: EliteMinibossPatternPhase | null = null
    let bestPhase: EliteMinibossPatternPhase | null = null
    for (const enemy of this.enemies) {
      if (!enemy.alive || !isEliteMinibossKind(enemy.kind)) {
        continue
      }
      const phase = resolveEliteMinibossPatternPhase({
        enemy,
        recoveryTicks: BALANCE.eliteMiniboss.patternWindows.recoveryTicks,
      })
      if (enemy.kind === 'boss') {
        if (phase === 'telegraph') {
          bossPhase = 'telegraph'
        } else if (phase === 'commit' || bossPhase !== 'telegraph') {
          bossPhase = phase
        }
        continue
      }
      if (phase === 'telegraph') {
        return 'ELITE WINDOW: TELEGRAPH'
      }
      if (phase === 'commit') {
        bestPhase = 'commit'
      } else if (!bestPhase) {
        bestPhase = 'recovery'
      }
    }
    if (bossPhase === 'telegraph') {
      return `BOSS ${BALANCE.biome.boss.identity.cueLabel}: TELEGRAPH`
    }
    if (bossPhase === 'commit') {
      return `BOSS ${BALANCE.biome.boss.identity.cueLabel}: COMMIT`
    }
    if (bossPhase === 'recovery') {
      return `BOSS ${BALANCE.biome.boss.identity.cueLabel}: RECOVERY`
    }
    if (!bestPhase) {
      return null
    }
    if (bestPhase === 'commit') {
      return 'ELITE WINDOW: COMMIT'
    }
    return 'ELITE WINDOW: RECOVERY'
  }

  private trackEliteMinibossPhaseWindow(enemy: Enemy): void {
    if (!enemy.alive || !isEliteMinibossKind(enemy.kind)) {
      this.eliteMinibossPhaseByEnemyId.delete(enemy.id)
      return
    }
    const phase = resolveEliteMinibossPatternPhase({
      enemy,
      recoveryTicks: BALANCE.eliteMiniboss.patternWindows.recoveryTicks,
    })
    const previous = this.eliteMinibossPhaseByEnemyId.get(enemy.id)
    if (previous === phase) {
      return
    }
    this.eliteMinibossPhaseByEnemyId.set(enemy.id, phase)
    gameState.eliteMinibossReadability.phaseWindowEvents += 1
    if (enemy.kind === 'boss') {
      gameState.bossEncounterSummary.phaseWindowEvents += 1
      trackRetentionEvent('boss_phase_window', {
        encounterId: enemy.id,
        identityId: gameState.bossEncounterSummary.identityId,
        phase,
        counterplayTicksRemaining: enemy.readability.counterplayTicksRemaining,
        floor: gameState.floor,
      })
    }
    trackRetentionEvent('elite_miniboss_phase_window', {
      encounterId: enemy.id,
      kind: enemy.kind,
      role: enemy.role,
      phase,
      telegraphActive: enemy.readability.telegraphActive,
      counterplayTicksRemaining: enemy.readability.counterplayTicksRemaining,
      floor: gameState.floor,
      roomType: this.currentRoomType,
    })
  }

  private getActiveEliteMinibossPressureSources(): number {
    let count = 0
    for (const enemy of this.enemies) {
      if (!enemy.alive || !isEliteMinibossKind(enemy.kind)) {
        continue
      }
      const phase = resolveEliteMinibossPatternPhase({
        enemy,
        recoveryTicks: BALANCE.eliteMiniboss.patternWindows.recoveryTicks,
      })
      if (phase !== 'recovery') {
        count += 1
      }
    }
    return count
  }

  private cleanupEliteMinibossPhaseState(): void {
    const aliveIds = new Set(this.enemies.filter((enemy) => enemy.alive).map((enemy) => enemy.id))
    for (const enemyId of this.eliteMinibossPhaseByEnemyId.keys()) {
      if (!aliveIds.has(enemyId)) {
        this.eliteMinibossPhaseByEnemyId.delete(enemyId)
      }
    }
  }

  private registerEliteMinibossDamageReason(enemy: Enemy): void {
    if (!isEliteMinibossKind(enemy.kind)) {
      return
    }
    const head = this.snake[0]
    if (!head) {
      return
    }
    const openNeighborCount = countOpenNeighborCells({
      x: head.x,
      y: head.y,
      isBlocked: (x, y) =>
        this.isWall(x, y) ||
        this.snake.some((segment) => segment.x === x && segment.y === y) ||
        this.enemies.some(
          (candidate) =>
            candidate.alive && candidate.body.some((segment) => segment.x === x && segment.y === y),
        ),
    })
    const maxSimultaneousPressureSources =
      enemy.kind === 'boss'
        ? BALANCE.biome.boss.fairness.maxSimultaneousPressureSources
        : BALANCE.eliteMiniboss.fairness.maxSimultaneousPressureSources
    const reason = resolveEliteMinibossFailureReason({
      hadTelegraph: enemy.telegraph !== null || enemy.readability.telegraphActive,
      counterplayTicksRemaining: enemy.readability.counterplayTicksRemaining,
      openNeighborCount,
      activePressureSources: this.getActiveEliteMinibossPressureSources(),
      maxSimultaneousPressureSources,
    })
    gameState.eliteMinibossReadability.damageEvents += 1
    gameState.eliteMinibossReadability.failureReasonCounts[reason] += 1
    if (enemy.kind === 'boss') {
      gameState.bossEncounterSummary.damageEvents += 1
      gameState.bossEncounterSummary.failureReasonCounts[reason] += 1
      trackRetentionEvent('boss_damage_reason', {
        encounterId: enemy.id,
        identityId: gameState.bossEncounterSummary.identityId,
        phase: this.bossPhase,
        reason,
        openNeighborCount,
        activePressureSources: this.getActiveEliteMinibossPressureSources(),
        reactionWindowTicksMin: BALANCE.biome.boss.fairness.reactionWindowTicksMin,
        maxSimultaneousPressureSources,
        floor: gameState.floor,
      })
    }
    trackRetentionEvent('elite_miniboss_damage_reason', {
      encounterId: enemy.id,
      kind: enemy.kind,
      role: enemy.role,
      reason,
      openNeighborCount,
      floor: gameState.floor,
      roomType: this.currentRoomType,
    })
  }

  private activateRiftSuppression(source: WorldItemType): void {
    this.riftSuppressionMsRemaining = BALANCE.item.effectDurations.riftSuppressionMs
    this.riftTimer = 0
    this.riftCell = null
    trackRetentionEvent('rift_suppressed', {
      phase: 'start',
      source,
      floor: gameState.floor,
      durationMs: BALANCE.item.effectDurations.riftSuppressionMs,
    })
  }

  private spawnBiomeItem(): void {
    const canSpawn = gameState.floor >= BALANCE.biome.coreItem.spawnFloor && !this.biomeItem
    if (!canSpawn) {
      return
    }
    const cell = this.pickOpenCell()
    if (
      this.roomObjective &&
      !this.roomObjective.completed &&
      this.roomObjective.kind === 'collect_cores'
    ) {
      this.biomeItem = { x: cell.x, y: cell.y, pulse: 0, type: 'core' }
      return
    }
    const floorItemConfig = this.getItemSpawnConfig()
    const portalBeaconRoll =
      this.objectiveType === 'portal' &&
      this.portals.length === 0 &&
      this.rng.nextFloat() < floorItemConfig.portalBeaconOnFoodChance
    const riftBatteryRoll = this.rng.nextFloat() < floorItemConfig.riftBatteryOnFoodChance
    const coreRoll = this.rng.nextFloat() < BALANCE.biome.coreItem.spawnChanceOnFood
    const type: WorldItemType | null = portalBeaconRoll
      ? 'portal_beacon'
      : riftBatteryRoll
        ? 'rift_battery'
        : coreRoll
          ? 'core'
          : null
    if (!type) {
      return
    }
    this.biomeItem = { x: cell.x, y: cell.y, pulse: 0, type }
  }

  private spawnEnemy(kind: Enemy['kind'] = 'normal'): void {
    const rolePolicy = getRoleSpawnPolicyForFloor(gameState.floor)
    const rolePick =
      kind === 'normal'
        ? pickRoleByPolicy({
            rng: this.rng,
            enemies: this.enemies,
            state: this.roleSpawnCadence,
            policy: rolePolicy,
          })
        : null
    if (rolePick) {
      this.roleSpawnCadence = rolePick.state
    }
    const forcedKindFromRole: EnemyKind | null =
      rolePick?.role === 'sniper'
        ? 'mirror'
        : rolePick?.role === 'summoner'
          ? 'egg'
          : rolePick?.role === 'charger'
            ? 'ambusher'
            : rolePick?.role === 'leech'
              ? 'stalker'
              : rolePick?.role === 'blocker'
                ? 'normal'
                : null
    let resolvedKind =
      kind === 'normal'
        ? (forcedKindFromRole ??
          this.resolveSpecialEnemyKind() ??
          this.resolveEliteKind() ??
          'normal')
        : kind
    if (
      kind === 'normal' &&
      isEliteMinibossKind(resolvedKind) &&
      this.getActiveEliteMinibossPressureSources() >=
        BALANCE.eliteMiniboss.fairness.maxSimultaneousPressureSources
    ) {
      resolvedKind = 'normal'
    }
    let role = getEnemyRoleFromKind(resolvedKind, BALANCE.enemyRoles.byKind)
    const isHighPressureCandidate =
      isEliteMinibossKind(resolvedKind) ||
      role === 'sniper' ||
      role === 'charger' ||
      role === 'summoner'
    if (kind === 'normal' && isHighPressureCandidate) {
      const guardrail = shouldAllowPredatorPreyPressureAction({
        state: this.predatorPreyPacingState,
        currentPressureSources: this.getActivePredatorPreyPressureSources(),
        ticksSinceLastPressureAction: this.predatorPreyTick - this.lastPredatorPreyPressureTick,
        config: BALANCE.predatorPreyPacing,
      })
      if (!guardrail.allow && BALANCE.predatorPreyPacing.guardrails.fallbackAction === 'defer') {
        this.registerPredatorPreyGuardrailIntervention(guardrail.reason, 'defer')
        resolvedKind = 'normal'
        role = getEnemyRoleFromKind(resolvedKind, BALANCE.enemyRoles.byKind)
      } else if (guardrail.allow) {
        this.lastPredatorPreyPressureTick = this.predatorPreyTick
      }
    }
    const randomLen =
      BALANCE.enemy.lengthBase +
      this.rng.nextInt(0, BALANCE.enemy.lengthRandomRange - 1) +
      Math.floor(gameState.floor / BALANCE.enemy.lengthFloorStep)
    const len =
      resolvedKind === 'boss'
        ? Math.max(2, BALANCE.biome.boss.health + 1)
        : resolvedKind === 'egg'
          ? 1
          : resolvedKind === 'mirror'
            ? Math.max(3, randomLen + 1)
            : Math.max(
                2,
                resolvedKind === 'stalker' || resolvedKind === 'ambusher'
                  ? randomLen + 1
                  : randomLen,
              )
    const isEliteOrMiniboss = isEliteMinibossKind(resolvedKind)
    const seedCell = this.pickOpenCell({
      preferredZone: this.floorTemplate === 'rooms_v1' ? 'corridor' : null,
      minDistanceFromCenter: 6,
      fairness: {
        playerHead: this.snake[0] ?? null,
        playerDir: this.currentDir,
        minManhattanDistance: isEliteOrMiniboss
          ? BALANCE.eliteMiniboss.fairness.spawnMinManhattanDistance
          : BALANCE.combatFairness.spawn.enemyMinDistanceFromPlayer,
        avoidForwardLaneSteps: BALANCE.combatFairness.spawn.avoidPlayerForwardLaneSteps,
        minOpenNeighborCount: isEliteOrMiniboss
          ? BALANCE.eliteMiniboss.fairness.minEscapeNeighbors
          : BALANCE.combatFairness.spawn.minOpenNeighborCount,
        bodyLength: len,
      },
    })
    const x = seedCell.x
    const y = seedCell.y
    const body = Array.from({ length: len }, (_, i) => ({ x: Math.max(0, x - i), y }))
    if (resolvedKind !== 'normal') {
      trackRetentionEvent('elite_spawned', {
        kind: resolvedKind,
        floor: gameState.floor,
        score: this.score,
      })
    }
    this.enemies.push({
      id: this.nextEnemyId++,
      body,
      dir: { x: 1, y: 0 },
      alive: true,
      kind: resolvedKind,
      role,
      health: resolvedKind === 'boss' ? BALANCE.biome.boss.health : 1,
      dashCooldown: 0,
      hatchTurnsRemaining: resolvedKind === 'egg' ? BALANCE.enemyVariants.egg.hatchTurns : 0,
      mirrorDelaySteps: resolvedKind === 'mirror' ? BALANCE.enemyVariants.mirror.delaySteps : 0,
      roleCooldown: 0,
      telegraph: null,
      readability: createEnemyReadabilityState(role),
    })
    const spawned = this.enemies[this.enemies.length - 1]
    if (spawned) {
      this.trackEliteMinibossPhaseWindow(spawned)
    }
    trackRetentionEvent('encounter_role_composition', {
      floor: gameState.floor,
      reason: kind === 'normal' ? 'spawn' : 'forced_spawn',
      roles: summarizeActiveRoles(this.enemies),
      depthBand: getDepthBandForFloor(gameState.floor),
    })
  }

  private emitRoleCompositionTelemetry(reason: 'room_start' | 'spawn'): void {
    if (!this.usesCombatRoomFlow()) {
      return
    }
    trackRetentionEvent('encounter_role_composition', {
      floor: gameState.floor,
      reason,
      roles: summarizeActiveRoles(this.enemies),
      depthBand: getDepthBandForFloor(gameState.floor),
    })
  }

  private showRoomRoleContext(): void {
    if (!this.usesCombatRoomFlow()) {
      return
    }
    const summary = summarizeActiveRoles(this.enemies)
    if (!summary) {
      return
    }
    setHintText(`Roles: ${summary}`)
  }

  private ensureObjectiveEnemyAvailability(): void {
    if (
      this.isBossFloor ||
      this.objectiveType !== 'kills' ||
      this.isDying ||
      this.getObjectiveKillsProgress() >= this.objectiveKillsTarget
    ) {
      return
    }
    const aliveCount = this.enemies.reduce((count, enemy) => (enemy.alive ? count + 1 : count), 0)
    if (aliveCount > 0) {
      return
    }
    this.spawnEnemy()
  }

  private checkEnemyCollision(): EnemyCollision | null {
    const head = this.snake[0] ?? null
    const collision: EnemyCollisionMatch | null = detectEnemyCollision(head, this.enemies)
    if (!collision) {
      return null
    }
    const enemy = this.enemies[collision.enemyIndex]
    if (!enemy) {
      return null
    }
    this.killEnemy(enemy)
    return { enemy, part: collision.part }
  }

  private applyBossKnockback(previousHead: SnakeSegment): void {
    this.snake.shift()
    if (!this.snake[0]) {
      this.snake.unshift({ x: previousHead.x, y: previousHead.y })
    }
    this.spawnParticles(previousHead.x, previousHead.y, COLORS.enemyHead, 8)
    this.triggerDamageFeedback(previousHead.x, previousHead.y, COLORS.enemyHead)
    setHintText(t('game.bossKnockback'))
  }

  private getEnemyCollisionDamage(enemy: Enemy, part: EnemyCollisionPart): number {
    return resolveEnemyCollisionDamage({
      kind: enemy.kind,
      part,
      headDamageSegments: BALANCE.enemyCollision.headDamageSegments,
      bodyDamageSegments: BALANCE.enemyCollision.bodyDamageSegments,
      bossHeadDamageSegments: BALANCE.enemyCollision.bossHeadDamageSegments,
      bossBodyDamageSegments: BALANCE.enemyCollision.bossBodyDamageSegments,
    })
  }

  private applySnakeSegmentDamage(enemy: Enemy, part: EnemyCollisionPart): boolean {
    const damage = Math.max(1, this.getEnemyCollisionDamage(enemy, part))
    const removed = this.removeSnakeSegments(damage, 'damage')
    if (removed > 0) {
      this.advanceRoomObjective({ type: 'damage_taken', damageKind: 'body' })
    }
    if (removed < damage) {
      this.die('enemy')
      return false
    }
    const head = this.snake[0]
    if (head) {
      this.triggerDamageFeedback(head.x, head.y, COLORS.enemyHead)
    }
    return true
  }

  private killEnemy(enemy: Enemy): void {
    enemy.health -= 1
    if (enemy.health > 0) {
      if (enemy.kind === 'boss' && enemy.body.length > 1) {
        enemy.body.pop()
      }
      const head = enemy.body[0]
      if (head) {
        this.spawnParticles(head.x, head.y, COLORS.shield, 6)
      }
      if (enemy.kind === 'boss' && enemy.health <= 1 && this.bossPhase !== 'rage') {
        this.bossPhase = 'rage'
        gameState.bossEncounterSummary.highestPhase = resolveBossHighestPhase(
          gameState.bossEncounterSummary.highestPhase,
          'rage',
        )
        trackRetentionEvent('boss_phase_changed', {
          identityId: gameState.bossEncounterSummary.identityId,
          phase: 'rage',
          floor: gameState.floor,
        })
        setHintText(t('game.bossPhaseRageHint'))
        this.triggerDamageFeedback(head.x, head.y, COLORS.enemyHead)
      }
      return
    }
    enemy.alive = false
    const head = enemy.body[0]
    if (head) {
      this.spawnParticles(head.x, head.y, COLORS.enemy, 10)
    }
    gameState.kills += 1
    if (enemy.kind === 'boss') {
      gameState.eliteKills += 1
      trackRetentionEvent('elite_defeated', {
        kind: enemy.kind,
        floor: gameState.floor,
        score: this.score,
      })
      trackRetentionEvent('goal_progressed', {
        goalId: 'elite_hunter_12',
        delta: 1,
        runEliteKills: gameState.eliteKills,
        source: 'combat',
      })
      this.score += Math.floor(BALANCE.biome.boss.scoreOnDefeat * this.cfg.scoreMult)
    } else if (enemy.kind === 'stalker' || enemy.kind === 'ambusher') {
      gameState.eliteKills += 1
      trackRetentionEvent('elite_defeated', {
        kind: enemy.kind,
        floor: gameState.floor,
        score: this.score,
      })
      trackRetentionEvent('goal_progressed', {
        goalId: 'elite_hunter_12',
        delta: 1,
        runEliteKills: gameState.eliteKills,
        source: 'combat',
      })
      const eliteScore =
        enemy.kind === 'stalker'
          ? BALANCE.elite.stalker.scoreOnKill
          : BALANCE.elite.ambusher.scoreOnKill
      this.score += Math.floor(eliteScore * this.cfg.scoreMult)
    } else if (enemy.kind === 'egg') {
      this.score += Math.floor(BALANCE.enemyVariants.egg.scoreOnKill * this.cfg.scoreMult)
    } else if (enemy.kind === 'mirror') {
      this.score += Math.floor(BALANCE.enemyVariants.mirror.scoreOnKill * this.cfg.scoreMult)
    } else {
      this.score += Math.floor(BALANCE.enemy.scoreOnKill * this.cfg.scoreMult)
    }
    updateHud(this.score)
    if (enemy.kind === 'stalker' || enemy.kind === 'ambusher') {
      const gateIsCritical = isObjectiveCriticalEncounter({
        isBossFloor: this.isBossFloor,
        currentRoomType: this.currentRoomType,
        roomObjective: this.roomObjective,
        objectiveCriticalRoomTypes: BALANCE.eliteMiniboss.rewardGate.objectiveCriticalRoomTypes,
      })
      setHintText(
        `Encounter: ${enemy.kind.toUpperCase()} DOWN · ${
          gateIsCritical ? 'OBJECTIVE GATE' : 'FLOW CONTINUES'
        }`,
      )
      this.advanceRoomObjective({ type: 'elite_defeated' })
    } else if (enemy.kind === 'boss') {
      setHintText('Encounter: BOSS DOWN · OBJECTIVE GATE')
    }
  }

  private spawnParticles(cx: number, cy: number, color: number, count: number): void {
    const finalCount = isReducedEffectsEnabled() ? Math.max(2, Math.ceil(count * 0.35)) : count
    for (let i = 0; i < count; i += 1) {
      if (i >= finalCount) {
        break
      }
      this.particles.push({
        x: cx * CELL + CELL / 2,
        y: cy * CELL + CELL / 2,
        vx: (this.fxRng.nextFloat() - 0.5) * 14,
        vy: (this.fxRng.nextFloat() - 0.5) * 14,
        life: 1,
        maxLife: 0.6 + this.fxRng.nextFloat() * 0.6,
        color,
        size: 1.2 + this.fxRng.nextFloat() * 2.5,
      })
    }
  }

  private moveSnake(slideDepth = 0): void {
    const head = this.snake[0]
    if (!head) {
      return
    }
    let nx = head.x + this.currentDir.x
    let ny = head.y + this.currentDir.y

    if (this.isWall(nx, ny)) {
      if (this.ghostCharges > 0) {
        nx = (nx + BASE_COLS) % BASE_COLS
        ny = (ny + BASE_ROWS) % BASE_ROWS
        if (this.isWall(nx, ny)) {
          this.die('wall')
          return
        }
        this.ghostCharges -= 1
        this.spawnParticles(head.x, head.y, COLORS.shield, 8)
      } else {
        this.die('wall')
        return
      }
    }

    if (this.snake.slice(1, -1).some((segment) => segment.x === nx && segment.y === ny)) {
      this.die('self')
      return
    }

    this.snake.unshift({ x: nx, y: ny })
    this.playerHeadHistory.push({ x: nx, y: ny })
    if (this.playerHeadHistory.length > 80) {
      this.playerHeadHistory.splice(0, this.playerHeadHistory.length - 80)
    }
    const landedOnIce = this.isIce(nx, ny)
    if (this.riftCell && nx === this.riftCell.x && ny === this.riftCell.y) {
      if (this.hasContactGrace()) {
        // Grace windows suppress repeated contact damage while the board keeps moving.
      } else if (this.shields > 0) {
        this.shields -= 1
        this.triggerDamageFeedback(nx, ny, COLORS.shield, true)
        this.advanceRoomObjective({ type: 'damage_taken', damageKind: 'shield' })
        this.startContactGrace(BALANCE.combatFairness.grace.postHitMs)
      } else {
        this.die('rift')
        return
      }
    }

    const touchedTerminal = this.objectiveTerminals.find(
      (terminal) => !terminal.activated && terminal.x === nx && terminal.y === ny,
    )
    if (touchedTerminal) {
      touchedTerminal.activated = true
      this.spawnParticles(nx, ny, COLORS.beacon, 10)
      this.triggerPickupFeedback(nx, ny, COLORS.beacon)
      this.advanceRoomObjective({ type: 'terminal_activated' })
    }

    if (
      !this.isBossFloor &&
      this.objectiveType === 'portal' &&
      this.portals.some((portal) => portal.x === nx && portal.y === ny)
    ) {
      const selectedPortal = this.portals.find((portal) => portal.x === nx && portal.y === ny)
      if (selectedPortal) {
        const portalIndex = selectedPortal.route === 'riskier' ? 1 : 0
        this.pickRouteChoice(portalIndex)
      }
      return
    }

    if (this.food && nx === this.food.x && ny === this.food.y) {
      this.triggerPickupFeedback(nx, ny, COLORS.food)
      this.score += Math.floor(BALANCE.food.scoreOnEat * this.cfg.scoreMult)
      this.pendingGrowth += 1
      if (this.corePressureActive) {
        const nextPressure = resetCorePressureTimer({
          active: this.corePressureActive,
          intervalMs: this.corePressureIntervalMs,
          remainingMs: this.corePressureRemainingMs,
          coolantCharges: this.corePressureCoolantCharges,
        })
        this.corePressureRemainingMs = nextPressure.remainingMs
      }
      this.spawnParticles(nx, ny, COLORS.food, 8)
      this.spawnFood()
      if (this.rng.nextFloat() < BALANCE.spawn.powerupOnFoodChance) {
        this.spawnPowerup()
      }
      this.spawnBiomeItem()
      updateHud(this.score)
    }

    if (this.powerup && nx === this.powerup.x && ny === this.powerup.y) {
      const collectedType = this.powerup.type
      this.powerup = null
      this.applyPowerup(collectedType)
      this.spawnParticles(nx, ny, COLORS.powerup, 10)
      this.triggerPickupFeedback(nx, ny, COLORS.powerup, true)
      if (this.isBossFloor) {
        this.bossSupportShieldRespawnMs = BALANCE.biome.boss.supportShieldRespawnMs
      }
      if (this.rng.nextFloat() < BALANCE.spawn.powerupRespawnChance) {
        this.time.delayedCall(BALANCE.spawn.powerupRespawnDelayMs, () => {
          if (this.scene.isActive('Game')) {
            this.spawnPowerup()
          }
        })
      }
    }
    if (this.biomeItem && nx === this.biomeItem.x && ny === this.biomeItem.y) {
      if (this.biomeItem.type === 'rift_battery') {
        this.activateRiftSuppression('rift_battery')
        trackRetentionEvent('item_collected', {
          item: 'rift_battery',
          floor: gameState.floor,
          score: this.score,
        })
        this.spawnParticles(nx, ny, COLORS.slow, 12)
        this.triggerPickupFeedback(nx, ny, COLORS.slow, true)
      } else if (this.biomeItem.type === 'portal_beacon') {
        if (this.objectiveType === 'portal') {
          const accelerated = applyPortalBeaconAcceleration(
            {
              countdownMs: this.portalCountdownMs,
              graceMs: this.portalGraceMs,
              graceSecondCue: this.portalGraceSecondCue,
              squeezeStepTimerMs: this.squeezeStepTimerMs,
              squeezeInset: this.squeezeInset,
              active: this.objectiveType === 'portal',
            },
            BALANCE.item.effectDurations.portalAccelerateMs,
          )
          this.portalCountdownMs = accelerated.countdownMs
        }
        trackRetentionEvent('item_collected', {
          item: 'portal_beacon',
          floor: gameState.floor,
          score: this.score,
        })
        this.spawnParticles(nx, ny, COLORS.beacon, 12)
        this.triggerPickupFeedback(nx, ny, COLORS.beacon, true)
        if (
          this.objectiveType === 'portal' &&
          this.portals.length === 0 &&
          this.portalCountdownMs <= 0
        ) {
          this.spawnPortals()
        } else if (this.objectiveType === 'portal' && this.portals.length === 0) {
          setHintText(t('game.portalAccelerated'))
        }
      } else {
        this.score += Math.floor(BALANCE.biome.coreItem.scoreBonus * this.cfg.scoreMult)
        this.pendingGrowth += BALANCE.biome.coreItem.growthBonus
        if (this.corePressureActive) {
          const nextPressure = addCorePressureCoolant(
            {
              active: this.corePressureActive,
              intervalMs: this.corePressureIntervalMs,
              remainingMs: this.corePressureRemainingMs,
              coolantCharges: this.corePressureCoolantCharges,
            },
            BALANCE.biome.pressure.coolantPerCoreItem,
          )
          this.corePressureCoolantCharges = nextPressure.coolantCharges
          this.corePressureRemainingMs = nextPressure.remainingMs
          trackRetentionEvent('core_pressure_coolant_gained', {
            floor: gameState.floor,
            coolantTotal: this.corePressureCoolantCharges,
          })
        }
        trackRetentionEvent('item_collected', {
          item: 'core',
          floor: gameState.floor,
          score: this.score,
        })
        this.spawnParticles(nx, ny, COLORS.snakeHead, 12)
        this.triggerPickupFeedback(nx, ny, COLORS.snakeHead, true)
        this.advanceRoomObjective({ type: 'core_collected' })
        updateHud(this.score)
      }
      this.biomeItem = null
    }

    const enemyCollision = this.hasContactGrace() ? null : this.checkEnemyCollision()
    if (enemyCollision) {
      const collidedEnemy = enemyCollision.enemy
      if (this.shields > 0) {
        this.shields = Math.max(0, this.shields - 1)
        this.triggerDamageFeedback(nx, ny, COLORS.shield, true)
        this.advanceRoomObjective({ type: 'damage_taken', damageKind: 'shield' })
        trackRetentionEvent('role_pressure_outcome', {
          role: collidedEnemy.role,
          outcome: 'shield_hit',
          floor: gameState.floor,
          score: this.score,
        })
        this.registerEliteMinibossDamageReason(collidedEnemy)
        this.startContactGrace(BALANCE.combatFairness.grace.postHitMs)
        if (collidedEnemy.kind === 'boss' && collidedEnemy.alive) {
          this.applyBossKnockback(head)
        }
        this.enemies = this.enemies.filter((enemy) => enemy.alive)
        this.cleanupEliteMinibossPhaseState()
        if (
          !this.isBossFloor &&
          this.rng.nextFloat() < BALANCE.spawn.enemyRespawnOnShieldHitChance
        ) {
          this.spawnEnemy()
        }
      } else {
        const survived = this.applySnakeSegmentDamage(collidedEnemy, enemyCollision.part)
        if (!survived) {
          return
        }
        trackRetentionEvent('role_pressure_outcome', {
          role: collidedEnemy.role,
          outcome: 'body_hit',
          floor: gameState.floor,
          score: this.score,
        })
        this.registerEliteMinibossDamageReason(collidedEnemy)
        this.startContactGrace(BALANCE.combatFairness.grace.postHitMs)
        if (collidedEnemy.kind === 'boss' && collidedEnemy.alive) {
          this.applyBossKnockback(head)
        }
        this.enemies = this.enemies.filter((enemy) => enemy.alive)
        this.cleanupEliteMinibossPhaseState()
      }
    } else {
      this.enemies = this.enemies.filter((enemy) => enemy.alive)
      this.cleanupEliteMinibossPhaseState()
      if (
        !this.isBossFloor &&
        this.enemies.length < this.enemyCount &&
        this.rng.nextFloat() < BALANCE.spawn.enemyRespawnIdleChance
      ) {
        this.spawnEnemy()
      }
    }

    if (this.rewardPending) {
      return
    }

    if (this.completeObjectiveIfReady()) {
      return
    }

    if (this.isBossFloor && this.enemies.length === 0) {
      transitionToScene(this, 'Upgrade', {
        chrome: 'run',
        data: { score: this.score, floor: gameState.floor },
      })
      return
    }

    if (this.pendingGrowth > 0) {
      this.pendingGrowth -= 1
    } else {
      this.snake.pop()
    }

    if (landedOnIce && slideDepth < this.iceSlideSteps) {
      this.spawnParticles(nx, ny, COLORS.ice, 5)
      this.moveSnake(slideDepth + 1)
    }
  }

  private completeObjectiveIfReady(): boolean {
    const completed = shouldCompleteObjective({
      isBossFloor: this.isBossFloor,
      objectiveType: this.objectiveType,
      scoreProgress: this.getObjectiveScoreProgress(),
      scoreTarget: this.objectiveScoreTarget,
      killsProgress: this.getObjectiveKillsProgress(),
      killsTarget: this.objectiveKillsTarget,
    })
    if (completed) {
      this.triggerObjectiveFeedback(true)
      this.completeRoomExit()
      return true
    }
    return false
  }

  private applyPowerup(type: PowerupType): void {
    if (this.cfg.powerupGrowth > 0) {
      this.pendingGrowth += this.cfg.powerupGrowth
    }
    this.score += Math.floor(
      BALANCE.powerup.scoreBonus * this.cfg.scoreMult * this.cfg.powerupScoreMult,
    )
    updateHud(this.score)

    if (type === 'shield') {
      this.shields += 1
      return
    }
    if (type === 'venom') {
      this.venomCharges += 1
      return
    }
    if (type === 'slow') {
      this.enemyInterval *= BALANCE.powerup.slowMultiplier
      return
    }
    if (type === 'ghost') {
      this.ghostCharges += 1
      return
    }
  }

  private die(reason: DeathReason): void {
    if (this.isDying) {
      return
    }
    this.isDying = true
    const head = this.snake[0]
    if (head) {
      this.spawnParticles(head.x, head.y, COLORS.food, 20)
    }
    this.shakeTimer = 0.4
    this.drawFrame()
    this.input.keyboard?.removeAllListeners()
    const timeAliveMs = Math.max(0, Math.floor(this.time.now - this.runStartMs))
    trackRetentionEvent('death_reason', {
      reason,
      floor: gameState.floor,
      score: this.score,
      kills: gameState.kills,
      inputMode: getControlMode(),
      depthBand: getDepthBandForFloor(gameState.floor),
    })
    trackRetentionEvent('time_alive', {
      timeAliveMs,
      floor: gameState.floor,
      score: this.score,
      kills: gameState.kills,
      inputMode: getControlMode(),
      depthBand: getDepthBandForFloor(gameState.floor),
    })
    trackRetentionEvent('level_fail_point', {
      floor: gameState.floor,
      depthBand: getDepthBandForFloor(gameState.floor),
      reason,
      objectiveType: this.objectiveType,
      roomType: this.currentRoomType,
      enemyCount: this.enemyCount,
      enemyInterval: Math.floor(this.enemyInterval),
    })
    this.time.delayedCall(600, () =>
      transitionToScene(this, 'Death', {
        chrome: 'run',
        data: { score: this.score, deathReason: reason, timeAliveMs },
      }),
    )
    emitFeedback(reason === 'rift' ? 'danger' : 'crash')
    setHintText(getRestartHintText())
  }

  private drawBackground(): void {
    const g = this.bgGraphics
    g.clear()
    g.fillStyle(COLORS.bg)
    g.fillRect(0, 0, WIDTH, HEIGHT)

    const t = this.time.now * 0.001

    // 1. Soft "Nebula" Glows
    const nebulae = [
      { x: WIDTH * 0.22, y: HEIGHT * 0.3, r: 110, c: 0x1a0a35, a: 0.4 },
      { x: WIDTH * 0.78, y: HEIGHT * 0.72, r: 140, c: 0x0a1a45, a: 0.3 },
    ]
    for (const n of nebulae) {
      const pulse = 1.0 + Math.sin(t * 0.8) * 0.1
      g.fillStyle(n.c, n.a * pulse)
      // Use large circles as simple gradients for now
      for (let ir = 1; ir <= 3; ir += 1) {
        g.fillCircle(n.x, n.y, n.r * pulse * (1.1 - ir * 0.2))
      }
    }

    // 2. Parallax Grid (Deep Layer)
    const head = this.snake[0] || { x: 0, y: 0 }
    const ox = head.x * 0.4
    const oy = head.y * 0.4
    g.lineStyle(1, 0x1a1a45, 0.12)
    for (let x = -2; x <= BASE_COLS + 2; x += 1) {
      g.moveTo((x + (ox % 1)) * CELL, 0)
      g.lineTo((x + (ox % 1)) * CELL, HEIGHT)
    }
    for (let y = -2; y <= BASE_ROWS + 2; y += 1) {
      g.moveTo(0, (y + (oy % 1)) * CELL)
      g.lineTo(WIDTH, (y + (oy % 1)) * CELL)
    }
    g.strokePath()

    // 3. Main Action Grid
    g.lineStyle(1, COLORS.grid, 0.28)
    for (let x = 0; x <= BASE_COLS; x += 1) {
      g.moveTo(x * CELL, 0)
      g.lineTo(x * CELL, HEIGHT)
    }
    for (let y = 0; y <= BASE_ROWS; y += 1) {
      g.moveTo(0, y * CELL)
      g.lineTo(WIDTH, y * CELL)
    }
    g.strokePath()

    // 4. Stars
    for (const star of this.stars) {
      const st = t * 2 + star.x * 0.01
      const alpha = star.alpha * (Math.sin(st) * 0.3 + 0.7)
      g.fillStyle(0x99ccff, alpha)
      g.fillRect(star.x, star.y, star.size, star.size)
    }

    g.lineStyle(2, COLORS.wallBright, 0.8)
    g.strokeRect(0, 0, WIDTH, HEIGHT)
  }

  private drawWalls(): void {
    const g = this.wallGraphics
    g.clear()
    for (const key of this.walls) {
      const [xRaw, yRaw] = key.split(',')
      const x = Number(xRaw)
      const y = Number(yRaw)
      g.fillStyle(COLORS.wall)
      g.fillRect(x * CELL, y * CELL, CELL, CELL)
      g.fillStyle(0x11183b, 0.85)
      g.fillRect(x * CELL + cellPx(3), y * CELL + cellPx(3), CELL - cellPx(6), CELL - cellPx(6))
      g.fillStyle(0x4b63da, 0.5)
      g.fillRect(x * CELL + cellPx(2), y * CELL + cellPx(2), cellPx(2), cellPx(2))
      g.fillRect(x * CELL + CELL - cellPx(4), y * CELL + cellPx(2), cellPx(2), cellPx(2))
      g.fillRect(x * CELL + cellPx(2), y * CELL + CELL - cellPx(4), cellPx(2), cellPx(2))
      g.fillRect(x * CELL + CELL - cellPx(4), y * CELL + CELL - cellPx(4), cellPx(2), cellPx(2))
      g.lineStyle(1, COLORS.wallBright, 0.65)
      g.strokeRect(x * CELL, y * CELL, CELL, CELL)
    }
  }

  /** Sand / ice — static for the floor unless `iceTiles` / `sandTiles` mutate at runtime. */
  private redrawTerrainGraphics(): void {
    const g = this.terrainGraphics
    g.clear()
    if (this.sandActive && this.sandTiles.size > 0) {
      for (const key of this.sandTiles) {
        const [xRaw, yRaw] = key.split(',')
        const x = Number(xRaw)
        const y = Number(yRaw)
        const sx = x * CELL
        const sy = y * CELL
        g.fillStyle(COLORS.sandGlow, 0.11)
        g.fillRect(sx + cellPx(1), sy + cellPx(1), CELL - cellPx(2), CELL - cellPx(2))
        g.lineStyle(1, COLORS.sand, 0.52)
        g.strokeRect(sx + cellPx(1.5), sy + cellPx(1.5), CELL - cellPx(3), CELL - cellPx(3))
        g.fillStyle(0xffefc7, 0.35)
        g.fillRect(sx + cellPx(5), sy + cellPx(6), cellPx(2), cellPx(2))
        g.fillRect(sx + cellPx(11), sy + cellPx(9), cellPx(2), cellPx(2))
        g.fillRect(sx + cellPx(8), sy + cellPx(13), cellPx(2), cellPx(2))
      }
    }
    if (this.iceActive && this.iceTiles.size > 0) {
      for (const key of this.iceTiles) {
        const [xRaw, yRaw] = key.split(',')
        const x = Number(xRaw)
        const y = Number(yRaw)
        const ix = x * CELL
        const iy = y * CELL
        g.fillStyle(COLORS.iceGlow, 0.14)
        g.fillRect(ix + cellPx(1), iy + cellPx(1), CELL - cellPx(2), CELL - cellPx(2))
        g.lineStyle(1, COLORS.ice, 0.58)
        g.strokeRect(ix + cellPx(1.5), iy + cellPx(1.5), CELL - cellPx(3), CELL - cellPx(3))
        g.lineStyle(1, 0xcdf6ff, 0.42)
        g.beginPath()
        g.moveTo(ix + cellPx(4), iy + cellPx(6))
        g.lineTo(ix + CELL - cellPx(5), iy + CELL - cellPx(7))
        g.moveTo(ix + CELL - cellPx(6), iy + cellPx(5))
        g.lineTo(ix + cellPx(6), iy + CELL - cellPx(6))
        g.strokePath()
      }
    }
  }

  /**
   * Darkness overlay: batch horizontal runs per row (same alpha) instead of one fillRect per cell.
   * Was ~O(cols×rows) draw calls; now typically a few segments per row.
   */
  private drawDarknessOverlay(g: Phaser.GameObjects.Graphics, head: SnakeSegment): void {
    const hx = head.x
    const hy = head.y
    const R = this.darknessRadius
    const edgeLimit = R + this.darknessEdgeFalloff
    const outerAlpha = this.darknessAlphaOuter
    const edgeAlpha = this.darknessAlphaEdge

    for (let y = 0; y < BASE_ROWS; y += 1) {
      const dy = Math.abs(y - hy)
      const y0 = y * CELL
      let x = 0
      while (x < BASE_COLS) {
        const dist = Math.abs(x - hx) + dy
        if (dist <= R) {
          x += 1
          continue
        }
        const alpha = dist <= edgeLimit ? edgeAlpha : outerAlpha
        const x0 = x
        x += 1
        while (x < BASE_COLS) {
          const d2 = Math.abs(x - hx) + dy
          if (d2 <= R) {
            break
          }
          const a2 = d2 <= edgeLimit ? edgeAlpha : outerAlpha
          if (a2 !== alpha) {
            break
          }
          x += 1
        }
        g.fillStyle(COLORS.bg, alpha)
        g.fillRect(x0 * CELL, y0, (x - x0) * CELL, CELL)
      }
    }
  }

  private drawFrame(): void {
    const g = this.gameGraphics
    g.clear()

    this.markerFood.setVisible(false)
    this.markerPortal0.setVisible(false)
    this.markerPortal1.setVisible(false)
    this.markerRift.setVisible(false)
    this.markerPowerup.setVisible(false)
    this.markerBiome.setVisible(false)
    const globalJitter = 0.4 + (this.cameras.main.shakeEffect.isRunning ? 0.8 : 0)

    for (const refImg of this.referenceMarkerImages) {
      refImg.setVisible(false)
    }

    if (!isReducedEffectsEnabled() && this.flashTimer > 0) {
      this.fxGraphics.clear()
      this.fxGraphics.fillStyle(this.flashColor, this.flashTimer * 0.3)
      this.fxGraphics.fillRect(0, 0, WIDTH, HEIGHT)
      this.flashTimer -= 0.016
    } else {
      this.fxGraphics.clear()
    }

    if (this.food) {
      const fx = this.food.x * CELL
      const fy = this.food.y * CELL
      const cx = fx + CELL / 2
      const cy = fy + CELL / 2
      this.markerFood.setTexture(markerTextureKey('core'))
      this.markerFood.setPosition(Math.round(cx), Math.round(cy))
      this.markerFood.setDisplaySize(CELL, CELL)
      this.markerFood.setAlpha(0.95)
      this.markerFood.setVisible(true)
    }
    if (this.portals.length > 0 && !this.isBossFloor) {
      let portalIndex = 0
      for (const portal of this.portals) {
        const pulse = Math.sin(portal.pulse) * 0.35 + 0.75
        const px = portal.x * CELL
        const py = portal.y * CELL
        const isRiskier = portal.route === 'riskier'
        const glow = isRiskier ? 0xffa24a : COLORS.portalGlow
        g.fillStyle(glow, 0.22 * pulse)
        g.fillCircle(px + CELL / 2, py + CELL / 2, CELL * 0.95)
        const pcx = px + CELL / 2
        const pcy = py + CELL / 2
        const pImg = portalIndex === 0 ? this.markerPortal0 : this.markerPortal1
        const tone = portal.route === 'riskier' ? 'beacon' : 'portal'
        pImg.setTexture(markerTextureKey(tone))
        pImg.setPosition(Math.round(pcx), Math.round(pcy))
        pImg.setDisplaySize(CELL, CELL)
        pImg.setAlpha(0.95)
        pImg.setVisible(true)
        portalIndex += 1
      }
    }
    if (this.riftCell) {
      const rx = this.riftCell.x * CELL
      const ry = this.riftCell.y * CELL
      const cx = rx + CELL / 2
      const cy = ry + CELL / 2
      g.fillStyle(0x7a2fff, 0.24)
      g.fillCircle(cx, cy, CELL * 0.96)
      const riftDisp = Math.round(CELL * 0.84)
      this.markerRift.setTexture(markerTextureKey('rift'))
      this.markerRift.setPosition(Math.round(cx), Math.round(cy))
      this.markerRift.setDisplaySize(riftDisp, riftDisp)
      this.markerRift.setAlpha(0.9)
      this.markerRift.setVisible(true)
    }

    if (this.powerup) {
      const pulse = Math.sin(this.powerup.pulse) * 0.3 + 0.7
      const colorMap: Record<PowerupType, number> = {
        shield: COLORS.shield,
        slow: COLORS.slow,
        ghost: 0xaaaaff,
        score: COLORS.powerup,
        venom: COLORS.venom,
      }
      const color = colorMap[this.powerup.type]
      const px = this.powerup.x * CELL
      const py = this.powerup.y * CELL
      const cx = px + CELL / 2
      const cy = py + CELL / 2
      const s = CELL * 0.46 * pulse
      g.fillStyle(color, 0.95)
      const markerTone: 'shield' | 'slow' | 'ghost' | 'score' | 'venom' = this.powerup.type
      if (allowsMarkerGlow(markerTone)) {
        g.fillStyle(color, 0.2 * pulse)
        g.fillCircle(cx, cy, CELL * 0.82)
      }
      const powerupDisp = Math.max(1, Math.round(s * 2))
      this.markerPowerup.setTexture(markerTextureKey(markerTone))
      this.markerPowerup.setPosition(Math.round(cx), Math.round(cy))
      this.markerPowerup.setDisplaySize(powerupDisp, powerupDisp)
      this.markerPowerup.setAlpha(0.95)
      this.markerPowerup.setVisible(true)
    }
    if (this.biomeItem) {
      const pulse = Math.sin(this.biomeItem.pulse) * 0.3 + 0.7
      const ix = this.biomeItem.x * CELL
      const iy = this.biomeItem.y * CELL
      const isBeacon = this.biomeItem.type === 'portal_beacon'
      const isRiftBattery = this.biomeItem.type === 'rift_battery'
      const biomeTone = isBeacon ? 'beacon' : isRiftBattery ? 'battery' : 'biomeCore'
      if (allowsMarkerGlow(biomeTone)) {
        g.fillStyle(isBeacon ? COLORS.beacon : isRiftBattery ? 0x8866ff : 0x7ef2ff, 0.18 * pulse)
        g.fillCircle(ix + CELL / 2, iy + CELL / 2, CELL * 0.95)
      }
      g.fillStyle(isBeacon ? 0xfff7b8 : isRiftBattery ? 0xcf77ff : 0x2affff, 0.95)
      const s = CELL * 0.34 * pulse
      if (isBeacon) {
        g.fillCircle(ix + CELL / 2, iy + CELL / 2, s * 0.48)
      } else if (isRiftBattery) {
        g.fillTriangle(
          ix + CELL / 2,
          iy + CELL / 2 - s / 1.4,
          ix + CELL / 2 - s / 1.1,
          iy + CELL / 2 + s / 1.3,
          ix + CELL / 2 + s / 1.1,
          iy + CELL / 2 + s / 1.3,
        )
      } else {
        g.fillRect(ix + CELL / 2 - s / 2, iy + CELL / 2 - s / 2, s, s)
      }
      const biomeDisp = Math.round(CELL * 0.84)
      const bcx = ix + CELL / 2
      const bcy = iy + CELL / 2
      this.markerBiome.setTexture(markerTextureKey(biomeTone))
      this.markerBiome.setPosition(Math.round(bcx), Math.round(bcy))
      this.markerBiome.setDisplaySize(biomeDisp, biomeDisp)
      this.markerBiome.setAlpha(0.9)
      this.markerBiome.setVisible(true)
    }
    if (this.objectiveTerminals.length > 0) {
      for (const terminal of this.objectiveTerminals) {
        const tx = terminal.x * CELL
        const ty = terminal.y * CELL
        const cx = tx + CELL / 2
        const cy = ty + CELL / 2
        const pulse = Math.sin(terminal.pulse) * 0.18 + 0.75
        const glowColor = terminal.activated ? COLORS.snakeHead : COLORS.beacon
        g.fillStyle(glowColor, terminal.activated ? 0.18 : 0.14 * pulse)
        g.fillCircle(cx, cy, CELL * 0.78)
        g.fillStyle(terminal.activated ? 0x86ffd9 : 0xffef9e, 0.92)
        g.fillRect(tx + cellPx(5), ty + cellPx(5), CELL - cellPx(10), CELL - cellPx(10))
        g.fillStyle(terminal.activated ? 0x093225 : 0x4c2d00, 0.9)
        g.fillRect(tx + cellPx(8), ty + cellPx(8), CELL - cellPx(16), CELL - cellPx(16))
        g.lineStyle(cellPx(2), terminal.activated ? 0x86ffd9 : 0xffef9e, 0.9)
        g.beginPath()
        g.moveTo(cx, ty + cellPx(9))
        g.lineTo(cx, ty + CELL - cellPx(9))
        g.moveTo(tx + cellPx(9), cy)
        g.lineTo(tx + CELL - cellPx(9), cy)
        g.strokePath()
      }
    }
    if (this.referenceBoardMode && this.referenceMarkers.length > 0) {
      const markerSize = Math.round(CELL * 0.9)
      const parseHexColor = (hex: string): number => Number.parseInt(hex.replace('#', ''), 16)
      for (let i = 0; i < this.referenceMarkers.length; i += 1) {
        const marker = this.referenceMarkers[i]
        const img = this.referenceMarkerImages[i]
        if (!img) {
          continue
        }
        const cx = marker.x * CELL + CELL / 2
        const cy = marker.y * CELL + CELL / 2
        if (allowsMarkerGlow(marker.tone)) {
          const pulse = Math.sin(this.time.now * 0.006 + i * 0.55) * 0.25 + 0.75
          const glowColor = parseHexColor(PAINT_BY_TONE[marker.tone].glow)
          g.fillStyle(glowColor, 0.2 * pulse)
          g.fillCircle(cx, cy, CELL * 0.88)
        }
        img.setTexture(markerTextureKey(marker.tone))
        img.setPosition(Math.round(cx), Math.round(cy))
        img.setDisplaySize(markerSize, markerSize)
        img.setAlpha(0.98)
        img.setVisible(true)
      }
    }

    for (const enemy of this.enemies) {
      if (!enemy.alive) {
        continue
      }
      for (const [i, segment] of enemy.body.entries()) {
        const normalHead = COLORS.enemyHead
        const normalBody = COLORS.enemy
        const stalkerHead = 0xff33cc
        const stalkerBody = 0xcc2288
        const ambusherHead = 0xb86dff
        const ambusherBody = 0x7a3fb8
        const eggHead = 0xffe48b
        const eggBody = 0x9f7a33
        const mirrorHead = 0x8ae6ff
        const mirrorBody = 0x3b90c7
        const bossHead = 0xfff066
        const bossBody = 0xbd6a13
        const color =
          enemy.kind === 'boss'
            ? i === 0
              ? bossHead
              : bossBody
            : enemy.kind === 'egg'
              ? i === 0
                ? eggHead
                : eggBody
              : enemy.kind === 'mirror'
                ? i === 0
                  ? mirrorHead
                  : mirrorBody
                : enemy.kind === 'ambusher'
                  ? i === 0
                    ? ambusherHead
                    : ambusherBody
                  : enemy.kind === 'stalker'
                    ? i === 0
                      ? stalkerHead
                      : stalkerBody
                    : i === 0
                      ? normalHead
                      : normalBody
        const glow =
          enemy.kind === 'boss'
            ? bossHead
            : enemy.kind === 'egg'
              ? eggHead
              : enemy.kind === 'mirror'
                ? mirrorHead
                : enemy.kind === 'ambusher'
                  ? ambusherHead
                  : enemy.kind === 'stalker'
                    ? stalkerHead
                    : normalHead

        if (i === 0) {
          const cx = segment.x * CELL + CELL / 2
          const cy = segment.y * CELL + CELL / 2
          if (enemy.kind === 'ambusher' && enemy.telegraph?.kind === 'ambusher_dash') {
            const telegraphPulse = Math.sin(this.time.now * 0.012) * cellPx(2)
            g.lineStyle(cellPx(2), 0xfff0b3, 0.8)
            g.strokeCircle(cx, cy, CELL * 0.58 + telegraphPulse)
            g.lineStyle(cellPx(3), 0xffd37a, 0.5)
            g.beginPath()
            g.moveTo(cx, cy)
            g.lineTo(
              cx + enemy.telegraph.dir.x * CELL * 1.7,
              cy + enemy.telegraph.dir.y * CELL * 1.7,
            )
            g.strokePath()
          }
          if (enemy.telegraph?.kind === 'sniper_lock') {
            const pulse = Math.sin(this.time.now * 0.01) * cellPx(2)
            g.lineStyle(cellPx(2), 0x9be7ff, 0.85)
            g.strokeCircle(cx, cy, CELL * 0.52 + pulse)
            g.lineStyle(cellPx(2), 0x59b7ff, 0.55)
            g.beginPath()
            g.moveTo(cx, cy)
            g.lineTo(
              cx + enemy.telegraph.dir.x * CELL * 2.1,
              cy + enemy.telegraph.dir.y * CELL * 2.1,
            )
            g.strokePath()
          }
          if (enemy.role === 'leech') {
            g.lineStyle(cellPx(1), 0x9cf8ff, 0.45)
            g.strokeCircle(
              cx,
              cy,
              CELL * (0.4 + 0.06 * Math.sin(this.time.now * 0.012 + segment.x + segment.y)),
            )
          }
          if (
            enemy.kind === 'egg' &&
            enemy.hatchTurnsRemaining <= BALANCE.combatFairness.telegraph.eggHatchWarningTurns
          ) {
            g.fillStyle(0xfff4b0, 0.18 + Math.sin(this.time.now * 0.01) * 0.08)
            g.fillCircle(cx, cy, CELL * 0.62)
          }
          if (enemy.kind === 'egg') {
            g.fillStyle(eggHead, 0.2)
            g.fillCircle(cx, cy, CELL * 0.5)
            g.fillStyle(eggHead, 0.95)
            g.fillCircle(cx, cy, CELL * 0.38)
            g.lineStyle(2, 0xfff7d4, 0.7)
            g.strokeCircle(cx, cy, CELL * 0.38)
            g.lineStyle(1, 0x6e5120, 0.8)
            g.beginPath()
            g.moveTo(cx - cellPx(3), cy - cellPx(1))
            g.lineTo(cx - cellPx(1), cy + cellPx(1))
            g.lineTo(cx + cellPx(1), cy - cellPx(1))
            g.lineTo(cx + cellPx(3), cy + cellPx(1))
            g.strokePath()
          } else {
            drawPremiumSegmentPhaser(
              g,
              segment.x * CELL + cellPx(1),
              segment.y * CELL + cellPx(1),
              CELL - cellPx(2),
              CELL - cellPx(2),
              color,
              glow,
              1,
              true,
              globalJitter * 1.5,
            )
            g.fillStyle(0x000000, 0.8)
            g.fillCircle(segment.x * CELL + cellPx(5), segment.y * CELL + cellPx(5), cellPx(2))
            g.fillCircle(
              segment.x * CELL + CELL - cellPx(5),
              segment.y * CELL + cellPx(5),
              cellPx(2),
            )
          }

          if (enemy.kind === 'boss') {
            if (this.bossPhase === 'rage') {
              g.fillStyle(0xff3355, 0.3 * (Math.sin(this.time.now * 0.01) * 0.5 + 0.5))
              g.fillCircle(segment.x * CELL + CELL / 2, segment.y * CELL + CELL / 2, CELL * 0.95)
            }
            for (let hp = 0; hp < enemy.health; hp += 1) {
              g.fillStyle(0xffcc55, 0.9)
              g.fillRect(
                segment.x * CELL + cellPx(3) + hp * cellPx(5),
                segment.y * CELL - cellPx(3),
                cellPx(4),
                cellPx(2),
              )
            }
          }
        } else {
          const alpha = 0.7
          const pad = Math.min(cellPx(5), Math.max(cellPx(1), i * cellPx(0.2)))
          drawPremiumSegmentPhaser(
            g,
            segment.x * CELL + pad,
            segment.y * CELL + pad,
            CELL - pad * 2,
            CELL - pad * 2,
            color,
            glow,
            alpha,
            false,
            globalJitter,
          )
        }
      }
    }

    for (const [i, segment] of this.snake.entries()) {
      if (i === 0) {
        drawPremiumSegmentPhaser(
          g,
          segment.x * CELL + cellPx(1),
          segment.y * CELL + cellPx(1),
          CELL - cellPx(2),
          CELL - cellPx(2),
          COLORS.snakeHead,
          0x00ffcc,
          1,
          true,
          globalJitter * 1.5,
        )

        const eyeOffsetX =
          this.currentDir.x === 1 ? cellPx(5) : this.currentDir.x === -1 ? -cellPx(5) : 0
        const eyeOffsetY =
          this.currentDir.y === 1 ? cellPx(5) : this.currentDir.y === -1 ? -cellPx(5) : 0
        const eyeBaseX = segment.x * CELL + CELL / 2 + eyeOffsetX * 0.35
        const eyeBaseY = segment.y * CELL + CELL / 2 + eyeOffsetY * 0.35
        g.fillStyle(0x03130e, 0.9)
        g.fillCircle(eyeBaseX - cellPx(3), eyeBaseY - cellPx(2), cellPx(1.6))
        g.fillCircle(eyeBaseX + cellPx(3), eyeBaseY - cellPx(2), cellPx(1.6))

        if (this.shields > 0) {
          const t = this.time.now * 0.006
          const pulse = Math.sin(t) * cellPx(2)
          const radBase = CELL * 0.65
          g.lineStyle(cellPx(5), COLORS.shield, 0.6 + Math.sin(t * 1.5) * 0.2)
          g.strokeCircle(segment.x * CELL + CELL / 2, segment.y * CELL + CELL / 2, radBase + pulse)

          g.lineStyle(cellPx(2), 0xffffff, 0.45)
          g.strokeCircle(
            segment.x * CELL + CELL / 2,
            segment.y * CELL + CELL / 2,
            radBase + pulse - cellPx(2.5),
          )
        }
        if (this.hasContactGrace()) {
          const pulse = Math.sin(this.time.now * 0.012) * cellPx(1.5)
          g.lineStyle(cellPx(2), 0xffffff, 0.6)
          g.strokeCircle(
            segment.x * CELL + CELL / 2,
            segment.y * CELL + CELL / 2,
            CELL * 0.52 + pulse,
          )
        }
        continue
      }
      const alpha = Math.max(0.3, 1 - i * 0.025)
      const pad = Math.min(cellPx(4), cellPx(1) + i * cellPx(0.12))
      drawPremiumSegmentPhaser(
        g,
        segment.x * CELL + pad,
        segment.y * CELL + pad,
        CELL - pad * 2,
        CELL - pad * 2,
        COLORS.snake,
        0x00ff88,
        alpha,
        false,
        globalJitter,
      )
    }

    for (const p of this.particles) {
      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
      const len = Math.min(cellPx(6), spd * 0.4)
      g.lineStyle(p.size * p.life, p.color, p.life * 0.8)
      g.beginPath()
      g.moveTo(p.x, p.y)
      g.lineTo(p.x - p.vx * len * 0.1, p.y - p.vy * len * 0.1)
      g.strokePath()
    }
    for (const projectile of this.venomProjectiles) {
      const px = projectile.x * CELL + CELL / 2
      const py = projectile.y * CELL + CELL / 2
      g.fillStyle(COLORS.venom, 0.9)
      g.fillCircle(px, py, cellPx(4))
      g.lineStyle(1, 0xd8ffe4, 0.8)
      g.strokeCircle(px, py, cellPx(5))
    }

    if (this.squeezeInset > 0) {
      const insetPx = this.squeezeInset * CELL
      const safeWidth = WIDTH - insetPx * 2
      const safeHeight = HEIGHT - insetPx * 2
      g.fillStyle(COLORS.squeeze, 0.13)
      g.fillRect(0, 0, WIDTH, insetPx)
      g.fillRect(0, HEIGHT - insetPx, WIDTH, insetPx)
      g.fillRect(0, insetPx, insetPx, safeHeight)
      g.fillRect(WIDTH - insetPx, insetPx, insetPx, safeHeight)
      g.lineStyle(2, COLORS.squeeze, 0.72)
      g.strokeRect(insetPx, insetPx, safeWidth, safeHeight)
    }

    if (this.darknessActive) {
      const head = this.snake[0]
      if (head) {
        this.drawDarknessOverlay(g, head)
      }
    }

    for (const pulse of this.feedbackPulses) {
      const progress = Math.min(1, pulse.elapsed / pulse.duration)
      const radius = cellPx(6) + (pulse.maxRadius - cellPx(6)) * progress
      const alpha = (1 - progress) * (isReducedEffectsEnabled() ? 0.22 : 0.36)
      const lineWidth = Math.max(1, cellPx(2.4) * (1 - progress * 0.45))
      g.lineStyle(lineWidth, pulse.color, alpha)
      g.strokeCircle(pulse.x, pulse.y, radius)
      g.lineStyle(Math.max(1, lineWidth * 0.45), 0xffffff, alpha * 0.45)
      g.strokeCircle(pulse.x, pulse.y, radius * 0.72)
    }

    for (let i = 0; i < this.shields; i += 1) {
      g.fillStyle(COLORS.shield, 0.8)
      g.fillCircle(cellPx(12) + i * cellPx(17), HEIGHT - cellPx(12), cellPx(6))
      g.lineStyle(1, 0xffffff, 0.4)
      g.strokeCircle(cellPx(12) + i * cellPx(17), HEIGHT - cellPx(12), cellPx(6))
    }
    for (let i = 0; i < this.ghostCharges; i += 1) {
      g.fillStyle(0xaaaaff, 0.6)
      g.fillCircle(cellPx(12) + i * cellPx(17), HEIGHT - cellPx(28), cellPx(4))
    }
    for (let i = 0; i < this.venomCharges; i += 1) {
      g.fillStyle(COLORS.venom, 0.85)
      g.fillCircle(cellPx(12) + i * cellPx(17), HEIGHT - cellPx(44), cellPx(4))
    }
  }
}
