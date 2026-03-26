import Phaser from 'phaser'
import rewardStyles from '../../styles/rewardOverlay.module.css'
import { pickEliteKind, pickPowerupType, pickSpecialEnemyKind } from '../config/content'
import { BALANCE, createBaseRunConfig, getFloorSetup } from '../core/balance'
import { BASE_COLS, BASE_ROWS, CELL, COLORS, HEIGHT, WIDTH, cellPx } from '../core/constants'
import { getDevScenario, isDevMode } from '../core/devScenarios'
import type { DevScenarioId } from '../core/devScenarios'
import type { GlossaryMarkerTone } from '../core/glossary'
import { applyRelicEffect, applyTalentEffects } from '../core/meta'
import { getFloorObjective, getRoomObjective } from '../core/objectives'
import {
  applyRewardEffectsToConfig,
  formatRewardTranslationKey,
  getRewardPool,
} from '../core/rewards'
import { gameState, playerProfile } from '../core/state'
import type {
  BiomeItem,
  Enemy,
  EnemyKind,
  FloorObjectiveKind,
  FloorRouteChoice,
  FloorTemplate,
  Food,
  Particle,
  Powerup,
  PowerupType,
  RewardOption,
  RoomObjectiveState,
  RunConfig,
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
  type EnemyCollisionMatch,
  type EnemyCollisionPart,
  applyStalkerExtraStep,
  detectEnemyCollision,
  resolveEnemyCollisionDamage,
  tickEnemy,
} from '../simulation/enemy'
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
  draftRewardOptions,
  initCorePressureState,
  initPortalFlowState,
  initRoomObjectiveState,
  markRoomObjectiveRewardClaimed,
  resetCorePressureTimer,
  shouldCompleteObjective,
  tickCorePressure,
  tickPortalFlow,
} from '../simulation/objectives'
import {
  type RunReplayCapture,
  appendReplayInput,
  createRunReplayCapture,
} from '../simulation/replay'
import { type GameRng, createSeededRng, deriveRunSeed } from '../simulation/rng'
import { pickOpenCell } from '../simulation/spawn'
import { isReducedEffectsEnabled } from '../systems/accessibility'
import { getControlMode } from '../systems/controlScheme'
import {
  getMoveHintText,
  getRestartHintText,
  getRewardHintText,
  pulseHudNode,
  setHintText,
  setObjectiveStatusText,
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
type BossPhase = 'alpha' | 'rage'
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
  private pendingGrowth = 0
  private venomCharges = 0
  private venomCooldownMs = 0
  private venomProjectiles: VenomProjectile[] = []
  private objectiveType: FloorObjectiveKind = 'portal'
  private objectiveScoreStart = 0
  private objectiveScoreTarget = 0
  private objectiveKillsStart = 0
  private objectiveKillsTarget = 0
  private roomObjective: RoomObjectiveState | null = null
  private objectiveTerminals: ObjectiveTerminal[] = []
  private rewardChoices: RewardOption[] = []
  private rewardPending = false
  private rewardOverlayRoot: HTMLDivElement | null = null
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
  private bossPhase: BossPhase = 'alpha'
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
    this.runStartMs = this.time.now
    this.isDying = false
    this.runSeed =
      data.runSeed ??
      gameState.currentRunSeed ??
      deriveRunSeed([Date.now(), gameState.run, gameState.floor, this.score])
    gameState.currentRunSeed = this.runSeed
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
    this.wallCount = floorSetup.wallCount
    this.enemyCount = floorSetup.enemyCount
    this.enemyInterval = floorSetup.enemyIntervalMs
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
    this.applyPendingFloorRoute()
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
    this.bossPhase = 'alpha'
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
    this.roomObjective = initRoomObjectiveState(
      getRoomObjective(gameState.floor, gameState.runObjectiveOffset),
    )

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
    } else {
      for (let i = 0; i < this.enemyCount; i += 1) {
        this.spawnEnemy()
      }
      if (debugScenario?.forceEggMirror) {
        this.spawnEnemy('egg')
        this.spawnEnemy('mirror')
      }
    }
    this.setupRoomObjectiveActors()

    this.spawnFood()
    if (debugScenario?.placeFoodNearHead) {
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
    if (!this.isBossFloor && this.rng.nextFloat() < BALANCE.spawn.powerupAtFloorStartChance) {
      this.spawnPowerup()
    }
    if (this.isBossFloor) {
      this.powerup = null
      this.spawnPowerup('venom')
      this.bossSupportShieldRespawnMs = BALANCE.biome.boss.supportShieldRespawnMs
    }
    if (this.objectiveType === 'kills' && !this.isBossFloor) {
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
    })

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (this.rewardPending) {
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
      setObjectiveStatusText('')
      setRunStatusText('')
    })

    this.drawBackground()
    this.drawWalls()
    this.redrawTerrainGraphics()
    updateHud(this.score)
    this.refreshObjectiveHud()
    setHintText(`${getMoveHintText()} · ${t('hint.itemLegend')}`)

    if (debugScenario?.referenceBoard) {
      this.setupReferenceBoardScenario()
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
      this.tryFireVenom()
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
    this.refreshObjectiveHud()
    if (this.rewardPending) {
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
    const localizedBiome = t(`biome.${BALANCE.biome.id.replaceAll('-', '_')}`, {
      defaultValue: BALANCE.biome.name,
    })
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
    this.objectiveType = 'portal'
    this.objectiveScoreStart = 0
    this.objectiveScoreTarget = 0
    this.objectiveKillsStart = 0
    this.objectiveKillsTarget = 0
    this.roomObjective = null
    this.objectiveTerminals = []
    this.rewardChoices = []
    this.rewardPending = false
    this.teardownRewardOverlay()
    this.portals = []
    this.portalCountdownMs = 0
    this.portalGraceMs = 0
    this.portalGraceSecondCue = -1
    this.squeezeStepTimerMs = 0
    this.squeezeInset = 0
    this.playerHeadHistory = []
    this.roomCells = new Set<string>()
    this.corridorCells = new Set<string>()
    this.enemyMoveTimer = 0
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
        })
        this.enemies[i] = result.enemy
        if (result.ateFood) {
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
        body: [{ x: 1, y: 13 }],
        dir: { x: 1, y: 0 },
        alive: true,
        kind: 'normal',
        health: 1,
        dashCooldown: 0,
        hatchTurnsRemaining: 0,
        mirrorDelaySteps: 0,
        telegraph: null,
      },
      {
        body: [{ x: 3, y: 13 }],
        dir: { x: 1, y: 0 },
        alive: true,
        kind: 'stalker',
        health: 1,
        dashCooldown: 0,
        hatchTurnsRemaining: 0,
        mirrorDelaySteps: 0,
        telegraph: null,
      },
      {
        body: [{ x: 5, y: 13 }],
        dir: { x: 1, y: 0 },
        alive: true,
        kind: 'ambusher',
        health: 1,
        dashCooldown: 0,
        hatchTurnsRemaining: 0,
        mirrorDelaySteps: 0,
        telegraph: null,
      },
      {
        body: [{ x: 15, y: 13 }],
        dir: { x: 1, y: 0 },
        alive: true,
        kind: 'egg',
        health: 1,
        dashCooldown: 0,
        hatchTurnsRemaining: 0,
        mirrorDelaySteps: 0,
        telegraph: null,
      },
      {
        body: [{ x: 17, y: 13 }],
        dir: { x: 1, y: 0 },
        alive: true,
        kind: 'mirror',
        health: 1,
        dashCooldown: 0,
        hatchTurnsRemaining: 0,
        mirrorDelaySteps: 0,
        telegraph: null,
      },
      {
        body: [
          { x: 9, y: 1 },
          { x: 9, y: 2 },
          { x: 9, y: 3 },
          { x: 9, y: 4 },
        ],
        dir: { x: 0, y: 1 },
        alive: true,
        kind: 'boss',
        health: 3,
        dashCooldown: 0,
        hatchTurnsRemaining: 0,
        mirrorDelaySteps: 0,
        telegraph: null,
      },
    ]
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

  private getObjectiveScoreProgress(): number {
    return Math.max(0, this.score - this.objectiveScoreStart)
  }

  private getObjectiveKillsProgress(): number {
    return Math.max(0, gameState.kills - this.objectiveKillsStart)
  }

  private getPressureStatusText(): string {
    if (this.portalCountdownMs > 0) {
      return t('game.pressureIn', { seconds: Math.ceil(this.portalCountdownMs / 1000) })
    }
    if (this.portalGraceMs > 0) {
      return t('game.squeezeIn', { seconds: Math.ceil(this.portalGraceMs / 1000) })
    }
    return t('game.squeezeActive')
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
    if (this.isBossFloor || this.objectiveType === 'boss') {
      const phaseLabel =
        this.bossPhase === 'rage' ? t('game.bossPhaseRage') : t('game.bossPhaseAlpha')
      return t('game.bossAdvanceWithPhase', { phase: phaseLabel })
    }
    if (this.objectiveType === 'portal') {
      if (this.portals.length === 0) {
        return t('game.portalIn', { seconds: Math.ceil(this.portalCountdownMs / 1000) })
      }
      if (this.portalGraceMs > 0) {
        return `${t('game.portalChoose')} · ${t('game.squeezeIn', { seconds: Math.ceil(this.portalGraceMs / 1000) })}`
      }
      return `${t('game.portalChoose')} · ${t('game.squeezeActive')}`
    }
    if (this.objectiveType === 'score') {
      return t('game.objectiveScoreStatus', {
        progress: this.getObjectiveScoreProgress(),
        target: this.objectiveScoreTarget,
        pressure: this.getPressureStatusText(),
      })
    }
    if (this.objectiveType === 'kills') {
      return t('game.objectiveKillsStatusWithVenom', {
        progress: this.getObjectiveKillsProgress(),
        target: this.objectiveKillsTarget,
        pressure: this.getPressureStatusText(),
        venomStatus: this.getVenomStatusText(),
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
    setObjectiveStatusText(this.getRoomObjectiveStatusText())
  }

  private setupRoomObjectiveActors(): void {
    if (!this.roomObjective || this.isBossFloor) {
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
    if (!this.roomObjective || this.rewardPending || this.isDying || this.isBossFloor) {
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
      | { type: 'terminal_activated'; amount?: number },
  ): void {
    if (!this.roomObjective || this.rewardPending || this.isBossFloor) {
      return
    }
    const next = advanceRoomObjectiveState(this.roomObjective, event)
    this.roomObjective = next.state
    if (next.completedNow) {
      this.triggerRewardDraft()
    }
  }

  private ensureRoomObjectiveAvailability(): void {
    if (!this.roomObjective || this.roomObjective.completed || this.isBossFloor) {
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
    this.rewardChoices = draftRewardOptions(getRewardPool(), BALANCE.rewards.draftSize, this.rng)
    this.rewardPending = true
    this.triggerObjectiveFeedback(false)
    this.mountRewardOverlay()
    setHintText(getRewardHintText())
  }

  private pickRewardChoice(index: number): void {
    if (!this.rewardPending) {
      return
    }
    const reward = this.rewardChoices[index]
    if (!reward) {
      return
    }
    this.applyRewardChoice(reward)
    this.rewardPending = false
    this.rewardChoices = []
    if (this.roomObjective) {
      this.roomObjective = markRoomObjectiveRewardClaimed(this.roomObjective)
    }
    this.teardownRewardOverlay()
    this.refreshObjectiveHud()
    setHintText(`${getMoveHintText()} · ${t('hint.itemLegend')}`)
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
    upside.className = rewardStyles.upside
    upside.textContent = t(formatRewardTranslationKey(reward.id, 'upside'))
    content.append(upside)

    const downside = document.createElement('span')
    downside.className = rewardStyles.downside
    downside.textContent = t(formatRewardTranslationKey(reward.id, 'downside'))
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
      this.enemyCount = Math.max(1, this.enemyCount + BALANCE.portal.routeChoice.safer.enemyDelta)
      this.wallCount = Math.max(1, this.wallCount + BALANCE.portal.routeChoice.safer.wallDelta)
      this.enemyInterval *= BALANCE.portal.routeChoice.safer.enemyIntervalMultiplier
      return
    }
    this.enemyCount = Math.max(1, this.enemyCount + BALANCE.portal.routeChoice.riskier.enemyDelta)
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
      isBossFloor: this.isBossFloor,
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
      enabled: BALANCE.biome.pressure.enabled,
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
    if (!this.corePressureActive || this.isDying) {
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
    if (this.portals.length > 0 || this.isBossFloor || this.objectiveType !== 'portal') {
      return
    }
    const saferCell = this.pickOpenCell()
    this.portals = [{ ...saferCell, pulse: 0, route: 'safer' }]
    const riskierCell = this.pickOpenCell()
    this.portals.push({ ...riskierCell, pulse: 0, route: 'riskier' })
    emitFeedback('portal')
    this.portalGraceSecondCue = Math.ceil(this.portalGraceMs / 1000) + 1
    setHintText(t('game.portalChooseHint'))
  }

  private updatePortalFlow(delta: number): void {
    if (this.isBossFloor || this.isDying) {
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

  private getItemSpawnConfig(): (typeof BALANCE.item.spawnByFloor)[number] {
    const floor = gameState.floor
    const sorted = [...BALANCE.item.spawnByFloor].sort((a, b) => b.minFloor - a.minFloor)
    return sorted.find((config) => floor >= config.minFloor) ?? BALANCE.item.spawnByFloor[0]
  }

  private resolveEliteKind(): EnemyKind | null {
    return pickEliteKind({ floor: gameState.floor, rng: this.rng })
  }

  private resolveSpecialEnemyKind(): EnemyKind | null {
    return pickSpecialEnemyKind({ floor: gameState.floor, rng: this.rng })
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
    const resolvedKind =
      kind === 'normal'
        ? (this.resolveSpecialEnemyKind() ?? this.resolveEliteKind() ?? 'normal')
        : kind
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
    const seedCell = this.pickOpenCell({
      preferredZone: this.floorTemplate === 'rooms_v1' ? 'corridor' : null,
      minDistanceFromCenter: 6,
      fairness: {
        playerHead: this.snake[0] ?? null,
        playerDir: this.currentDir,
        minManhattanDistance: BALANCE.combatFairness.spawn.enemyMinDistanceFromPlayer,
        avoidForwardLaneSteps: BALANCE.combatFairness.spawn.avoidPlayerForwardLaneSteps,
        minOpenNeighborCount: BALANCE.combatFairness.spawn.minOpenNeighborCount,
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
      body,
      dir: { x: 1, y: 0 },
      alive: true,
      kind: resolvedKind,
      health: resolvedKind === 'boss' ? BALANCE.biome.boss.health : 1,
      dashCooldown: 0,
      hatchTurnsRemaining: resolvedKind === 'egg' ? BALANCE.enemyVariants.egg.hatchTurns : 0,
      mirrorDelaySteps: resolvedKind === 'mirror' ? BALANCE.enemyVariants.mirror.delaySteps : 0,
      telegraph: null,
    })
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
    let removed = 0
    while (removed < damage && this.snake.length > 1) {
      this.snake.pop()
      removed += 1
    }
    if (removed < damage) {
      this.die('enemy')
      return false
    }
    const head = this.snake[0]
    if (head) {
      this.triggerDamageFeedback(head.x, head.y, COLORS.enemyHead)
    }
    setHintText(t('game.tailDamaged', { lost: removed }))
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
      this.advanceRoomObjective({ type: 'elite_defeated' })
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
        gameState.pendingFloorRoute = selectedPortal.route
        trackRetentionEvent('portal_route_selected', {
          route: selectedPortal.route,
          floor: gameState.floor,
          score: this.score,
        })
        if (selectedPortal.route === 'riskier') {
          this.score += Math.floor(
            BALANCE.portal.routeChoice.riskier.scoreBonus * this.cfg.scoreMult,
          )
          updateHud(this.score)
        }
      }
      emitFeedback('confirm')
      transitionToScene(this, 'Upgrade', {
        chrome: 'run',
        data: { score: this.score, floor: gameState.floor },
      })
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
        this.startContactGrace(BALANCE.combatFairness.grace.postHitMs)
        if (collidedEnemy.kind === 'boss' && collidedEnemy.alive) {
          this.applyBossKnockback(head)
        }
        this.enemies = this.enemies.filter((enemy) => enemy.alive)
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
        this.startContactGrace(BALANCE.combatFairness.grace.postHitMs)
        if (collidedEnemy.kind === 'boss' && collidedEnemy.alive) {
          this.applyBossKnockback(head)
        }
        this.enemies = this.enemies.filter((enemy) => enemy.alive)
      }
    } else {
      this.enemies = this.enemies.filter((enemy) => enemy.alive)
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
      transitionToScene(this, 'Upgrade', {
        chrome: 'run',
        data: { score: this.score, floor: gameState.floor },
      })
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
    })
    trackRetentionEvent('time_alive', {
      timeAliveMs,
      floor: gameState.floor,
      score: this.score,
      kills: gameState.kills,
      inputMode: getControlMode(),
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
