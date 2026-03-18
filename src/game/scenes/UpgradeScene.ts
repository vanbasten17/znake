import Phaser from 'phaser'
import { BASE_COLS, BASE_ROWS, CELL, HEIGHT, WIDTH } from '../core/constants'
import { gameState } from '../core/state'
import type { Upgrade } from '../core/types'
import { UPGRADE_POOL } from '../core/upgrades'
import { getMoveHintText, getUpgradeHintText, setHintText } from '../systems/domHud'

type UpgradeData = {
  score?: number
  floor?: number
}

export class UpgradeScene extends Phaser.Scene {
  private score = 0
  private floor = 1
  private picked = false

  public constructor() {
    super('Upgrade')
  }

  public create(data: UpgradeData): void {
    this.score = data.score ?? 0
    this.floor = data.floor ?? 1

    const g = this.add.graphics()
    g.fillStyle(0x000000, 0.95)
    g.fillRect(0, 0, WIDTH, HEIGHT)
    g.lineStyle(1, 0x111122, 0.4)
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
      .text(WIDTH / 2, 28, 'FLOOR CLEARED', {
        font: '700 22px Orbitron',
        color: '#00ff88',
      })
      .setOrigin(0.5)
    this.add
      .text(WIDTH / 2, 55, 'CHOOSE ONE UPGRADE', {
        font: '10px Share Tech Mono',
        color: '#334455',
      })
      .setOrigin(0.5)

    const pool = [...UPGRADE_POOL]
    const choices: Upgrade[] = []
    for (let i = 0; i < 3; i += 1) {
      const idx = Math.floor(Math.random() * pool.length)
      const upgrade = pool.splice(idx, 1)[0]
      if (upgrade) {
        choices.push(upgrade)
      }
    }

    for (const [i, upg] of choices.entries()) {
      const cardY = 75 + i * 72
      const cardX = 10
      const cw = WIDTH - 20
      const ch = 65
      const colorHex = `#${upg.color.toString(16).padStart(6, '0')}`

      const card = this.add.graphics()
      const drawCard = (hover: boolean): void => {
        card.clear()
        card.fillStyle(hover ? upg.color : 0x0a0a18, hover ? 0.1 : 1)
        card.fillRoundedRect(cardX, cardY, cw, ch, 6)
        card.lineStyle(2, upg.color, hover ? 1 : 0.5)
        card.strokeRoundedRect(cardX, cardY, cw, ch, 6)
      }
      drawCard(false)

      this.add
        .text(cardX + 30, cardY + ch / 2, upg.icon, {
          font: '700 16px Share Tech Mono',
          color: '#ffffff',
        })
        .setOrigin(0.5)
      this.add
        .text(cardX + 65, cardY + 16, upg.name, {
          font: '700 10px Orbitron',
          color: colorHex,
        })
        .setOrigin(0, 0.5)
      this.add
        .text(cardX + 65, cardY + 36, upg.desc, {
          font: '10px Share Tech Mono',
          color: '#667788',
        })
        .setOrigin(0, 0.5)
      this.add
        .text(cardX + cw - 14, cardY + ch / 2, `${i + 1}`, {
          font: '700 12px Orbitron',
          color: colorHex,
        })
        .setOrigin(0.5)

      const zone = this.add.zone(cardX, cardY, cw, ch).setOrigin(0).setInteractive()
      zone.on('pointerover', () => drawCard(true))
      zone.on('pointerout', () => drawCard(false))
      zone.on('pointerdown', () => this.pick(upg))
    }

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (event.code === 'Digit1' || event.code === 'Numpad1') {
        this.pick(choices[0])
      }
      if (event.code === 'Digit2' || event.code === 'Numpad2') {
        this.pick(choices[1])
      }
      if (event.code === 'Digit3' || event.code === 'Numpad3') {
        this.pick(choices[2])
      }
    })

    this.add
      .text(WIDTH / 2, HEIGHT - 12, `SCORE: ${this.score}  -  FLOOR: ${this.floor}`, {
        font: '9px Share Tech Mono',
        color: '#222244',
      })
      .setOrigin(0.5)

    setHintText(getUpgradeHintText())
  }

  private pick(upgrade: Upgrade | undefined): void {
    if (this.picked || !upgrade) {
      return
    }
    this.picked = true
    gameState.persistentUpgrades.push(upgrade)
    gameState.floor += 1
    setHintText(getMoveHintText())
    this.scene.start('Game', { score: this.score })
  }
}
