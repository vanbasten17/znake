import Phaser from 'phaser'
import { CELL, COLORS, HEIGHT, WIDTH } from '../core/constants'
import { drawRelicDraft } from '../core/meta'
import { gameState } from '../core/state'
import type { RelicDefinition } from '../core/types'
import { getUpgradeHintText, setHintText } from '../systems/domHud'
import { t } from '../systems/i18n'
import { trackRetentionEvent } from '../systems/telemetry'

export class RelicDraftScene extends Phaser.Scene {
  private choices: RelicDefinition[] = []
  private picked = false

  public constructor() {
    super('RelicDraft')
  }

  public create(): void {
    this.picked = false
    this.choices = []
    this.input.keyboard?.removeAllListeners()
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.removeAllListeners()
    })

    const g = this.add.graphics()
    g.fillStyle(COLORS.bg)
    g.fillRect(0, 0, WIDTH, HEIGHT)
    g.lineStyle(1, COLORS.grid, 0.3)
    for (let x = 0; x <= WIDTH / CELL; x += 1) {
      g.moveTo(x * CELL, 0)
      g.lineTo(x * CELL, HEIGHT)
    }
    for (let y = 0; y <= HEIGHT / CELL; y += 1) {
      g.moveTo(0, y * CELL)
      g.lineTo(WIDTH, y * CELL)
    }
    g.strokePath()

    this.add
      .text(WIDTH / 2, 24, t('relic.selectTitle'), {
        font: '700 20px Orbitron',
        color: '#00ff88',
      })
      .setOrigin(0.5)

    this.choices = drawRelicDraft()
    for (const [index, relic] of this.choices.entries()) {
      this.renderRelicCard(relic, index)
    }

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (event.code === 'Digit1' || event.code === 'Numpad1') {
        this.pick(this.choices[0])
      }
      if (event.code === 'Digit2' || event.code === 'Numpad2') {
        this.pick(this.choices[1])
      }
      if (event.code === 'Digit3' || event.code === 'Numpad3') {
        this.pick(this.choices[2])
      }
    })

    setHintText(getUpgradeHintText())
  }

  private renderRelicCard(relic: RelicDefinition, index: number): void {
    const cardX = 10
    const cardY = 62 + index * 82
    const width = WIDTH - 20
    const height = 72

    const card = this.add.graphics()
    const draw = (hovered: boolean): void => {
      card.clear()
      card.fillStyle(0x0a0a18)
      card.fillRoundedRect(cardX, cardY, width, height, 8)
      card.lineStyle(2, hovered ? 0x00ffaa : 0x335577, hovered ? 1 : 0.7)
      card.strokeRoundedRect(cardX, cardY, width, height, 8)
    }
    draw(false)

    this.add
      .text(cardX + 16, cardY + 14, `${index + 1}`, {
        font: '700 14px Orbitron',
        color: '#00ffaa',
      })
      .setOrigin(0, 0)

    const relicName = t(`relic.${relic.id}_name`, { defaultValue: relic.name })
    const relicDescription = t(`relic.${relic.id}_description`, {
      defaultValue: relic.description,
    })

    this.add
      .text(cardX + 44, cardY + 14, relicName, {
        font: '700 12px Orbitron',
        color: '#99ffcc',
      })
      .setOrigin(0, 0)

    this.add
      .text(cardX + 44, cardY + 36, relicDescription, {
        font: '10px Share Tech Mono',
        color: '#88aabb',
      })
      .setOrigin(0, 0)

    const zone = this.add.zone(cardX, cardY, width, height).setOrigin(0).setInteractive()
    zone.on('pointerover', () => draw(true))
    zone.on('pointerout', () => draw(false))
    zone.on('pointerdown', () => this.pick(relic))
  }

  private pick(relic: RelicDefinition | undefined): void {
    if (!relic || this.picked) {
      return
    }
    this.picked = true
    gameState.selectedRelicId = relic.id
    trackRetentionEvent('relic_picked', {
      relicId: relic.id,
      run: gameState.run,
    })
    this.scene.start('Game')
  }
}
