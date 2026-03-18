import Phaser from 'phaser'
import { BALANCE, createBaseRunConfig, getFloorSetup } from '../core/balance'
import { BASE_COLS, BASE_ROWS, CELL, COLORS, HEIGHT, WIDTH } from '../core/constants'
import { applyRelicEffect, applyTalentEffects } from '../core/meta'
import { gameState, playerProfile } from '../core/state'
import type {
  BiomeItem,
  Enemy,
  Food,
  Particle,
  Powerup,
  PowerupType,
  RunConfig,
  SnakeSegment,
  Vec2,
} from '../core/types'
import { getControlMode } from '../systems/controlScheme'
import { getMoveHintText, getRestartHintText, setHintText, updateHud } from '../systems/domHud'
import { trackRetentionEvent } from '../systems/telemetry'

type GameSceneData = {
  score?: number
}

type DeathReason = 'wall' | 'self' | 'enemy' | 'rift'

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
  private foodToNextFloor = 0
  private foodEaten = 0
  private pendingGrowth = 0
  private snake: SnakeSegment[] = []
  private walls = new Set<string>()
  private enemies: Enemy[] = []
  private food: Food | null = null
  private powerup: Powerup | null = null
  private biomeItem: BiomeItem | null = null
  private enemyMoveTimer = 0
  private enemyInterval = 400
  private riftTimer = 0
  private riftCell: Vec2 | null = null
  private stars: Array<{ x: number; y: number; size: number; alpha: number }> = []
  private isBossFloor = false
  private runStartMs = 0
  private isDying = false
  private floorTxt?: Phaser.GameObjects.Text
  private pauseText?: Phaser.GameObjects.Text

  private bgGraphics!: Phaser.GameObjects.Graphics
  private wallGraphics!: Phaser.GameObjects.Graphics
  private gameGraphics!: Phaser.GameObjects.Graphics
  private fxGraphics!: Phaser.GameObjects.Graphics

  public constructor() {
    super('Game')
  }

  public create(data: GameSceneData): void {
    this.score = data.score ?? 0
    this.resetLocalState()
    this.runStartMs = this.time.now
    this.isDying = false

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
    this.foodToNextFloor = floorSetup.foodToNextFloor
    this.enemyInterval = floorSetup.enemyIntervalMs
    this.isBossFloor = gameState.floor % BALANCE.biome.boss.floorInterval === 0

    this.bgGraphics = this.add.graphics()
    this.wallGraphics = this.add.graphics()
    this.gameGraphics = this.add.graphics()
    this.fxGraphics = this.add.graphics()

    this.walls = this.generateWalls()
    this.snake = this.spawnSnake()
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

    this.floorTxt = this.add
      .text(WIDTH - 6, 6, '', {
        font: '9px Share Tech Mono',
        color: '#334455',
      })
      .setOrigin(1, 0)

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const dir = directionMap[event.code]
      if (dir) {
        this.pushDirection(dir)
      }
      if (event.code === 'Space') {
        this.togglePause()
      }
    })

    this.drawBackground()
    this.drawWalls()
    updateHud(this.score)
    setHintText(getMoveHintText())
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

    if (this.paused) {
      return
    }

    const dt = delta / 1000
    this.updateCameraShake(dt)
    this.updateEnemyMovement(delta)
    this.updateVoidRift(delta)
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
    if (this.floorTxt) {
      const bossTag = this.isBossFloor ? ' - BOSS' : ''
      this.floorTxt.setText(
        `${BALANCE.biome.name} - FLOOR ${gameState.floor}${bossTag} - ${this.foodEaten}/${this.foodToNextFloor}`,
      )
    }

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
    this.foodEaten = 0
    this.pendingGrowth = 0
    this.enemyMoveTimer = 0
    this.riftTimer = 0
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

  private togglePause(): void {
    this.paused = !this.paused
    if (this.paused) {
      this.pauseText = this.add
        .text(WIDTH / 2, HEIGHT / 2, 'PAUSED', {
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
        if (enemy.kind === 'stalker' && Math.random() < 1 - BALANCE.biome.stalker.speedMultiplier) {
          this.moveEnemy(enemy)
        }
      }
    }
  }

  private updateVoidRift(delta: number): void {
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
    const dx = head.x - this.food.x
    const dy = head.y - this.food.y
    if (Math.abs(dx) + Math.abs(dy) > 4) {
      return
    }
    if (dx > 0 && !this.isWall(this.food.x + 1, this.food.y)) {
      this.food.x += 1
    } else if (dx < 0 && !this.isWall(this.food.x - 1, this.food.y)) {
      this.food.x -= 1
    } else if (dy > 0 && !this.isWall(this.food.x, this.food.y + 1)) {
      this.food.y += 1
    } else if (dy < 0 && !this.isWall(this.food.x, this.food.y - 1)) {
      this.food.y -= 1
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
    if (x < 0 || x >= BASE_COLS || y < 0 || y >= BASE_ROWS) {
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
    return !this.enemies.some((enemy) =>
      enemy.body.some((segment) => segment.x === x && segment.y === y),
    )
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

  private spawnBiomeItem(): void {
    const canSpawn = gameState.floor >= BALANCE.biome.coreItem.spawnFloor && !this.biomeItem
    if (!canSpawn) {
      return
    }
    if (Math.random() >= BALANCE.biome.coreItem.spawnChanceOnFood) {
      return
    }
    const cell = this.pickOpenCell()
    this.biomeItem = { x: cell.x, y: cell.y, pulse: 0 }
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
    const len =
      kind === 'boss'
        ? BALANCE.biome.boss.length
        : Math.max(2, kind === 'stalker' ? randomLen + 1 : randomLen)
    const body = Array.from({ length: len }, (_, i) => ({ x: Math.max(0, x - i), y }))
    const resolvedKind =
      kind === 'normal' &&
      gameState.floor >= BALANCE.biome.stalker.unlockFloor &&
      Math.random() < BALANCE.biome.stalker.spawnChance
        ? 'stalker'
        : kind
    this.enemies.push({
      body,
      dir: { x: 1, y: 0 },
      alive: true,
      kind: resolvedKind,
      health: resolvedKind === 'boss' ? BALANCE.biome.boss.health : 1,
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
    const preferred = [...dirs].sort((a, b) => {
      const sa = a.x * Math.sign(dx) + a.y * Math.sign(dy)
      const sb = b.x * Math.sign(dx) + b.y * Math.sign(dy)
      const randomness = enemy.kind === 'stalker' ? 0 : (Math.random() - 0.5) * 0.5
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

      enemy.dir = dir
      enemy.body.unshift({ x: nx, y: ny })
      if (this.food && nx === this.food.x && ny === this.food.y) {
        this.spawnFood()
      } else {
        enemy.body.pop()
      }
      break
    }
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
      this.score += Math.floor(BALANCE.biome.boss.scoreOnDefeat * this.cfg.scoreMult)
    } else if (enemy.kind === 'stalker') {
      this.score += Math.floor(BALANCE.biome.stalker.scoreOnKill * this.cfg.scoreMult)
    } else {
      this.score += Math.floor(BALANCE.enemy.scoreOnKill * this.cfg.scoreMult)
    }
    updateHud(this.score)
  }

  private spawnParticles(cx: number, cy: number, color: number, count: number): void {
    for (let i = 0; i < count; i += 1) {
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

    if (this.food && nx === this.food.x && ny === this.food.y) {
      this.score += Math.floor(BALANCE.food.scoreOnEat * this.cfg.scoreMult)
      this.foodEaten += 1
      this.pendingGrowth += 1
      this.spawnParticles(nx, ny, COLORS.food, 8)
      this.spawnFood()
      if (Math.random() < BALANCE.spawn.powerupOnFoodChance) {
        this.spawnPowerup()
      }
      this.spawnBiomeItem()
      updateHud(this.score)
      if (this.foodEaten >= this.foodToNextFloor) {
        this.scene.start('Upgrade', { score: this.score, floor: gameState.floor })
        return
      }
    }

    if (this.powerup && nx === this.powerup.x && ny === this.powerup.y) {
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
      this.score += Math.floor(BALANCE.biome.coreItem.scoreBonus * this.cfg.scoreMult)
      this.pendingGrowth += BALANCE.biome.coreItem.growthBonus
      this.spawnParticles(nx, ny, COLORS.snakeHead, 12)
      this.biomeItem = null
      updateHud(this.score)
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
    if (this.isBossFloor && this.enemies.length === 0) {
      this.foodEaten = this.foodToNextFloor
      this.scene.start('Upgrade', { score: this.score, floor: gameState.floor })
      return
    }

    if (this.pendingGrowth > 0) {
      this.pendingGrowth -= 1
    } else {
      this.snake.pop()
    }
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
      this.scene.start('Death', { score: this.score, deathReason: reason, timeAliveMs }),
    )
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
      g.lineStyle(1, COLORS.wallBright, 0.5)
      g.strokeRect(x * CELL, y * CELL, CELL, CELL)
    }
  }

  private drawFrame(): void {
    const g = this.gameGraphics
    g.clear()

    if (this.flashTimer > 0) {
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
      g.fillStyle(COLORS.foodGlow, 0.15 * pulse)
      g.fillCircle(fx + CELL / 2, fy + CELL / 2, CELL)
      g.fillStyle(COLORS.food, 1)
      const s = CELL * 0.4 * pulse
      g.fillRect(fx + CELL / 2 - s / 2, fy + CELL / 2 - s / 2, s, s)
    }
    if (this.riftCell) {
      const rx = this.riftCell.x * CELL
      const ry = this.riftCell.y * CELL
      g.fillStyle(0x7a2fff, 0.22)
      g.fillCircle(rx + CELL / 2, ry + CELL / 2, CELL * 0.9)
      g.lineStyle(1, 0xaa66ff, 0.8)
      g.strokeCircle(rx + CELL / 2, ry + CELL / 2, CELL * 0.45)
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
      g.fillStyle(color, 0.2 * pulse)
      g.fillCircle(px + CELL / 2, py + CELL / 2, CELL * 0.8)
      g.fillStyle(color, 0.9)
      const s = CELL * 0.45 * pulse
      g.fillTriangle(
        px + CELL / 2,
        py + CELL / 2 - s / 2,
        px + CELL / 2 - s / 2,
        py + CELL / 2 + s / 2,
        px + CELL / 2 + s / 2,
        py + CELL / 2 + s / 2,
      )
    }
    if (this.biomeItem) {
      const pulse = Math.sin(this.biomeItem.pulse) * 0.3 + 0.7
      const ix = this.biomeItem.x * CELL
      const iy = this.biomeItem.y * CELL
      g.fillStyle(0x7ef2ff, 0.18 * pulse)
      g.fillCircle(ix + CELL / 2, iy + CELL / 2, CELL * 0.95)
      g.fillStyle(0x2affff, 0.95)
      const s = CELL * 0.34 * pulse
      g.fillRect(ix + CELL / 2 - s / 2, iy + CELL / 2 - s / 2, s, s)
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
        const bossHead = 0xfff066
        const bossBody = 0xbd6a13
        const color =
          enemy.kind === 'boss'
            ? i === 0
              ? bossHead
              : bossBody
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
        }
      }
    }

    for (const [i, segment] of this.snake.entries()) {
      if (i === 0) {
        g.fillStyle(COLORS.snakeHead)
        g.fillRect(segment.x * CELL + 1, segment.y * CELL + 1, CELL - 2, CELL - 2)
        g.fillStyle(COLORS.snakeHead, 0.15)
        g.fillRect(segment.x * CELL - 2, segment.y * CELL - 2, CELL + 4, CELL + 4)
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
    }

    for (const particle of this.particles) {
      g.fillStyle(particle.color, particle.life)
      g.fillCircle(particle.x, particle.y, particle.size * particle.life)
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
