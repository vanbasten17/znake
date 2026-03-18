import Phaser from 'phaser'
import { COLORS, HEIGHT, STORAGE_KEYS, WIDTH } from '../core/constants'
import { gameState } from '../core/state'
import type { Upgrade } from '../core/types'
import { setHintText } from '../systems/domHud'

type DeathData = {
  score?: number
}

export class DeathScene extends Phaser.Scene {
  private waiting = true

  public constructor() {
    super('Death')
  }

  public create(data: DeathData): void {
    const score = data.score ?? 0
    const best = Math.max(
      score,
      Number.parseInt(localStorage.getItem(STORAGE_KEYS.bestScore) ?? '0', 10),
    )
    localStorage.setItem(STORAGE_KEYS.bestScore, String(best))

    const g = this.add.graphics()
    g.fillStyle(0x000000)
    g.fillRect(0, 0, WIDTH, HEIGHT)

    this.add
      .text(WIDTH / 2, 50, 'THE VOID CLAIMED YOU', {
        font: '700 18px Orbitron',
        color: '#ff4466',
      })
      .setOrigin(0.5)
    this.add
      .text(WIDTH / 2, 95, `SCORE: ${score}`, {
        font: '700 20px Orbitron',
        color: '#ffffff',
      })
      .setOrigin(0.5)
    this.add
      .text(WIDTH / 2, 125, `FINAL FLOOR: ${gameState.floor}`, {
        font: '13px Share Tech Mono',
        color: '#556677',
      })
      .setOrigin(0.5)
    this.add
      .text(WIDTH / 2, 148, `ENEMIES DEFEATED: ${gameState.kills}`, {
        font: '13px Share Tech Mono',
        color: '#556677',
      })
      .setOrigin(0.5)
    this.add
      .text(WIDTH / 2, 170, `BEST: ${best}`, {
        font: '13px Share Tech Mono',
        color: '#334455',
      })
      .setOrigin(0.5)

    if (score >= best && score > 0) {
      this.add
        .text(WIDTH / 2, 193, 'NEW RECORD', {
          font: '12px Share Tech Mono',
          color: '#ffdd00',
        })
        .setOrigin(0.5)
    }

    this.renderUpgrades(gameState.persistentUpgrades)

    const startText = this.add
      .text(WIDTH / 2, HEIGHT - 22, 'PRESS START > NEW RUN', {
        font: '12px Share Tech Mono',
        color: '#00ff88',
      })
      .setOrigin(0.5)
    this.tweens.add({
      targets: startText,
      alpha: 0.2,
      duration: 700,
      yoyo: true,
      repeat: -1,
    })

    this.input.keyboard?.once('keydown-ENTER', () => this.restart())
    this.input.keyboard?.once('keydown-SPACE', () => this.restart())

    setHintText('PRESS START TO PLAY AGAIN')
  }

  public update(): void {
    if (!this.waiting) {
      return
    }
    if (window.virtualInput.start) {
      window.virtualInput.start = false
      this.restart()
    }
  }

  private renderUpgrades(upgrades: Upgrade[]): void {
    if (upgrades.length === 0) {
      return
    }

    let y = 215
    this.add
      .text(WIDTH / 2, y, 'UPGRADES EARNED:', {
        font: '9px Share Tech Mono',
        color: '#334455',
      })
      .setOrigin(0.5)
    y += 16

    for (const upgrade of upgrades) {
      this.add
        .text(WIDTH / 2, y, `${upgrade.icon} ${upgrade.name}`, {
          font: '11px Share Tech Mono',
          color: '#445566',
        })
        .setOrigin(0.5)
      y += 16
      if (y > HEIGHT - 40) {
        break
      }
    }
  }

  private restart(): void {
    this.waiting = false
    gameState.run += 1
    gameState.kills = 0
    gameState.floor = 1
    gameState.persistentUpgrades = []
    setHintText('SWIPE OR D-PAD TO MOVE - PAUSE II')
    this.scene.start('Game')
  }
}
