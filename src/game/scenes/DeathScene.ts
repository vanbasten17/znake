import Phaser from 'phaser'
import { COLORS, HEIGHT, STORAGE_KEYS, WIDTH } from '../core/constants'
import { calculateRunReward, saveProfile } from '../core/meta'
import { gameState, playerProfile } from '../core/state'
import type { Upgrade } from '../core/types'
import { getControlMode } from '../systems/controlScheme'
import {
  getMoveHintText,
  getRestartHintText,
  getStartHintText,
  setHintText,
} from '../systems/domHud'
import { emitFeedback } from '../systems/feedback'
import { t } from '../systems/i18n'
import { trackRetentionEvent } from '../systems/telemetry'

type DeathData = {
  score?: number
  deathReason?: string
  timeAliveMs?: number
}

export class DeathScene extends Phaser.Scene {
  private waiting = true
  private nextZone?: Phaser.GameObjects.Zone
  private menuZone?: Phaser.GameObjects.Zone

  public constructor() {
    super('Death')
  }

  public create(data: DeathData): void {
    this.waiting = true
    window.virtualInput.start = false
    window.virtualInput.pause = false
    window.virtualInput.dir = null

    const score = data.score ?? 0
    const deathReason = data.deathReason ?? 'unknown'
    const timeAliveMs = Math.max(0, Math.floor(data.timeAliveMs ?? 0))
    const reward = calculateRunReward(score, gameState.kills, gameState.floor)
    playerProfile.currency += reward
    playerProfile.lifetimeStats.totalScore += score
    playerProfile.lifetimeStats.totalKills += gameState.kills
    playerProfile.lifetimeStats.bestFloor = Math.max(
      playerProfile.lifetimeStats.bestFloor,
      gameState.floor,
    )
    saveProfile(playerProfile)
    trackRetentionEvent('run_end', {
      score,
      kills: gameState.kills,
      floor: gameState.floor,
      reward,
      currencyTotal: playerProfile.currency,
      deathReason,
      timeAliveMs,
      inputMode: getControlMode(),
    })

    const best = Math.max(
      score,
      Number.parseInt(
        localStorage.getItem(STORAGE_KEYS.bestScore) ??
          localStorage.getItem(STORAGE_KEYS.legacyBestScore) ??
          '0',
        10,
      ),
    )
    localStorage.setItem(STORAGE_KEYS.bestScore, String(best))

    const g = this.add.graphics()
    g.fillStyle(0x000000)
    g.fillRect(0, 0, WIDTH, HEIGHT)

    this.add
      .text(WIDTH / 2, 50, t('death.title'), {
        font: '700 18px Orbitron',
        color: '#ff4466',
      })
      .setOrigin(0.5)
    this.add
      .text(WIDTH / 2, 95, t('death.score', { score }), {
        font: '700 20px Orbitron',
        color: '#ffffff',
      })
      .setOrigin(0.5)
    this.add
      .text(WIDTH / 2, 125, t('death.finalFloor', { floor: gameState.floor }), {
        font: '13px Share Tech Mono',
        color: '#556677',
      })
      .setOrigin(0.5)
    this.add
      .text(WIDTH / 2, 148, t('death.enemiesDefeated', { kills: gameState.kills }), {
        font: '13px Share Tech Mono',
        color: '#556677',
      })
      .setOrigin(0.5)
    this.add
      .text(WIDTH / 2, 170, t('death.best', { best }), {
        font: '13px Share Tech Mono',
        color: '#334455',
      })
      .setOrigin(0.5)
    this.add
      .text(WIDTH / 2, 193, t('death.runReward', { reward }), {
        font: '12px Share Tech Mono',
        color: '#99ffcc',
      })
      .setOrigin(0.5)
    this.add
      .text(WIDTH / 2, 208, t('death.totalCurrency', { currency: playerProfile.currency }), {
        font: '11px Share Tech Mono',
        color: '#88aabb',
      })
      .setOrigin(0.5)

    if (score >= best && score > 0) {
      this.add
        .text(WIDTH / 2, 223, t('death.newRecord'), {
          font: '12px Share Tech Mono',
          color: '#ffdd00',
        })
        .setOrigin(0.5)
    }

    this.renderUpgrades(gameState.persistentUpgrades)

    const nextText = this.add
      .text(WIDTH / 2 - 78, HEIGHT - 22, t('death.nextRun'), {
        font: '12px Share Tech Mono',
        color: '#00ff88',
      })
      .setOrigin(0.5)
    const menuText = this.add
      .text(WIDTH / 2 + 78, HEIGHT - 22, t('death.mainMenu'), {
        font: '12px Share Tech Mono',
        color: '#99aabb',
      })
      .setOrigin(0.5)
    this.tweens.add({
      targets: nextText,
      alpha: 0.2,
      duration: 700,
      yoyo: true,
      repeat: -1,
    })

    this.nextZone = this.add
      .zone(WIDTH / 2 - 78 - 46, HEIGHT - 34, 92, 24)
      .setOrigin(0)
      .setInteractive()
    this.nextZone.on('pointerdown', () => this.restart())
    this.nextZone.on('pointerup', () => this.restart())

    this.menuZone = this.add
      .zone(WIDTH / 2 + 78 - 54, HEIGHT - 34, 108, 24)
      .setOrigin(0)
      .setInteractive()
    this.menuZone.on('pointerdown', () => this.backToMenu())
    this.menuZone.on('pointerup', () => this.backToMenu())

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (event.code === 'Enter' || event.code === 'Space') {
        this.restart()
      }
      if (event.code === 'KeyN') {
        this.restart()
      }
      if (event.code === 'KeyM') {
        this.backToMenu()
      }
    })
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.removeAllListeners()
      this.nextZone?.removeAllListeners()
      this.menuZone?.removeAllListeners()
      this.nextZone = undefined
      this.menuZone = undefined
    })

    setHintText(getRestartHintText())
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
      .text(WIDTH / 2, y, t('death.upgradesEarned'), {
        font: '9px Share Tech Mono',
        color: '#334455',
      })
      .setOrigin(0.5)
    y += 16

    for (const upgrade of upgrades) {
      const upgradeName = t(`upgrade.${upgrade.id}_name`, { defaultValue: upgrade.name })
      this.add
        .text(WIDTH / 2, y, `${upgrade.icon} ${upgradeName}`, {
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
    if (!this.waiting) {
      return
    }
    this.waiting = false
    emitFeedback('confirm')
    gameState.run += 1
    gameState.kills = 0
    gameState.floor = 1
    gameState.persistentUpgrades = []
    gameState.selectedRelicId = null
    playerProfile.lifetimeStats.runsPlayed += 1
    saveProfile(playerProfile)
    trackRetentionEvent('run_start', {
      source: 'death_restart',
      currency: playerProfile.currency,
      unlockedTalents: playerProfile.unlockedTalents.length,
    })
    trackRetentionEvent('input_mode', {
      mode: getControlMode(),
      source: 'run_start_death_restart',
      run: gameState.run,
    })
    setHintText(getMoveHintText())
    this.scene.start('RelicDraft')
  }

  private backToMenu(): void {
    if (!this.waiting) {
      return
    }
    this.waiting = false
    emitFeedback('tap')
    setHintText(getStartHintText())
    this.scene.start('Menu')
  }
}
