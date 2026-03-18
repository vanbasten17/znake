import Phaser from 'phaser'
import { BASE_COLS, BASE_ROWS, CELL, COLORS, HEIGHT, STORAGE_KEYS, WIDTH } from '../core/constants'
import { TALENT_TREE, saveProfile, unlockTalent } from '../core/meta'
import { gameState, playerProfile, setPlayerProfile } from '../core/state'
import { trackRetentionEvent } from '../systems/telemetry'

export class MenuScene extends Phaser.Scene {
  private waiting = true
  private currencyText?: Phaser.GameObjects.Text
  private talentRowRefreshers: Array<() => void> = []

  public constructor() {
    super('Menu')
  }

  public create(): void {
    this.waiting = true
    this.talentRowRefreshers = []

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
      .text(WIDTH / 2, 22, 'ZNAKE', {
        font: '900 30px Orbitron',
        color: '#00ff88',
      })
      .setOrigin(0.5)
    this.add
      .text(WIDTH / 2, 48, '- ROGUELITE -', {
        font: '10px Share Tech Mono',
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
      .text(WIDTH / 2, 66, `BEST SCORE: ${best}`, {
        font: '10px Share Tech Mono',
        color: '#8899aa',
      })
      .setOrigin(0.5)

    this.currencyText = this.add
      .text(WIDTH / 2, 84, '', {
        font: '11px Share Tech Mono',
        color: '#99ffcc',
      })
      .setOrigin(0.5)

    this.add
      .text(WIDTH / 2, 101, 'TALENT SHOP (TAP OR PRESS 1-6)', {
        font: '9px Share Tech Mono',
        color: '#335577',
      })
      .setOrigin(0.5)

    this.renderTalentShop()
    this.refreshMetaUi()

    const startTxt = this.add
      .text(WIDTH / 2, HEIGHT - 22, 'PRESS START > RELIC DRAFT', {
        font: '12px Share Tech Mono',
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

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => this.onKeyDown(event))
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.removeAllListeners()
    })
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

  private renderTalentShop(): void {
    const startY = 112
    const rowHeight = 24
    for (const [index, talent] of TALENT_TREE.entries()) {
      const y = startY + index * rowHeight
      const row = this.add.graphics()
      const titleText = this.add.text(18, y + 6, '', {
        font: '9px Share Tech Mono',
        color: '#aaccdd',
      })
      const statusText = this.add.text(WIDTH - 18, y + 6, '', {
        font: '9px Share Tech Mono',
        color: '#88aabb',
      })
      statusText.setOrigin(1, 0)

      const refresh = (): void => {
        const unlocked = playerProfile.unlockedTalents.includes(talent.id)
        const prereqOk = !talent.requires || playerProfile.unlockedTalents.includes(talent.requires)
        const affordable = playerProfile.currency >= talent.cost
        const actionable = !unlocked && prereqOk && affordable

        row.clear()
        row.fillStyle(actionable ? 0x0b1a16 : 0x0b0b18, 1)
        row.fillRoundedRect(10, y + 2, WIDTH - 20, 18, 5)
        row.lineStyle(1, actionable ? 0x00cc88 : 0x334466, 0.9)
        row.strokeRoundedRect(10, y + 2, WIDTH - 20, 18, 5)

        titleText.setText(`${index + 1}. ${talent.name}`)

        if (unlocked) {
          statusText.setText('UNLOCKED')
          statusText.setColor('#66ffaa')
        } else if (!prereqOk) {
          statusText.setText(`REQ ${talent.requires?.toUpperCase() ?? 'NONE'}`)
          statusText.setColor('#667788')
        } else if (!affordable) {
          statusText.setText(`COST ${talent.cost}`)
          statusText.setColor('#887788')
        } else {
          statusText.setText(`BUY ${talent.cost}`)
          statusText.setColor('#99ffcc')
        }
      }

      const zone = this.add
        .zone(10, y + 2, WIDTH - 20, 18)
        .setOrigin(0)
        .setInteractive()
      zone.on('pointerdown', () => this.tryUnlockByIndex(index))
      zone.on('pointerover', () => {
        row.lineStyle(1, 0x00ffaa, 1)
        row.strokeRoundedRect(10, y + 2, WIDTH - 20, 18, 5)
      })
      zone.on('pointerout', refresh)

      refresh()
      this.talentRowRefreshers.push(refresh)
    }
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Enter' || event.code === 'Space') {
      this.startRun()
      return
    }

    const keyMap: Record<string, number> = {
      Digit1: 0,
      Digit2: 1,
      Digit3: 2,
      Digit4: 3,
      Digit5: 4,
      Digit6: 5,
      Numpad1: 0,
      Numpad2: 1,
      Numpad3: 2,
      Numpad4: 3,
      Numpad5: 4,
      Numpad6: 5,
    }
    const index = keyMap[event.code]
    if (index !== undefined) {
      this.tryUnlockByIndex(index)
    }
  }

  private tryUnlockByIndex(index: number): void {
    const talent = TALENT_TREE[index]
    if (!talent) {
      return
    }
    const result = unlockTalent(playerProfile, talent.id)
    if (!result.ok) {
      trackRetentionEvent('talent_unlock_failed', {
        talentId: talent.id,
        currency: playerProfile.currency,
      })
      this.refreshMetaUi()
      return
    }
    setPlayerProfile(result.profile)
    saveProfile(result.profile)
    trackRetentionEvent('talent_unlocked', {
      talentId: talent.id,
      remainingCurrency: result.profile.currency,
    })
    this.refreshMetaUi()
  }

  private refreshMetaUi(): void {
    if (this.currencyText) {
      this.currencyText.setText(`CURRENCY: ${playerProfile.currency}`)
    }
    for (const refresh of this.talentRowRefreshers) {
      refresh()
    }
  }

  private startRun(): void {
    if (!this.waiting) {
      return
    }
    this.waiting = false
    gameState.run = 1
    gameState.totalScore = 0
    gameState.kills = 0
    gameState.floor = 1
    gameState.persistentUpgrades = []
    gameState.selectedRelicId = null
    playerProfile.lifetimeStats.runsPlayed += 1
    saveProfile(playerProfile)
    trackRetentionEvent('run_start', {
      source: 'menu',
      currency: playerProfile.currency,
      unlockedTalents: playerProfile.unlockedTalents.length,
    })
    this.scene.start('RelicDraft')
  }
}
