import Phaser from 'phaser'
import { BALANCE, createBaseRunConfig, getFloorSetup } from '../core/balance'
import { BASE_COLS, BASE_ROWS, CELL, COLORS, HEIGHT, WIDTH, cellPx } from '../core/constants'
import { getDevScenario } from '../core/devScenarios'
import type { DevScenarioId } from '../core/devScenarios'
import type { GlossaryMarkerTone } from '../core/glossary'
import { applyRelicEffect, applyTalentEffects } from '../core/meta'
import { getFloorObjective } from '../core/objectives'
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
  RunConfig,
  SnakeSegment,
  Vec2,
  WorldItemType,
} from '../core/types'
import { markerTextureKey, registerMarkerHiResTextures } from '../render/markerHiRes'
import { isReducedEffectsEnabled } from '../systems/accessibility'
import { getControlMode } from '../systems/controlScheme'
import {
  getMoveHintText,
  getRestartHintText,
  setHintText,
  setRunStatusText,
  setSceneChrome,
  updateHud,
} from '../systems/domHud'
import { emitFeedback } from '../systems/feedback'
import { t } from '../systems/i18n'
import { resetVirtualInput } from '../systems/input'
import { transitionToScene } from '../systems/sceneFlow'
import { trackRetentionEvent } from '../systems/telemetry'

type GameSceneData = {
  score?: number
  devScenarioId?: DevScenarioId
}

