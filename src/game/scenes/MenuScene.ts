import Phaser from 'phaser'
import { BASE_COLS, BASE_ROWS, CELL, COLORS, HEIGHT, STORAGE_KEYS, WIDTH } from '../core/constants'
import { gameState } from '../core/state'

export class MenuScene extends Phaser.Scene {
  private waiting = true

  public constructor() {
    super('Menu')
  }

  public create(): void {
    const g = this.add.graphics()
    g.fillStyle(COLORS.bg)
    g.fillRect(0, 0, WIDTH, HEIGHT)
    g.lineStyle(1, COLORS.grid, 0.3)
    for (let x = 0; x <= BASE_COLS; x += 1) {
      g.moveTo(x * CELL, 0)
      g.lineTo(x * CELL, HEIGHT)
    }
    for (let y = 0; y <= BASE_ROWS; y += 1) {
      g.moveTo(0, y * CELL)
      g.lineTo(WIDTH, y * CELL)
    }
    g.strokePath()

    this.add
      .text(WIDTH / 2, 92, 'ZNAKE', {
        font: '900 52px Orbitron',
        color: '#00ff88',
      })
      .setOrigin(0.5)
    this.add
      .text(WIDTH / 2, 155, '- ROGUELITE -', {
        font: '11px Share Tech Mono',
        color: '#444466',
      })
      .setOrigin(0.5)

    const best = Number.parseInt(
      localStorage.getItem(STORAGE_KEYS.bestScore) ??
        localStorage.getItem(STORAGE_KEYS.legacyBestScore) ??
        '0',
      10,
    )
    this.add
      .text(WIDTH / 2, 185, `BEST SCORE: ${best}`, {
        font: '11px Share Tech Mono',
        color: '#333355',
      })
      .setOrigin(0.5)

    const startTxt = this.add
      .text(WIDTH / 2, 230, 'PRESS START >', {
        font: '14px Share Tech Mono',
        color: '#00ff88',
      })
      .setOrigin(0.5)
    this.tweens.add({
      targets: startTxt,
      alpha: 0.2,
      duration: 700,
      yoyo: true,
      repeat: -1,
    })

    this.add
      .text(WIDTH / 2, 270, 'EAT - SLAY ENEMIES - PICK UPGRADES', {
        font: '9px Share Tech Mono',
        color: '#222244',
      })
      .setOrigin(0.5)
    this.add
      .text(WIDTH / 2, 290, 'AVOID WALLS AND YOUR OWN TAIL', {
        font: '9px Share Tech Mono',
        color: '#222244',
      })
      .setOrigin(0.5)

    this.input.keyboard?.once('keydown-ENTER', () => this.startRun())
    this.input.keyboard?.once('keydown-SPACE', () => this.startRun())
  }

  public update(): void {
    if (!this.waiting) {
      return
    }
    if (window.virtualInput.start) {
      window.virtualInput.start = false
      this.startRun()
    }
  }

  private startRun(): void {
    this.waiting = false
    gameState.run = 1
    gameState.totalScore = 0
    gameState.kills = 0
    gameState.floor = 1
    gameState.persistentUpgrades = []
    this.scene.start('Game')
  }
}
