import Phaser from 'phaser'
import { BALANCE, createBaseRunConfig, getFloorSetup } from '../core/balance'
import { BASE_COLS, BASE_ROWS, CELL, COLORS, HEIGHT, WIDTH } from '../core/constants'
import { applyRelicEffect, applyTalentEffects } from '../core/meta'
import { getFloorObjective } from '../core/objectives'
import { gameState, playerProfile } from '../core/state'
import type {
  BiomeItem,
  Enemy,
  EnemyKind,
  FloorObjectiveKind,
  Food,
  Particle,
  Powerup,
  PowerupType,
  RunConfig,
  SnakeSegment,
  Vec2,
  WorldItemType,
} from '../core/types'
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
}

type DeathReason = 'wall' | 'self' | 'enemy' | 'rift'
type PortalCell = Vec2 & { pulse: number }

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
  private enemyCount = 0
  private pendingGrowth = 0
  private objectiveType: FloorObjectiveKind = 'portal'
  private objectiveScoreStart = 0
  private objectiveScoreTarget = 0
  private objectiveKillsStart = 0
  private objectiveKillsTarget = 0
  private portal: PortalCell | null = null
  private portalCountdownMs = 0
  private portalGraceMs = 0
  private portalGraceSecondCue = -1
  private squeezeStepTimerMs = 0
  private squeezeInset = 0
  private snake: SnakeSegment[] = []
  private walls = new Set<string>()
  private enemies: Enemy[] = []
  private food: Food | null = null
  private powerup: Powerup | null = null
  private biomeItem: BiomeItem | null = null
  private enemyMoveTimer = 0
  private enemyInterval = 400
  private riftTimer = 0
  private riftSuppressionMsRemaining = 0
  private riftCell: Vec2 | null = null
  private stars: Array<{ x: number; y: number; size: number; alpha: number }> = []
  private isBossFloor = false
  private runStartMs = 0
  private isDying = false
  private pauseText?: Phaser.GameObjects.Text

  private bgGraphics!: Phaser.GameObjects.Graphics
  private wallGraphics!: Phaser.GameObjects.Graphics
  private gameGraphics!: Phaser.GameObjects.Graphics
  private fxGraphics!: Phaser.GameObjects.Graphics

  public constructor() {
    super('Game')
  }

  public create(data: GameSceneData): void {
    resetVirtualInput()
    this.score = data.score ?? 0
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

    const floorSetup = getFloorSetup(gameState.floor, this.cfg.enemySlow)
    this.wallCount = floorSetup.wallCount
    this.enemyCount = floorSetup.enemyCount
    this.enemyInterval = floorSetup.enemyIntervalMs
    this.isBossFloor = gameState.floor % BALANCE.biome.boss.floorInterval === 0
    const floorObjective = getFloorObjective(gameState.floor, gameState.runObjectiveOffset)
    this.objectiveType = floorObjective.kind
    this.objectiveScoreStart = this.score
    this.objectiveKillsStart = gameState.kills
    this.objectiveScoreTarget = floorObjective.scoreTarget
    this.objectiveKillsTarget = floorObjective.killsTarget

    this.bgGraphics = this.add.graphics()
    this.wallGraphics = this.add.graphics()
    this.gameGraphics = this.add.graphics()
    this.fxGraphics = this.add.graphics()

    this.walls = this.generateWalls()
    this.snake = this.spawnSnake()
    this.setupPortalFlow()
    this.enemies = []
    if (this.isBossFloor) {
      this.enemyCount = 1
      this.spawnEnemy('boss')
    } else {
      for (let i = 0; i < this.enemyCount; i += 1) {
        this.spawnEnemy()
      }
    }

    this.spawnFood()
    if (Math.random() < BALANCE.spawn.powerupAtFloorStartChance) {
      this.spawnPowerup()
    }
    this.stars = Array.from({ length: BALANCE.biome.starCount }, () => ({
      x: Math.floor(Math.random() * WIDTH),
      y: Math.floor(Math.random() * HEIGHT),
      size: Math.max(1, Math.floor(Math.random() * 2) + 1),
      alpha: 0.15 + Math.random() * 0.4,
    }))
    this.riftCell = this.pickOpenCell()

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const dir = directionMap[event.code]
      if (dir) {
        this.pushDirection(dir)
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
    updateHud(this.score)
    setHintText(`${getMoveHintText()} · ${t('hint.itemLegend')}`)
  }

  public update(_time: number, delta: number): void {
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

    if (this.paused) {
      return
    }

    const dt = delta / 1000
    this.updateCameraShake(dt)
    this.updateEnemyMovement(delta)
    this.ensureObjectiveEnemyAvailability()
    this.updateVoidRift(delta)
    this.updatePortalFlow(delta)
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
    if (this.portal) {
      this.portal.pulse += dt * 4.2
    }
    const localizedBiome = t(`biome.${BALANCE.biome.id.replaceAll('-', '_')}`, {
      defaultValue: BALANCE.biome.name,
    })
    const hazardInfo =
      this.riftSuppressionMsRemaining > 0
        ? t('game.riftSuppressed', {
            seconds: Math.ceil(this.riftSuppressionMsRemaining / 1000),
          })
        : null
    const objectiveInfo = this.getObjectiveStatusText()
    const hudStatus = hazardInfo
      ? `${localizedBiome} · ${objectiveInfo} · ${hazardInfo}`
      : `${localizedBiome} · ${objectiveInfo}`
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
    this.pendingGrowth = 0
    this.objectiveType = 'portal'
    this.objectiveScoreStart = 0
    this.objectiveScoreTarget = 0
    this.objectiveKillsStart = 0
    this.objectiveKillsTarget = 0
    this.portal = null
    this.portalCountdownMs = 0
    this.portalGraceMs = 0
    this.portalGraceSecondCue = -1
    this.squeezeStepTimerMs = 0
    this.squeezeInset = 0
    this.enemyMoveTimer = 0
    this.riftTimer = 0
    this.riftSuppressionMsRemaining = 0
    this.riftCell = null
    this.biomeItem = null
    this.stars = []
    this.isBossFloor = false
    this.isDying = false
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

  private updateSnakeMovement(delta: number): void {
    this.moveTimer += delta
    if (this.moveTimer < this.cfg.moveInterval) {
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
        (this.portal && this.portal.x === candidate.x && this.portal.y === candidate.y) ||
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

  private getObjectiveStatusText(): string {
    if (this.isBossFloor || this.objectiveType === 'boss') {
      return t('game.bossAdvance')
    }
    if (this.objectiveType === 'portal') {
      if (!this.portal) {
        return t('game.portalIn', { seconds: Math.ceil(this.portalCountdownMs / 1000) })
      }
      if (this.portalGraceMs > 0) {
        return `${t('game.portalFind')} · ${t('game.squeezeIn', { seconds: Math.ceil(this.portalGraceMs / 1000) })}`
      }
      return `${t('game.portalFind')} · ${t('game.squeezeActive')}`
    }
    if (this.objectiveType === 'score') {
      return t('game.objectiveScoreStatus', {
        progress: this.getObjectiveScoreProgress(),
        target: this.objectiveScoreTarget,
        pressure: this.getPressureStatusText(),
      })
    }
    return t('game.objectiveKillsStatus', {
      progress: this.getObjectiveKillsProgress(),
      target: this.objectiveKillsTarget,
      pressure: this.getPressureStatusText(),
    })
  }

  private spawnSnake(): SnakeSegment[] {
    const cx = Math.floor(BASE_COLS / 2)
    const cy = Math.floor(BASE_ROWS / 2)
    const len = BALANCE.run.baseSnakeLength + this.cfg.bonusStartLength
    return Array.from({ length: len }, (_, i) => ({ x: cx - i, y: cy }))
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

  private isSafe(x: number, y: number): boolean {
    if (this.isWall(x, y)) {
      return false
    }
    if (this.snake.some((segment) => segment.x === x && segment.y === y)) {
      return false
    }
    if (this.portal && this.portal.x === x && this.portal.y === y) {
      return false
    }
    return !this.enemies.some((enemy) =>
      enemy.body.some((segment) => segment.x === x && segment.y === y),
    )
  }

  private setupPortalFlow(): void {
    if (this.isBossFloor) {
      this.portal = null
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
    this.portal = null
    this.squeezeStepTimerMs = 0
    this.squeezeInset = 0
  }

  private spawnPortal(): void {
    if (this.portal || this.isBossFloor || this.objectiveType !== 'portal') {
      return
    }
    const portalCell = this.pickOpenCell()
    this.portal = { ...portalCell, pulse: 0 }
    emitFeedback('portal')
    this.portalGraceSecondCue = Math.ceil(this.portalGraceMs / 1000) + 1
    setHintText(t('game.portalFind'))
  }

  private updatePortalFlow(delta: number): void {
    if (this.isBossFloor || this.isDying) {
      return
    }
    const countdownWasRunning = this.portalCountdownMs > 0
    if (countdownWasRunning) {
      this.portalCountdownMs = Math.max(0, this.portalCountdownMs - delta)
      if (this.portalCountdownMs <= 0 && this.objectiveType === 'portal') {
        this.spawnPortal()
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
    if (this.portal && this.isWall(this.portal.x, this.portal.y)) {
      const portalCell = this.pickOpenCell()
      this.portal = { ...portalCell, pulse: 0 }
    }
    const head = this.snake[0]
    if (head && this.isWall(head.x, head.y)) {
      this.die('wall')
    }
  }

  private spawnFood(): void {
    let x = 1
    let y = 1
    do {
      x = 1 + Math.floor(Math.random() * (BASE_COLS - 2))
      y = 1 + Math.floor(Math.random() * (BASE_ROWS - 2))
    } while (!this.isSafe(x, y))
    this.food = { x, y, pulse: 0 }
  }

  private spawnPowerup(): void {
    const types: PowerupType[] = ['shield', 'slow', 'ghost', 'score']
    let x = 1
    let y = 1
    do {
      x = 1 + Math.floor(Math.random() * (BASE_COLS - 2))
      y = 1 + Math.floor(Math.random() * (BASE_ROWS - 2))
    } while (!this.isSafe(x, y) || (this.food && this.food.x === x && this.food.y === y))
    const type = types[Math.floor(Math.random() * types.length)] ?? 'shield'
    this.powerup = { x, y, type, pulse: 0 }
  }

  private pickOpenCell(): Vec2 {
    let x = 1
    let y = 1
    do {
      x = 1 + Math.floor(Math.random() * (BASE_COLS - 2))
      y = 1 + Math.floor(Math.random() * (BASE_ROWS - 2))
    } while (!this.isSafe(x, y) || (this.food && this.food.x === x && this.food.y === y))
    return { x, y }
  }

  private getEliteSpawnConfig(): (typeof BALANCE.elite.spawnByFloor)[number] {
    const floor = gameState.floor
    const sorted = [...BALANCE.elite.spawnByFloor].sort((a, b) => b.minFloor - a.minFloor)
    return sorted.find((config) => floor >= config.minFloor) ?? BALANCE.elite.spawnByFloor[0]
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
      !this.portal &&
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
    let x = 1
    let y = 1
    const cx = Math.floor(BASE_COLS / 2)
    const cy = Math.floor(BASE_ROWS / 2)
    for (let attempt = 0; attempt < 200; attempt += 1) {
      x = 1 + Math.floor(Math.random() * (BASE_COLS - 2))
      y = 1 + Math.floor(Math.random() * (BASE_ROWS - 2))
      if (!this.isWall(x, y) && (Math.abs(x - cx) > 5 || Math.abs(y - cy) > 5)) {
        break
      }
    }
    const randomLen =
      BALANCE.enemy.lengthBase +
      Math.floor(Math.random() * BALANCE.enemy.lengthRandomRange) +
      Math.floor(gameState.floor / BALANCE.enemy.lengthFloorStep)
    const resolvedKind = kind === 'normal' ? (this.resolveEliteKind() ?? 'normal') : kind
    const len =
      resolvedKind === 'boss'
        ? BALANCE.biome.boss.length
        : Math.max(
            2,
            resolvedKind === 'stalker' || resolvedKind === 'ambusher' ? randomLen + 1 : randomLen,
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
    })
  }

  private moveEnemy(enemy: Enemy): void {
    if (!enemy.alive) {
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

  private checkEnemyCollision(): boolean {
    const head = this.snake[0]
    if (!head) {
      return false
    }
    for (const enemy of this.enemies) {
      if (!enemy.alive) {
        continue
      }
      if (enemy.body.some((segment) => segment.x === head.x && segment.y === head.y)) {
        this.killEnemy(enemy)
        return true
      }
    }
    return false
  }

  private killEnemy(enemy: Enemy): void {
    enemy.health -= 1
    if (enemy.health > 0) {
      const head = enemy.body[0]
      if (head) {
        this.spawnParticles(head.x, head.y, COLORS.shield, 6)
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

  private moveSnake(): void {
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
      this.portal &&
      nx === this.portal.x &&
      ny === this.portal.y
    ) {
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
      this.applyPowerup(this.powerup.type)
      this.spawnParticles(nx, ny, COLORS.powerup, 10)
      this.powerup = null
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
        if (this.objectiveType === 'portal' && !this.portal && this.portalCountdownMs <= 0) {
          this.spawnPortal()
        } else if (this.objectiveType === 'portal' && !this.portal) {
          setHintText(t('game.portalAccelerated'))
        }
      } else {
        this.score += Math.floor(BALANCE.biome.coreItem.scoreBonus * this.cfg.scoreMult)
        this.pendingGrowth += BALANCE.biome.coreItem.growthBonus
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

    const enemyHit = this.checkEnemyCollision()
    if (enemyHit) {
      if (this.shields > 0) {
        this.shields -= 1
        this.shakeTimer = 0.2
        this.flashTimer = 0.15
        this.flashColor = COLORS.shield
        this.enemies = this.enemies.filter((enemy) => enemy.alive)
        if (!this.isBossFloor && Math.random() < BALANCE.spawn.enemyRespawnOnShieldHitChance) {
          this.spawnEnemy()
        }
      } else {
        this.die('enemy')
        return
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
      g.fillRect(x * CELL + 3, y * CELL + 3, CELL - 6, CELL - 6)
      g.fillStyle(0x4b63da, 0.5)
      g.fillRect(x * CELL + 2, y * CELL + 2, 2, 2)
      g.fillRect(x * CELL + CELL - 4, y * CELL + 2, 2, 2)
      g.fillRect(x * CELL + 2, y * CELL + CELL - 4, 2, 2)
      g.fillRect(x * CELL + CELL - 4, y * CELL + CELL - 4, 2, 2)
      g.lineStyle(1, COLORS.wallBright, 0.65)
      g.strokeRect(x * CELL, y * CELL, CELL, CELL)
    }
  }

  private drawPixelGlyph(
    g: Phaser.GameObjects.Graphics,
    cx: number,
    cy: number,
    rows: string[],
    color: number,
    alpha = 1,
  ): void {
    const pixel = 2
    const glyphHeight = rows.length * pixel
    const glyphWidth = (rows[0]?.length ?? 0) * pixel
    const ox = Math.round(cx - glyphWidth / 2)
    const oy = Math.round(cy - glyphHeight / 2)
    g.fillStyle(color, alpha)
    for (let y = 0; y < rows.length; y += 1) {
      const row = rows[y]
      if (!row) {
        continue
      }
      for (let x = 0; x < row.length; x += 1) {
        if (row[x] === '1') {
          g.fillRect(ox + x * pixel, oy + y * pixel, pixel, pixel)
        }
      }
    }
  }

  private drawFrame(): void {
    const g = this.gameGraphics
    g.clear()

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
      const s = CELL * 0.5 * pulse
      g.fillStyle(COLORS.foodGlow, 0.22 * pulse)
      g.fillCircle(cx, cy, CELL * 0.95)
      g.lineStyle(1, 0xff88aa, 0.8)
      g.strokeCircle(cx, cy, CELL * 0.36)
      g.fillStyle(COLORS.food, 0.95)
      g.fillTriangle(cx, cy - s / 1.15, cx - s / 1.15, cy, cx, cy + s / 1.15)
      g.fillTriangle(cx, cy - s / 1.15, cx + s / 1.15, cy, cx, cy + s / 1.15)
      this.drawPixelGlyph(g, cx, cy, ['00100', '01110', '11111', '01110', '00100'], 0xffe4ea, 0.95)
    }
    if (this.portal && !this.isBossFloor) {
      const pulse = Math.sin(this.portal.pulse) * 0.35 + 0.75
      const px = this.portal.x * CELL
      const py = this.portal.y * CELL
      g.fillStyle(COLORS.portalGlow, 0.22 * pulse)
      g.fillCircle(px + CELL / 2, py + CELL / 2, CELL * 0.95)
      g.lineStyle(2, COLORS.portal, 0.9)
      g.strokeCircle(px + CELL / 2, py + CELL / 2, CELL * 0.35)
      g.fillStyle(COLORS.portal, 0.95)
      const s = CELL * 0.35 * pulse
      g.fillTriangle(
        px + CELL / 2,
        py + CELL / 2 - s / 1.5,
        px + CELL / 2 - s / 1.2,
        py + CELL / 2 + s / 1.5,
        px + CELL / 2 + s / 1.2,
        py + CELL / 2 + s / 1.5,
      )
      this.drawPixelGlyph(
        g,
        px + CELL / 2,
        py + CELL / 2,
        ['01110', '10001', '10101', '10001', '01110'],
        0xd8fff6,
        0.95,
      )
    }
    if (this.riftCell) {
      const rx = this.riftCell.x * CELL
      const ry = this.riftCell.y * CELL
      const cx = rx + CELL / 2
      const cy = ry + CELL / 2
      g.fillStyle(0x7a2fff, 0.24)
      g.fillCircle(cx, cy, CELL * 0.96)
      g.lineStyle(1, 0xd089ff, 0.85)
      g.strokeCircle(cx, cy, CELL * 0.44)
      g.lineStyle(2, 0xffd2ff, 0.75)
      g.beginPath()
      g.moveTo(cx - 5, cy - 4)
      g.lineTo(cx, cy - 1)
      g.lineTo(cx - 2, cy + 2)
      g.lineTo(cx + 4, cy + 5)
      g.strokePath()
      this.drawPixelGlyph(g, cx, cy, ['10001', '01010', '00100', '01010', '10001'], 0xf3d3ff, 0.9)
    }

    if (this.powerup) {
      const pulse = Math.sin(this.powerup.pulse) * 0.3 + 0.7
      const colorMap: Record<PowerupType, number> = {
        shield: COLORS.shield,
        slow: COLORS.slow,
        ghost: 0xaaaaff,
        score: COLORS.powerup,
      }
      const color = colorMap[this.powerup.type]
      const px = this.powerup.x * CELL
      const py = this.powerup.y * CELL
      const cx = px + CELL / 2
      const cy = py + CELL / 2
      const s = CELL * 0.46 * pulse
      g.fillStyle(color, 0.2 * pulse)
      g.fillCircle(cx, cy, CELL * 0.82)
      g.lineStyle(1, 0xffffff, 0.32)
      g.strokeCircle(cx, cy, CELL * 0.36)
      g.fillStyle(color, 0.95)
      if (this.powerup.type === 'shield') {
        g.fillRect(cx - s * 0.44, cy - s * 0.45, s * 0.88, s * 0.58)
        g.fillTriangle(
          cx - s * 0.44,
          cy + s * 0.12,
          cx + s * 0.44,
          cy + s * 0.12,
          cx,
          cy + s * 0.56,
        )
      } else if (this.powerup.type === 'slow') {
        g.fillCircle(cx, cy, s * 0.38)
        g.lineStyle(2, color, 0.95)
        g.beginPath()
        g.moveTo(cx, cy)
        g.lineTo(cx, cy - s * 0.3)
        g.moveTo(cx, cy)
        g.lineTo(cx + s * 0.22, cy)
        g.strokePath()
      } else if (this.powerup.type === 'ghost') {
        g.fillCircle(cx, cy - s * 0.08, s * 0.35)
        g.fillRect(cx - s * 0.35, cy - s * 0.08, s * 0.7, s * 0.43)
        g.fillStyle(0x111111, 0.85)
        g.fillRect(cx - s * 0.18, cy - s * 0.02, s * 0.09, s * 0.09)
        g.fillRect(cx + s * 0.09, cy - s * 0.02, s * 0.09, s * 0.09)
      } else {
        g.fillRect(cx - s * 0.34, cy - s * 0.34, s * 0.68, s * 0.68)
        g.fillStyle(0xfff0b0, 0.95)
        g.fillRect(cx - 1, cy - 1, 2, 2)
      }
      const glyph =
        this.powerup.type === 'shield'
          ? ['00100', '01110', '11111', '01110', '00100']
          : this.powerup.type === 'slow'
            ? ['01110', '10011', '10101', '11001', '01110']
            : this.powerup.type === 'ghost'
              ? ['01110', '10101', '11111', '10101', '10101']
              : ['11111', '10001', '10101', '10001', '11111']
      this.drawPixelGlyph(g, cx, cy, glyph, 0xf6fbff, 0.9)
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
        g.lineStyle(2, 0xf8d845, 0.9)
        g.strokeCircle(ix + CELL / 2, iy + CELL / 2, s * 0.62)
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
      const glyph = isBeacon
        ? ['00100', '01110', '11111', '01110', '00100']
        : isRiftBattery
          ? ['00100', '01110', '11111', '01110', '00100']
          : ['10101', '01010', '10101', '01010', '10101']
      this.drawPixelGlyph(g, ix + CELL / 2, iy + CELL / 2, glyph, 0xf4f8ff, 0.9)
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
        const bossHead = 0xfff066
        const bossBody = 0xbd6a13
        const color =
          enemy.kind === 'boss'
            ? i === 0
              ? bossHead
              : bossBody
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
          g.fillRect(segment.x * CELL + 1, segment.y * CELL + 1, CELL - 2, CELL - 2)
          g.lineStyle(1, 0xffffff, 0.55)
          g.strokeRect(segment.x * CELL + 1, segment.y * CELL + 1, CELL - 2, CELL - 2)
          g.fillStyle(0x000000)
          g.fillCircle(segment.x * CELL + 5, segment.y * CELL + 5, 2)
          g.fillCircle(segment.x * CELL + CELL - 5, segment.y * CELL + 5, 2)
          if (enemy.kind === 'boss') {
            for (let hp = 0; hp < enemy.health; hp += 1) {
              g.fillStyle(0xffcc55, 0.9)
              g.fillRect(segment.x * CELL + 3 + hp * 5, segment.y * CELL - 3, 4, 2)
            }
          }
        } else {
          const pad = Math.min(5, Math.max(1, i * 0.2))
          g.fillRect(segment.x * CELL + pad, segment.y * CELL + pad, CELL - pad * 2, CELL - pad * 2)
          g.fillStyle(0xffffff, 0.12)
          g.fillRect(segment.x * CELL + pad, segment.y * CELL + pad, CELL - pad * 2, 1)
        }
      }
    }

    for (const [i, segment] of this.snake.entries()) {
      if (i === 0) {
        g.fillStyle(COLORS.snakeHead)
        g.fillRect(segment.x * CELL + 1, segment.y * CELL + 1, CELL - 2, CELL - 2)
        g.lineStyle(1, 0xffffff, 0.45)
        g.strokeRect(segment.x * CELL + 1, segment.y * CELL + 1, CELL - 2, CELL - 2)
        g.fillStyle(COLORS.snakeHead, 0.15)
        g.fillRect(segment.x * CELL - 2, segment.y * CELL - 2, CELL + 4, CELL + 4)
        const eyeOffsetX = this.currentDir.x === 1 ? 5 : this.currentDir.x === -1 ? -5 : 0
        const eyeOffsetY = this.currentDir.y === 1 ? 5 : this.currentDir.y === -1 ? -5 : 0
        const eyeBaseX = segment.x * CELL + CELL / 2 + eyeOffsetX * 0.35
        const eyeBaseY = segment.y * CELL + CELL / 2 + eyeOffsetY * 0.35
        g.fillStyle(0x03130e, 0.9)
        g.fillCircle(eyeBaseX - 3, eyeBaseY - 2, 1.6)
        g.fillCircle(eyeBaseX + 3, eyeBaseY - 2, 1.6)
        if (this.shields > 0) {
          g.lineStyle(2, COLORS.shield, 0.8)
          g.strokeRect(segment.x * CELL - 2, segment.y * CELL - 2, CELL + 4, CELL + 4)
        }
        continue
      }
      const alpha = Math.max(0.3, 1 - i * 0.025)
      const pad = Math.min(4, 1 + i * 0.12)
      g.fillStyle(COLORS.snake, alpha)
      g.fillRect(segment.x * CELL + pad, segment.y * CELL + pad, CELL - pad * 2, CELL - pad * 2)
      g.fillStyle(0xffffff, 0.08)
      g.fillRect(segment.x * CELL + pad, segment.y * CELL + pad, CELL - pad * 2, 1)
    }

    for (const particle of this.particles) {
      g.fillStyle(particle.color, particle.life)
      g.fillCircle(particle.x, particle.y, particle.size * particle.life)
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
      g.lineStyle(1, 0xdba9ff, 0.35)
      g.beginPath()
      g.moveTo(insetPx, insetPx)
      g.lineTo(insetPx + safeWidth, insetPx + safeHeight)
      g.moveTo(insetPx + safeWidth, insetPx)
      g.lineTo(insetPx, insetPx + safeHeight)
      g.strokePath()
    }

    for (let i = 0; i < this.shields; i += 1) {
      g.fillStyle(COLORS.shield, 0.8)
      g.fillCircle(12 + i * 17, HEIGHT - 12, 6)
      g.lineStyle(1, 0xffffff, 0.4)
      g.strokeCircle(12 + i * 17, HEIGHT - 12, 6)
    }
    for (let i = 0; i < this.ghostCharges; i += 1) {
      g.fillStyle(0xaaaaff, 0.6)
      g.fillCircle(12 + i * 17, HEIGHT - 28, 4)
    }
  }
}