type DeathReason = 'wall' | 'self' | 'enemy' | 'rift'
type PortalCell = Vec2 & { pulse: number; route: FloorRouteChoice }
type RoomRect = { x: number; y: number; w: number; h: number; cx: number; cy: number }
type RoomTemplateLayout = {
  walls: Set<string>
  roomCells: Set<string>
  corridorCells: Set<string>
}
type BossPhase = 'alpha' | 'rage'
type EnemyCollisionPart = 'head' | 'body'
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
  private score = 0
  private paused = false
  private moveQueue: Vec2[] = []
  private currentDir: Vec2 = { x: 1, y: 0 }
  private moveTimer = 0
  private particles: Particle[] = []
  private shakeTimer = 0
  private flashTimer = 0
  private flashColor = 0xffffff

  private cfg: RunConfig = createBaseRunConfig()

  private shields = 0
  private ghostCharges = 0
  private regenTimer = 0
  private wallCount = 0
  private floorTemplate: FloorTemplate = 'classic'
  private floorTemplateFallbackUsed = false
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
    const debugScenario = data.devScenarioId ? getDevScenario(data.devScenarioId) : null
    if (debugScenario) {
      gameState.floor = debugScenario.floor
    }
    this.score = debugScenario?.score ?? data.score ?? 0
    this.resetLocalState()
    this.runStartMs = this.time.now
    this.isDying = false
    setSceneChrome('run')

    applyTalentEffects(this.cfg, playerProfile)
    applyRelicEffect(this.cfg, gameState.selectedRelicId)
    for (const upgrade of gameState.persistentUpgrades) {
      upgrade.apply(this.cfg)
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

    this.bgGraphics = this.add.graphics()
    this.wallGraphics = this.add.graphics()
    this.terrainGraphics = this.add.graphics()
    this.gameGraphics = this.add.graphics()
    this.fxGraphics = this.add.graphics()

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
    if (!this.isBossFloor && Math.random() < BALANCE.spawn.powerupAtFloorStartChance) {
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
    this.stars = Array.from({ length: BALANCE.biome.starCount }, () => ({
      x: Math.floor(Math.random() * WIDTH),
      y: Math.floor(Math.random() * HEIGHT),
      size: Math.max(1, Math.floor(Math.random() * 2) + 1),
      alpha: 0.15 + Math.random() * 0.4,
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
      const dir = directionMap[event.code]
      if (dir) {
        this.pushDirection(dir)
      }
      if (event.code === 'KeyE') {
        window.virtualInput.ability = true
      }
      if (event.code === 'Space') {
        this.togglePause()
      }
    })
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.removeAllListeners()
      if (this.pauseText) {
        this.pauseText.destroy()
        this.pauseText = undefined
      }
      setRunStatusText('')
    })

    this.drawBackground()
    this.drawWalls()
    this.redrawTerrainGraphics()
    updateHud(this.score)
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
      const turnDirection = this.resolveRelativeTurn(window.virtualInput.turn)
      if (turnDirection) {
        this.pushDirection(turnDirection)
      }
      window.virtualInput.turn = null
    }
    if (window.virtualInput.ability) {
      this.tryFireVenom()
      window.virtualInput.ability = false
    }

    if (this.paused) {
      return
    }

    if (this.referenceBoardMode) {
      this.updateReferenceBoardHover()
      const status = this.referenceHoverLabel
        ? `DEV REFERENCE · ${this.referenceHoverLabel}`
        : 'DEV REFERENCE · Hover any marker/cell'
      setRunStatusText(status)
      this.drawFrame()
      return
    }

    const dt = delta / 1000
    this.updateCameraShake(dt)
    this.updateEnemyMovement(delta)
    this.ensureObjectiveEnemyAvailability()
    this.updateVoidRift(delta)
    this.updatePortalFlow(delta)
    this.updateCorePressure(delta)
    this.updateBossSupport(delta)
    this.updateVenomState(delta)
    this.updateRegen(delta)
    this.updateSnakeMovement(delta)
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
    setRunStatusText(hudStatus)

    this.drawFrame()
  }

  private resetLocalState(): void {
    this.paused = false
    this.moveQueue = []
    this.currentDir = { x: 1, y: 0 }
    this.moveTimer = 0
    this.particles = []
    this.shakeTimer = 0
    this.flashTimer = 0
    this.flashColor = 0xffffff
    this.cfg = createBaseRunConfig()
    this.shields = 0
    this.ghostCharges = 0
    this.regenTimer = 0
    this.floorTemplate = 'classic'
    this.floorTemplateFallbackUsed = false
    this.pendingGrowth = 0
    this.venomCharges = 0
    this.venomCooldownMs = 0
    this.venomProjectiles = []
    this.objectiveType = 'portal'
    this.objectiveScoreStart = 0
    this.objectiveScoreTarget = 0
    this.objectiveKillsStart = 0
    this.objectiveKillsTarget = 0
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
    if (this.moveQueue.length < 2) {
      this.moveQueue.push(next)
    }
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
      (Math.random() - 0.5) * this.shakeTimer * 5,
      (Math.random() - 0.5) * this.shakeTimer * 5,
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
    for (const enemy of this.enemies) {
      if (enemy.alive) {
        this.moveEnemy(enemy)
        if (enemy.kind === 'stalker' && Math.random() < 1 - BALANCE.elite.stalker.speedMultiplier) {
          this.moveEnemy(enemy)
        }
      }
    }
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
      this.flashColor = COLORS.shield
      this.flashTimer = 0.15
      this.shakeTimer = 0.2
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
      this.regenTimer > BALANCE.regen.intervalMs &&
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
      this.spawnPowerup(Math.random() < 0.65 ? 'shield' : 'venom')
    } else {
      this.spawnPowerup(Math.random() < 0.85 ? 'venom' : 'shield')
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
    if (Math.abs(dx) + Math.abs(dy) > 4) {
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
    const walls = new Set<string>()
    const cx = Math.floor(BASE_COLS / 2)
    const cy = Math.floor(BASE_ROWS / 2)
    const attempts = this.wallCount * 8
    for (let a = 0; a < attempts && walls.size < this.wallCount * 3; a += 1) {
      const x = 2 + Math.floor(Math.random() * (BASE_COLS - 4))
      const y = 2 + Math.floor(Math.random() * (BASE_ROWS - 4))
      const len = 2 + Math.floor(Math.random() * 3)
      const horizontal = Math.random() < 0.5
      let valid = true
      for (let i = 0; i < len; i += 1) {
        const wx = horizontal ? x + i : x
        const wy = horizontal ? y : y + i
        if (Math.abs(wx - cx) < 4 && Math.abs(wy - cy) < 4) {
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
        if (wx > 0 && wx < BASE_COLS - 1 && wy > 0 && wy < BASE_ROWS - 1) {
          walls.add(`${wx},${wy}`)
        }
      }
    }
    return walls
  }

  private generateRoomTemplateLayout(): RoomTemplateLayout | null {
    const cfg = BALANCE.floorTemplate.roomsV1
    const roomTarget = cfg.minRooms + Math.floor(Math.random() * (cfg.maxRooms - cfg.minRooms + 1))
    const roomAttempts = roomTarget * 40
    const rooms: RoomRect[] = []
    for (let attempt = 0; attempt < roomAttempts && rooms.length < roomTarget; attempt += 1) {
      const w =
        cfg.minRoomSize + Math.floor(Math.random() * (cfg.maxRoomSize - cfg.minRoomSize + 1))
      const h =
        cfg.minRoomSize + Math.floor(Math.random() * (cfg.maxRoomSize - cfg.minRoomSize + 1))
      const maxX = BASE_COLS - 1 - w
      const maxY = BASE_ROWS - 1 - h
      if (maxX <= 1 || maxY <= 1) {
        continue
      }
      const x = 1 + Math.floor(Math.random() * (maxX - 1 + 1))
      const y = 1 + Math.floor(Math.random() * (maxY - 1 + 1))
      const gap = cfg.minRoomGap
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
      if (x < 1 || x >= BASE_COLS - 1 || y < 1 || y >= BASE_ROWS - 1) {
        return
      }
      const key = `${x},${y}`
      walkable.add(key)
      if (zone === 'room') {
        roomCells.add(key)
      } else {
        corridorCells.add(key)
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
      carveCorridor(rooms[i] as RoomRect, rooms[i + 1] as RoomRect)
    }
    if (rooms.length >= 3) {
      const a = rooms[0] as RoomRect
      const b = rooms[rooms.length - 1] as RoomRect
      carveCorridor(a, b)
    }

    const centerX = Math.floor(BASE_COLS / 2)
    const centerY = Math.floor(BASE_ROWS / 2)
    for (let y = centerY - 1; y <= centerY + 1; y += 1) {
      for (let x = centerX - 1; x <= centerX + 1; x += 1) {
        carve(x, y, 'corridor')
      }
    }

    const firstKey = walkable.values().next().value
    if (!firstKey) {
      return null
    }
    const [sxRaw, syRaw] = firstKey.split(',')
    const sx = Number(sxRaw)
    const sy = Number(syRaw)
    const visited = new Set<string>()
    const queue: Vec2[] = [{ x: sx, y: sy }]
    visited.add(firstKey)
    while (queue.length > 0) {
      const next = queue.shift()
      if (!next) {
        continue
      }
      const neighbors: Vec2[] = [
        { x: next.x + 1, y: next.y },
        { x: next.x - 1, y: next.y },
        { x: next.x, y: next.y + 1 },
        { x: next.x, y: next.y - 1 },
      ]
      for (const neighbor of neighbors) {
        const key = `${neighbor.x},${neighbor.y}`
        if (!walkable.has(key) || visited.has(key)) {
          continue
        }
        visited.add(key)
        queue.push(neighbor)
      }
    }
    if (visited.size !== walkable.size) {
      return null
    }

    const walls = new Set<string>()
    for (let y = 1; y < BASE_ROWS - 1; y += 1) {
      for (let x = 1; x < BASE_COLS - 1; x += 1) {
        const key = `${x},${y}`
        if (!walkable.has(key)) {
          walls.add(key)
        }
      }
    }
    return { walls, roomCells, corridorCells }
  }

  private generateIceTiles(): Set<string> {
    const iceTiles = new Set<string>()
    if (!this.iceActive || this.iceTileCount <= 0) {
      return iceTiles
    }

    const cx = Math.floor(BASE_COLS / 2)
    const cy = Math.floor(BASE_ROWS / 2)
    const attempts = this.iceTileCount * 20
    for (let i = 0; i < attempts && iceTiles.size < this.iceTileCount; i += 1) {
      const x = 1 + Math.floor(Math.random() * (BASE_COLS - 2))
      const y = 1 + Math.floor(Math.random() * (BASE_ROWS - 2))
      if (this.walls.has(`${x},${y}`)) {
        continue
      }
      if (Math.abs(x - cx) < 3 && Math.abs(y - cy) < 3) {
        continue
      }
      iceTiles.add(`${x},${y}`)
    }
    return iceTiles
  }

  private generateSandTiles(): Set<string> {
    const sandTiles = new Set<string>()
    if (!this.sandActive || this.sandTileCount <= 0) {
      return sandTiles
    }

    const cx = Math.floor(BASE_COLS / 2)
    const cy = Math.floor(BASE_ROWS / 2)
    const attempts = this.sandTileCount * 20
    for (let i = 0; i < attempts && sandTiles.size < this.sandTileCount; i += 1) {
      const x = 1 + Math.floor(Math.random() * (BASE_COLS - 2))
      const y = 1 + Math.floor(Math.random() * (BASE_ROWS - 2))
      const key = `${x},${y}`
      if (this.walls.has(key) || this.iceTiles.has(key)) {
        continue
      }
      if (Math.abs(x - cx) < 3 && Math.abs(y - cy) < 3) {
        continue
      }
      sandTiles.add(key)
    }
    return sandTiles
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
    return !this.enemies.some((enemy) =>
      enemy.body.some((segment) => segment.x === x && segment.y === y),
    )
  }

  private setupPortalFlow(): void {
    if (this.isBossFloor) {
      this.portals = []
      this.portalCountdownMs = 0
      this.portalGraceMs = 0
      this.portalGraceSecondCue = -1
      this.squeezeStepTimerMs = 0
      this.squeezeInset = 0
      return
    }
    const floorOffset = Math.max(0, gameState.floor - 1)
    const countdown =
      BALANCE.portal.countdownBaseMs - floorOffset * BALANCE.portal.countdownPerFloorMs
    this.portalCountdownMs = Math.max(BALANCE.portal.countdownMinMs, countdown)
    this.portalGraceMs = BALANCE.portal.graceMs
    this.portalGraceSecondCue = -1
    this.portals = []
    this.squeezeStepTimerMs = 0
    this.squeezeInset = 0
  }

  private setupCorePressureFlow(): void {
    const cfg = BALANCE.biome.pressure
    if (!cfg.enabled || this.isBossFloor || gameState.floor < cfg.startFloor) {
      this.corePressureActive = false
      this.corePressureIntervalMs = 0
      this.corePressureRemainingMs = 0
      this.corePressureCoolantCharges = 0
      return
    }
    const floorOffset = Math.max(0, gameState.floor - cfg.startFloor)
    const interval = Math.max(
      cfg.intervalMinMs,
      cfg.intervalBaseMs - floorOffset * cfg.intervalPerFloorMs,
    )
    this.corePressureActive = true
    this.corePressureIntervalMs = interval
    this.corePressureRemainingMs = interval
    this.corePressureCoolantCharges = 0
  }

  private updateCorePressure(delta: number): void {
    if (!this.corePressureActive || this.isDying) {
      return
    }
    this.corePressureRemainingMs = Math.max(0, this.corePressureRemainingMs - delta)
    if (this.corePressureRemainingMs > 0) {
      return
    }
    if (this.corePressureCoolantCharges > 0) {
      this.corePressureCoolantCharges -= 1
      this.corePressureRemainingMs = this.corePressureIntervalMs
      trackRetentionEvent('core_pressure_absorbed', {
        floor: gameState.floor,
        coolantRemaining: this.corePressureCoolantCharges,
      })
      emitFeedback('confirm')
      return
    }
    const decaySegments = Math.max(1, BALANCE.biome.pressure.decaySegments)
    let removed = 0
    while (removed < decaySegments && this.snake.length > 2) {
      this.snake.pop()
      removed += 1
    }
    this.corePressureRemainingMs = this.corePressureIntervalMs
    trackRetentionEvent('core_pressure_tick', {
      floor: gameState.floor,
      removedSegments: removed,
      snakeLength: this.snake.length,
    })
    emitFeedback('urgent')
    if (removed === 0) {
      this.die('rift')
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
    const countdownWasRunning = this.portalCountdownMs > 0
    if (countdownWasRunning) {
      this.portalCountdownMs = Math.max(0, this.portalCountdownMs - delta)
      if (this.portalCountdownMs <= 0 && this.objectiveType === 'portal') {
        this.spawnPortals()
      }
      if (this.portalCountdownMs <= 0 && this.portalGraceSecondCue < 0) {
        this.portalGraceSecondCue = Math.ceil(this.portalGraceMs / 1000) + 1
      }
    }
    if (this.portalCountdownMs > 0) {
      return
    }

    if (this.portalGraceMs > 0) {
      const next = Math.max(0, this.portalGraceMs - delta)
      const second = Math.ceil(next / 1000)
      if (second > 0 && second < this.portalGraceSecondCue) {
        this.portalGraceSecondCue = second
        emitFeedback('urgent')
      }
      this.portalGraceMs = next
      return
    }
    this.squeezeStepTimerMs += delta
    if (this.squeezeStepTimerMs < BALANCE.portal.squeezeStepMs) {
      return
    }
    this.squeezeStepTimerMs = 0
    if (this.squeezeInset >= BALANCE.portal.squeezeMaxInset) {
      return
    }
    this.squeezeInset += 1
    for (const portal of this.portals) {
      if (this.isWall(portal.x, portal.y)) {
        const portalCell = this.pickOpenCell()
        portal.x = portalCell.x
        portal.y = portalCell.y
      }
    }
    const head = this.snake[0]
    if (head && this.isWall(head.x, head.y)) {
      this.die('wall')
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
    const types: PowerupType[] =
      this.objectiveType === 'kills'
        ? ['venom', 'venom', 'venom', 'shield', 'slow', 'ghost', 'score']
        : this.isBossFloor
          ? ['venom', 'venom', 'shield', 'shield', 'slow', 'ghost', 'score']
          : ['shield', 'slow', 'ghost', 'score']
    const cell = this.pickOpenCell()
    const type = forcedType ?? types[Math.floor(Math.random() * types.length)] ?? 'shield'
    this.powerup = { x: cell.x, y: cell.y, type, pulse: 0 }
  }

  private pickOpenCell(options?: {
    preferredZone?: 'room' | 'corridor' | null
    minDistanceFromCenter?: number
  }): Vec2 {
    const candidates: Vec2[] = []
    const zoneCells =
      options?.preferredZone === 'room'
        ? this.roomCells
        : options?.preferredZone === 'corridor'
          ? this.corridorCells
          : null
    const cx = Math.floor(BASE_COLS / 2)
    const cy = Math.floor(BASE_ROWS / 2)
    const minDistance = options?.minDistanceFromCenter ?? 0
    for (let y = 1; y < BASE_ROWS - 1; y += 1) {
      for (let x = 1; x < BASE_COLS - 1; x += 1) {
        const key = `${x},${y}`
        if (zoneCells && !zoneCells.has(key)) {
          continue
        }
        if (minDistance > 0 && Math.abs(x - cx) + Math.abs(y - cy) < minDistance) {
          continue
        }
        if (!this.isSafe(x, y)) {
          continue
        }
        if (this.food && this.food.x === x && this.food.y === y) {
          continue
        }
        candidates.push({ x, y })
      }
    }
    if (candidates.length > 0) {
      return candidates[Math.floor(Math.random() * candidates.length)] as Vec2
    }
    for (let attempts = 0; attempts < 300; attempts += 1) {
      const x = 1 + Math.floor(Math.random() * (BASE_COLS - 2))
      const y = 1 + Math.floor(Math.random() * (BASE_ROWS - 2))
      if (!this.isSafe(x, y) || (this.food && this.food.x === x && this.food.y === y)) {
        continue
      }
      return { x, y }
    }
    return { x: cx, y: cy }
  }

  private getEliteSpawnConfig(): (typeof BALANCE.elite.spawnByFloor)[number] {
    const floor = gameState.floor
    const sorted = [...BALANCE.elite.spawnByFloor].sort((a, b) => b.minFloor - a.minFloor)
    return sorted.find((config) => floor >= config.minFloor) ?? BALANCE.elite.spawnByFloor[0]
  }

  private getEnemyVariantConfig(): {
    eggChance: number
    mirrorChance: number
  } {
    const floor = gameState.floor
    const eggEnabled = floor >= BALANCE.enemyVariants.egg.minFloor
    const mirrorEnabled = floor >= BALANCE.enemyVariants.mirror.minFloor
    return {
      eggChance: eggEnabled ? BALANCE.enemyVariants.egg.spawnChance : 0,
      mirrorChance: mirrorEnabled ? BALANCE.enemyVariants.mirror.spawnChance : 0,
    }
  }

  private getItemSpawnConfig(): (typeof BALANCE.item.spawnByFloor)[number] {
    const floor = gameState.floor
    const sorted = [...BALANCE.item.spawnByFloor].sort((a, b) => b.minFloor - a.minFloor)
    return sorted.find((config) => floor >= config.minFloor) ?? BALANCE.item.spawnByFloor[0]
  }

  private resolveEliteKind(): EnemyKind | null {
    const config = this.getEliteSpawnConfig()
    if (Math.random() >= config.spawnChance) {
      return null
    }
    const totalWeight = config.kindWeights.stalker + config.kindWeights.ambusher
    if (totalWeight <= 0) {
      return null
    }
    const roll = Math.random() * totalWeight
    return roll < config.kindWeights.stalker ? 'stalker' : 'ambusher'
  }

  private resolveSpecialEnemyKind(): EnemyKind | null {
    const config = this.getEnemyVariantConfig()
    const totalWeight = config.eggChance + config.mirrorChance
    if (totalWeight <= 0) {
      return null
    }
    const roll = Math.random()
    if (roll >= totalWeight) {
      return null
    }
    const weightedRoll = Math.random() * totalWeight
    return weightedRoll < config.eggChance ? 'egg' : 'mirror'
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
    const floorItemConfig = this.getItemSpawnConfig()
    const portalBeaconRoll =
      this.objectiveType === 'portal' &&
      this.portals.length === 0 &&
      Math.random() < floorItemConfig.portalBeaconOnFoodChance
    const riftBatteryRoll = Math.random() < floorItemConfig.riftBatteryOnFoodChance
    const coreRoll = Math.random() < BALANCE.biome.coreItem.spawnChanceOnFood
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
    const cx = Math.floor(BASE_COLS / 2)
    const cy = Math.floor(BASE_ROWS / 2)
    let seedCell = this.pickOpenCell({
      preferredZone: this.floorTemplate === 'rooms_v1' ? 'corridor' : null,
      minDistanceFromCenter: 6,
    })
    if (Math.abs(seedCell.x - cx) <= 3 && Math.abs(seedCell.y - cy) <= 3) {
      seedCell = this.pickOpenCell({ minDistanceFromCenter: 6 })
    }
    const x = seedCell.x
    const y = seedCell.y
    const randomLen =
      BALANCE.enemy.lengthBase +
      Math.floor(Math.random() * BALANCE.enemy.lengthRandomRange) +
      Math.floor(gameState.floor / BALANCE.enemy.lengthFloorStep)
    const resolvedKind =
      kind === 'normal'
        ? (this.resolveSpecialEnemyKind() ?? this.resolveEliteKind() ?? 'normal')
        : kind
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
    })
  }

  private moveEnemy(enemy: Enemy): void {
    if (!enemy.alive) {
      return
    }
    if (enemy.kind === 'egg') {
      this.updateEggEnemy(enemy)
      return
    }
    if (enemy.kind === 'mirror') {
      this.moveMirrorEnemy(enemy)
      return
    }
    const head = enemy.body[0]
    const playerHead = this.snake[0]
    if (!head || !playerHead) {
      return
    }
    const dirs: Vec2[] = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ]
    const dx = playerHead.x - head.x
    const dy = playerHead.y - head.y

    if (enemy.kind === 'ambusher' && this.tryAmbusherDash(enemy, playerHead)) {
      return
    }

    const preferred = [...dirs].sort((a, b) => {
      const sa = a.x * Math.sign(dx) + a.y * Math.sign(dy)
      const sb = b.x * Math.sign(dx) + b.y * Math.sign(dy)
      const randomness =
        enemy.kind === 'stalker' || enemy.kind === 'ambusher' ? 0 : (Math.random() - 0.5) * 0.5
      return sb - sa + randomness
    })

    for (const dir of preferred) {
      if (dir.x === -enemy.dir.x && dir.y === -enemy.dir.y) {
        continue
      }
      const nx = head.x + dir.x
      const ny = head.y + dir.y
      if (this.isWall(nx, ny)) {
        continue
      }

      const hitsSelf = enemy.body
        .slice(1, -1)
        .some((segment) => segment.x === nx && segment.y === ny)
      if (hitsSelf) {
        continue
      }
      this.advanceEnemyStep(enemy, dir)
      break
    }
  }

  private updateEggEnemy(enemy: Enemy): void {
    enemy.hatchTurnsRemaining = Math.max(0, enemy.hatchTurnsRemaining - 1)
    if (enemy.hatchTurnsRemaining > 0) {
      return
    }
    const head = enemy.body[0]
    if (!head) {
      return
    }
    enemy.kind = 'normal'
    enemy.mirrorDelaySteps = 0
    enemy.body = Array.from({ length: BALANCE.enemyVariants.egg.hatchLength }, (_, i) => ({
      x: Math.max(0, head.x - i),
      y: head.y,
    }))
    this.spawnParticles(head.x, head.y, COLORS.enemyHead, 8)
  }

  private moveMirrorEnemy(enemy: Enemy): void {
    const head = enemy.body[0]
    if (!head) {
      return
    }
    const history = this.playerHeadHistory
    const delay = Math.max(1, enemy.mirrorDelaySteps)
    const targetIndex = history.length - 1 - delay
    const target = targetIndex >= 0 ? history[targetIndex] : this.snake[0]
    if (!target) {
      return
    }
    const dx = Math.sign(target.x - head.x)
    const dy = Math.sign(target.y - head.y)
    const preferred: Vec2[] =
      Math.abs(target.x - head.x) >= Math.abs(target.y - head.y)
        ? [
            { x: dx, y: 0 },
            { x: 0, y: dy },
            { x: -dx, y: 0 },
            { x: 0, y: -dy },
          ]
        : [
            { x: 0, y: dy },
            { x: dx, y: 0 },
            { x: 0, y: -dy },
            { x: -dx, y: 0 },
          ]
    for (const dir of preferred) {
      if (dir.x === 0 && dir.y === 0) {
        continue
      }
      if (this.advanceEnemyStep(enemy, dir)) {
        return
      }
    }
  }

  private advanceEnemyStep(enemy: Enemy, dir: Vec2): boolean {
    const head = enemy.body[0]
    if (!head) {
      return false
    }
    const nx = head.x + dir.x
    const ny = head.y + dir.y
    if (this.isWall(nx, ny)) {
      return false
    }
    const hitsSelf = enemy.body.slice(1, -1).some((segment) => segment.x === nx && segment.y === ny)
    if (hitsSelf) {
      return false
    }
    enemy.dir = dir
    enemy.body.unshift({ x: nx, y: ny })
    if (this.food && nx === this.food.x && ny === this.food.y) {
      this.spawnFood()
    } else {
      enemy.body.pop()
    }
    return true
  }

  private tryAmbusherDash(enemy: Enemy, playerHead: SnakeSegment): boolean {
    const head = enemy.body[0]
    if (!head) {
      return false
    }
    if (enemy.dashCooldown > 0) {
      enemy.dashCooldown -= 1
      return false
    }

    const alignedX = head.x === playerHead.x
    const alignedY = head.y === playerHead.y
    if (!alignedX && !alignedY) {
      return false
    }

    const laneDistance = alignedX
      ? Math.abs(head.y - playerHead.y)
      : Math.abs(head.x - playerHead.x)
    if (laneDistance < BALANCE.elite.ambusher.dashMinLaneDistance) {
      return false
    }
    if (Math.random() >= BALANCE.elite.ambusher.dashChanceWhenAligned) {
      return false
    }

    const dir: Vec2 = alignedX
      ? { x: 0, y: Math.sign(playerHead.y - head.y) }
      : { x: Math.sign(playerHead.x - head.x), y: 0 }
    if (dir.x === -enemy.dir.x && dir.y === -enemy.dir.y) {
      return false
    }

    let moved = false
    for (let step = 0; step < BALANCE.elite.ambusher.dashSteps; step += 1) {
      const advanced = this.advanceEnemyStep(enemy, dir)
      if (!advanced) {
        break
      }
      moved = true
    }
    if (moved) {
      enemy.dashCooldown = BALANCE.elite.ambusher.dashCooldownTurns
    }
    return moved
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
    const head = this.snake[0]
    if (!head) {
      return null
    }
    for (const enemy of this.enemies) {
      if (!enemy.alive) {
        continue
      }
      const enemyHead = enemy.body[0]
      if (enemyHead && enemyHead.x === head.x && enemyHead.y === head.y) {
        this.killEnemy(enemy)
        return { enemy, part: 'head' }
      }
      if (enemy.body.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)) {
        this.killEnemy(enemy)
        return { enemy, part: 'body' }
      }
    }
    return null
  }

  private applyBossKnockback(previousHead: SnakeSegment): void {
    this.snake.shift()
    if (!this.snake[0]) {
      this.snake.unshift({ x: previousHead.x, y: previousHead.y })
    }
    this.flashColor = COLORS.enemyHead
    this.flashTimer = 0.18
    this.shakeTimer = 0.28
    this.spawnParticles(previousHead.x, previousHead.y, COLORS.enemyHead, 8)
    emitFeedback('danger')
    setHintText(t('game.bossKnockback'))
  }

  private getEnemyCollisionDamage(enemy: Enemy, part: EnemyCollisionPart): number {
    if (enemy.kind === 'boss') {
      return part === 'head'
        ? BALANCE.enemyCollision.bossHeadDamageSegments
        : BALANCE.enemyCollision.bossBodyDamageSegments
    }
    return part === 'head'
      ? BALANCE.enemyCollision.headDamageSegments
      : BALANCE.enemyCollision.bodyDamageSegments
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
    this.flashColor = COLORS.enemyHead
    this.flashTimer = 0.14
    this.shakeTimer = 0.18
    setHintText(t('game.tailDamaged', { lost: removed }))
    emitFeedback('danger')
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
        this.flashColor = COLORS.enemyHead
        this.flashTimer = 0.2
        this.shakeTimer = 0.2
        emitFeedback('danger')
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
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: 1,
        maxLife: 0.5 + Math.random() * 0.4,
        color,
        size: 2 + Math.random() * 3,
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
      if (this.shields > 0) {
        this.shields -= 1
        this.flashTimer = 0.15
        this.flashColor = COLORS.shield
      } else {
        this.die('rift')
        return
      }
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
      emitFeedback('success')
      this.score += Math.floor(BALANCE.food.scoreOnEat * this.cfg.scoreMult)
      this.pendingGrowth += 1
      if (this.corePressureActive) {
        this.corePressureRemainingMs = this.corePressureIntervalMs
      }
      this.spawnParticles(nx, ny, COLORS.food, 8)
      this.spawnFood()
      if (Math.random() < BALANCE.spawn.powerupOnFoodChance) {
        this.spawnPowerup()
      }
      this.spawnBiomeItem()
      updateHud(this.score)
    }

    if (this.powerup && nx === this.powerup.x && ny === this.powerup.y) {
      emitFeedback('confirm')
      const collectedType = this.powerup.type
      this.powerup = null
      this.applyPowerup(collectedType)
      this.spawnParticles(nx, ny, COLORS.powerup, 10)
      if (this.isBossFloor) {
        this.bossSupportShieldRespawnMs = BALANCE.biome.boss.supportShieldRespawnMs
      }
      if (Math.random() < BALANCE.spawn.powerupRespawnChance) {
        this.time.delayedCall(BALANCE.spawn.powerupRespawnDelayMs, () => {
          if (this.scene.isActive('Game')) {
            this.spawnPowerup()
          }
        })
      }
    }
    if (this.biomeItem && nx === this.biomeItem.x && ny === this.biomeItem.y) {
      emitFeedback('success')
      if (this.biomeItem.type === 'rift_battery') {
        this.activateRiftSuppression('rift_battery')
        trackRetentionEvent('item_collected', {
          item: 'rift_battery',
          floor: gameState.floor,
          score: this.score,
        })
        this.spawnParticles(nx, ny, COLORS.slow, 12)
      } else if (this.biomeItem.type === 'portal_beacon') {
        if (this.objectiveType === 'portal') {
          this.portalCountdownMs = Math.max(
            0,
            this.portalCountdownMs - BALANCE.item.effectDurations.portalAccelerateMs,
          )
        }
        trackRetentionEvent('item_collected', {
          item: 'portal_beacon',
          floor: gameState.floor,
          score: this.score,
        })
        this.spawnParticles(nx, ny, COLORS.beacon, 12)
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
          this.corePressureCoolantCharges += BALANCE.biome.pressure.coolantPerCoreItem
          this.corePressureRemainingMs = this.corePressureIntervalMs
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
        updateHud(this.score)
      }
      this.biomeItem = null
    }

    const enemyCollision = this.checkEnemyCollision()
    if (enemyCollision) {
      const collidedEnemy = enemyCollision.enemy
      if (this.shields > 0) {
        this.shields = Math.max(0, this.shields - 1)
        this.shakeTimer = 0.2
        this.flashTimer = 0.15
        this.flashColor = COLORS.shield
        if (collidedEnemy.kind === 'boss' && collidedEnemy.alive) {
          this.applyBossKnockback(head)
        }
        this.enemies = this.enemies.filter((enemy) => enemy.alive)
        if (!this.isBossFloor && Math.random() < BALANCE.spawn.enemyRespawnOnShieldHitChance) {
          this.spawnEnemy()
        }
      } else {
        const survived = this.applySnakeSegmentDamage(collidedEnemy, enemyCollision.part)
        if (!survived) {
          return
        }
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
        Math.random() < BALANCE.spawn.enemyRespawnIdleChance
      ) {
        this.spawnEnemy()
      }
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
    if (this.isBossFloor) {
      return false
    }
    if (
      this.objectiveType === 'score' &&
      this.getObjectiveScoreProgress() >= this.objectiveScoreTarget
    ) {
      emitFeedback('confirm')
      transitionToScene(this, 'Upgrade', {
        chrome: 'run',
        data: { score: this.score, floor: gameState.floor },
      })
      return true
    }
    if (
      this.objectiveType === 'kills' &&
      this.getObjectiveKillsProgress() >= this.objectiveKillsTarget
    ) {
      emitFeedback('confirm')
      transitionToScene(this, 'Upgrade', {
        chrome: 'run',
        data: { score: this.score, floor: gameState.floor },
      })
      return true
    }
    return false
  }

  private applyPowerup(type: PowerupType): void {
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
    this.score += Math.floor(BALANCE.powerup.scoreBonus * this.cfg.scoreMult)
    updateHud(this.score)
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
    g.fillStyle(0x0f0320, 0.5)
    g.fillCircle(WIDTH * 0.22, HEIGHT * 0.3, 96)
    g.fillStyle(0x130035, 0.35)
    g.fillCircle(WIDTH * 0.78, HEIGHT * 0.72, 120)
    for (const star of this.stars) {
      g.fillStyle(0x99ccff, star.alpha)
      g.fillRect(star.x, star.y, star.size, star.size)
    }
    g.lineStyle(1, COLORS.grid, 0.25)
    for (let x = 0; x <= BASE_COLS; x += 1) {
      g.moveTo(x * CELL, 0)
      g.lineTo(x * CELL, HEIGHT)
    }
    for (let y = 0; y <= BASE_ROWS; y += 1) {
      g.moveTo(0, y * CELL)
      g.lineTo(WIDTH, y * CELL)
    }
    g.strokePath()
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
      const pulse = Math.sin(this.food.pulse) * 0.3 + 0.7
      const fx = this.food.x * CELL
      const fy = this.food.y * CELL
      const cx = fx + CELL / 2
      const cy = fy + CELL / 2
      g.fillStyle(COLORS.foodGlow, 0.22 * pulse)
      g.fillCircle(cx, cy, CELL * 0.95)
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
      g.fillStyle(color, 0.2 * pulse)
      g.fillCircle(cx, cy, CELL * 0.82)
      g.fillStyle(color, 0.95)
      const markerTone: 'shield' | 'slow' | 'ghost' | 'score' | 'venom' = this.powerup.type
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
      g.fillStyle(isBeacon ? COLORS.beacon : isRiftBattery ? 0x8866ff : 0x7ef2ff, 0.18 * pulse)
      g.fillCircle(ix + CELL / 2, iy + CELL / 2, CELL * 0.95)
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
      const biomeTone = isBeacon ? 'beacon' : isRiftBattery ? 'battery' : 'biomeCore'
      const biomeDisp = Math.round(CELL * 0.84)
      const bcx = ix + CELL / 2
      const bcy = iy + CELL / 2
      this.markerBiome.setTexture(markerTextureKey(biomeTone))
      this.markerBiome.setPosition(Math.round(bcx), Math.round(bcy))
      this.markerBiome.setDisplaySize(biomeDisp, biomeDisp)
      this.markerBiome.setAlpha(0.9)
      this.markerBiome.setVisible(true)
    }
    if (this.referenceBoardMode && this.referenceMarkers.length > 0) {
      const markerSize = Math.round(CELL * 0.9)
      for (let i = 0; i < this.referenceMarkers.length; i += 1) {
        const marker = this.referenceMarkers[i]
        const img = this.referenceMarkerImages[i]
        if (!img) {
          continue
        }
        const cx = marker.x * CELL + CELL / 2
        const cy = marker.y * CELL + CELL / 2
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
        g.fillStyle(color, i === 0 ? 1 : 0.7)
        if (i === 0) {
          if (enemy.kind === 'egg') {
            const cx = segment.x * CELL + CELL / 2
            const cy = segment.y * CELL + CELL / 2
            g.fillStyle(eggHead, 0.95)
            g.fillCircle(cx, cy, CELL * 0.38)
            g.lineStyle(1, 0xfff7d4, 0.7)
            g.strokeCircle(cx, cy, CELL * 0.38)
            g.lineStyle(1, 0x6e5120, 0.8)
            g.beginPath()
            g.moveTo(cx - cellPx(3), cy - cellPx(1))
            g.lineTo(cx - cellPx(1), cy + cellPx(1))
            g.lineTo(cx + cellPx(1), cy - cellPx(1))
            g.lineTo(cx + cellPx(3), cy + cellPx(1))
            g.strokePath()
          } else {
            g.fillRect(
              segment.x * CELL + cellPx(1),
              segment.y * CELL + cellPx(1),
              CELL - cellPx(2),
              CELL - cellPx(2),
            )
            g.lineStyle(1, 0xffffff, 0.55)
            g.strokeRect(
              segment.x * CELL + cellPx(1),
              segment.y * CELL + cellPx(1),
              CELL - cellPx(2),
              CELL - cellPx(2),
            )
            g.fillStyle(0x000000)
            g.fillCircle(segment.x * CELL + cellPx(5), segment.y * CELL + cellPx(5), cellPx(2))
            g.fillCircle(
              segment.x * CELL + CELL - cellPx(5),
              segment.y * CELL + cellPx(5),
              cellPx(2),
            )
          }
          if (enemy.kind === 'boss') {
            if (this.bossPhase === 'rage') {
              g.fillStyle(0xff3355, 0.2)
              g.fillCircle(segment.x * CELL + CELL / 2, segment.y * CELL + CELL / 2, CELL * 0.9)
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
          const pad = Math.min(cellPx(5), Math.max(cellPx(1), i * cellPx(0.2)))
          g.fillRect(segment.x * CELL + pad, segment.y * CELL + pad, CELL - pad * 2, CELL - pad * 2)
          g.fillStyle(0xffffff, 0.12)
          g.fillRect(segment.x * CELL + pad, segment.y * CELL + pad, CELL - pad * 2, cellPx(1))
        }
      }
    }

    for (const [i, segment] of this.snake.entries()) {
      if (i === 0) {
        g.fillStyle(COLORS.snakeHead)
        g.fillRect(
          segment.x * CELL + cellPx(1),
          segment.y * CELL + cellPx(1),
          CELL - cellPx(2),
          CELL - cellPx(2),
        )
        g.lineStyle(1, 0xffffff, 0.45)
        g.strokeRect(
          segment.x * CELL + cellPx(1),
          segment.y * CELL + cellPx(1),
          CELL - cellPx(2),
          CELL - cellPx(2),
        )
        g.fillStyle(COLORS.snakeHead, 0.15)
        g.fillRect(
          segment.x * CELL - cellPx(2),
          segment.y * CELL - cellPx(2),
          CELL + cellPx(4),
          CELL + cellPx(4),
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
          g.lineStyle(2, COLORS.shield, 0.8)
          g.strokeRect(
            segment.x * CELL - cellPx(2),
            segment.y * CELL - cellPx(2),
            CELL + cellPx(4),
            CELL + cellPx(4),
          )
        }
        continue
      }
      const alpha = Math.max(0.3, 1 - i * 0.025)
      const pad = Math.min(cellPx(4), cellPx(1) + i * cellPx(0.12))
      g.fillStyle(COLORS.snake, alpha)
      g.fillRect(segment.x * CELL + pad, segment.y * CELL + pad, CELL - pad * 2, CELL - pad * 2)
      g.fillStyle(0xffffff, 0.08)
      g.fillRect(segment.x * CELL + pad, segment.y * CELL + pad, CELL - pad * 2, cellPx(1))
    }

    for (const particle of this.particles) {
      g.fillStyle(particle.color, particle.life)
      g.fillCircle(particle.x, particle.y, particle.size * particle.life)
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
