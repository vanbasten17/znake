import Phaser from 'phaser'
import { BASE_COLS, BASE_ROWS, CELL, COLORS, HEIGHT, STORAGE_KEYS, WIDTH } from '../core/constants'
import {
  PROGRESSION_GOALS,
  TALENT_TREE,
  claimGoalReward,
  saveProfile,
  unlockTalent,
} from '../core/meta'
import { gameState, playerProfile, setPlayerProfile } from '../core/state'
import type { GoalId } from '../core/types'
import { getControlMode } from '../systems/controlScheme'
import { setSceneChrome } from '../systems/domHud'
import { emitFeedback } from '../systems/feedback'
import { getLanguage, t, toggleLanguage } from '../systems/i18n'
import { trackRetentionEvent } from '../systems/telemetry'

export class MenuScene extends Phaser.Scene {
  private waiting = true
  private currencyValueText?: Phaser.GameObjects.Text
  private goalsTitleText?: Phaser.GameObjects.Text
  private languageText?: Phaser.GameObjects.Text
  private talentRowRefreshers: Array<() => void> = []
  private goalRowRefreshers: Array<() => void> = []

  public constructor() {
    super('Menu')
  }

  public create(): void {
    this.waiting = true
    this.talentRowRefreshers = []
    this.goalRowRefreshers = []
    setSceneChrome('menu')

    const g = this.add.graphics()
    g.fillStyle(0x020918)
    g.fillRect(0, 0, WIDTH, HEIGHT)
    g.fillStyle(0x06132b, 0.4)
    g.fillCircle(WIDTH * 0.74, HEIGHT * 0.24, 100)
    g.fillStyle(0x07102b, 0.35)
    g.fillCircle(WIDTH * 0.2, HEIGHT * 0.86, 120)
    g.lineStyle(1, 0x173b7a, 0.45)
    for (let x = 0; x <= BASE_COLS; x += 1) {
      g.moveTo(x * CELL, 0)
      g.lineTo(x * CELL, HEIGHT)
    }
    for (let y = 0; y <= BASE_ROWS; y += 1) {
      g.moveTo(0, y * CELL)
      g.lineTo(WIDTH, y * CELL)
    }
    g.strokePath()
    g.lineStyle(2, 0x2d4b8d, 0.85)
    g.strokeRect(0, 0, WIDTH, HEIGHT)

    const titleY = Math.round(HEIGHT * 0.03)
    const bestY = Math.round(HEIGHT * 0.125)
    const currencyY = Math.round(HEIGHT * 0.153)
    const shopY = Math.round(HEIGHT * 0.225)
    const ctaY = HEIGHT - Math.max(48, Math.round(HEIGHT * 0.08))

    this.add
      .text(22, titleY, 'ZNAKE', {
        font: '900 48px Orbitron',
        color: '#9dffb7',
        shadow: {
          offsetX: 0,
          offsetY: 0,
          color: '#45ff8a',
          blur: 16,
          fill: true,
        },
      })
      .setOrigin(0, 0)
    this.languageText = this.add
      .text(WIDTH - 10, 10, `${t('menu.language')}: ${getLanguage().toUpperCase()}`, {
        font: '700 11px Share Tech Mono',
        color: '#d3e5ff',
      })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true })
    this.languageText.on('pointerdown', () => {
      void this.switchLanguage()
    })

    const best = Number.parseInt(
      localStorage.getItem(STORAGE_KEYS.bestScore) ??
        localStorage.getItem(STORAGE_KEYS.legacyBestScore) ??
        '0',
      10,
    )
    this.add
      .text(22, bestY, `X ${t('menu.bestScore', { best })}`, {
        font: '700 15px Share Tech Mono',
        color: '#f2f5ff',
      })
      .setOrigin(0, 0.5)

    this.add
      .text(22, currencyY, `© ${t('menu.currency', { value: '' })}`, {
        font: '700 15px Share Tech Mono',
        color: '#f2f5ff',
      })
      .setOrigin(0, 0.5)
    this.currencyValueText = this.add
      .text(182, currencyY, '', {
        font: '700 17px Share Tech Mono',
        color: '#66ff95',
      })
      .setOrigin(0, 0.5)

    this.add
      .text(WIDTH / 2, shopY, t('menu.talentShop'), {
        font: '900 18px Orbitron',
        color: '#b5ffc4',
        shadow: {
          offsetX: 0,
          offsetY: 0,
          color: '#3cff80',
          blur: 8,
          fill: true,
        },
      })
      .setOrigin(0.5)

    const rowsBottomY = this.renderTalentShop(shopY)

    const cta = this.add.graphics()
    const ctaX = 26
    const ctaW = WIDTH - 52
    const ctaH = Math.max(22, Math.round(HEIGHT * 0.035))
    const drawCta = (active: boolean): void => {
      cta.clear()
      cta.fillStyle(0x0a1f32, 1)
      cta.fillRoundedRect(ctaX, ctaY, ctaW, ctaH, 3)
      cta.lineStyle(2, active ? 0x76ff9f : 0x4de58d, 1)
      cta.strokeRoundedRect(ctaX, ctaY, ctaW, ctaH, 3)
      cta.lineStyle(1, 0xa8ffd0, 0.75)
      cta.strokeRoundedRect(ctaX + 3, ctaY + 3, ctaW - 6, ctaH - 6, 2)
    }
    drawCta(false)
    const startTxt = this.add
      .text(WIDTH / 2, ctaY + ctaH / 2, t('menu.startPrompt'), {
        font: '900 11px Orbitron',
        color: '#9dffb8',
      })
      .setOrigin(0.5)
    const startZone = this.add.zone(ctaX, ctaY, ctaW, ctaH).setOrigin(0).setInteractive()
    startZone.on('pointerover', () => drawCta(true))
    startZone.on('pointerout', () => drawCta(false))
    startZone.on('pointerdown', () => this.startRun())

    this.renderGoals(rowsBottomY, ctaY)
    this.refreshMetaUi()

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

  private renderTalentShop(shopY: number): number {
    const startY = shopY + 12
    const rowHeight = Math.max(22, Math.round(HEIGHT * 0.052))
    const rowInnerHeight = rowHeight - 4
    for (const [index, talent] of TALENT_TREE.entries()) {
      const y = startY + index * rowHeight
      const row = this.add.graphics()
      const titleText = this.add.text(23, y + rowInnerHeight / 2 + 2, '', {
        font: '700 9px Share Tech Mono',
        color: '#f5f8ff',
      })
      titleText.setOrigin(0, 0.5)
      const statusText = this.add.text(WIDTH - 23, y + rowInnerHeight / 2 + 2, '', {
        font: '700 9px Share Tech Mono',
        color: '#88aabb',
      })
      statusText.setOrigin(1, 0.5)

      const refresh = (): void => {
        const unlocked = playerProfile.unlockedTalents.includes(talent.id)
        const prereqOk = !talent.requires || playerProfile.unlockedTalents.includes(talent.requires)
        const affordable = playerProfile.currency >= talent.cost
        const actionable = !unlocked && prereqOk && affordable

        row.clear()
        row.fillStyle(0x08162b, 1)
        row.fillRoundedRect(14, y + 2, WIDTH - 28, rowInnerHeight, 3)
        row.lineStyle(2, actionable ? 0x79ffa0 : 0x70efb2, 1)
        row.strokeRoundedRect(14, y + 2, WIDTH - 28, rowInnerHeight, 3)
        row.lineStyle(1, 0xbcffd6, 0.75)
        row.strokeRoundedRect(17, y + 4, WIDTH - 34, Math.max(10, rowInnerHeight - 4), 2)

        titleText.setText(`${index + 1}. ${this.getTalentLabel(talent.id, talent.name)}`)

        if (unlocked) {
          statusText.setText(t('menu.unlocked'))
          statusText.setColor('#73ffa4')
        } else if (!prereqOk) {
          const prereq = TALENT_TREE.find((item) => item.id === talent.requires)
          statusText.setText(
            t('menu.req', {
              value: prereq
                ? this.getTalentLabel(prereq.id, prereq.name)
                : (talent.requires?.toUpperCase() ?? 'NONE'),
            }),
          )
          statusText.setColor('#667788')
        } else if (!affordable) {
          statusText.setText(t('menu.cost', { value: talent.cost }))
          statusText.setColor('#7ceca7')
        } else {
          statusText.setText(t('menu.buy', { value: talent.cost }))
          statusText.setColor('#7ceca7')
        }
      }

      const zone = this.add
        .zone(14, y + 2, WIDTH - 28, rowInnerHeight)
        .setOrigin(0)
        .setInteractive()
      zone.on('pointerdown', () => this.tryUnlockByIndex(index))
      zone.on('pointerover', () => {
        row.lineStyle(2, 0xb9ffd4, 1)
        row.strokeRoundedRect(14, y + 2, WIDTH - 28, rowInnerHeight, 5)
      })
      zone.on('pointerout', refresh)

      refresh()
      this.talentRowRefreshers.push(refresh)
    }
    return startY + TALENT_TREE.length * rowHeight
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Enter' || event.code === 'Space') {
      this.startRun()
      return
    }
    if (event.code === 'KeyL') {
      void this.switchLanguage()
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
    if (this.currencyValueText) {
      this.currencyValueText.setText(String(playerProfile.currency))
    }
    if (this.goalsTitleText) {
      this.goalsTitleText.setText(t('menu.goalsTitle'))
    }
    for (const refresh of this.talentRowRefreshers) {
      refresh()
    }
    for (const refresh of this.goalRowRefreshers) {
      refresh()
    }
  }

  private getTalentLabel(talentId: string, fallbackName: string): string {
    return t(`talent.${talentId}_name`, { defaultValue: fallbackName })
  }

  private async switchLanguage(): Promise<void> {
    if (!this.waiting) {
      return
    }
    emitFeedback('confirm')
    await toggleLanguage()
    this.scene.restart()
  }

  private renderGoals(rowsBottomY: number, ctaY: number): void {
    const available = Math.max(14, ctaY - rowsBottomY - 10)
    const titleScale = Math.max(0.72, Math.min(1, available / 34))
    const rowScale = Math.max(0.68, Math.min(1, available / 30))
    const titleY = rowsBottomY + 5
    this.goalsTitleText = this.add
      .text(WIDTH / 2, titleY, t('menu.goalsTitle'), {
        font: '900 9px Orbitron',
        color: '#9cffb7',
      })
      .setOrigin(0.5)
    this.goalsTitleText.setScale(titleScale)

    for (const [index, goal] of PROGRESSION_GOALS.entries()) {
      const y = titleY + 10 + index * (8 * rowScale)
      const rowText = this.add.text(WIDTH / 2, y, '', {
        font: '700 7px Share Tech Mono',
        color: '#f4f8ff',
      })
      rowText.setOrigin(0.5)
      rowText.setScale(rowScale)

      const rowZone = this.add
        .zone(20, y - 5, WIDTH - 40, 10)
        .setOrigin(0)
        .setInteractive()
      rowZone.on('pointerdown', () => this.tryClaimGoal(goal.id))

      const refresh = (): void => {
        const progress = Math.min(goal.target, playerProfile.goalProgress[goal.id])
        const claimed = playerProfile.claimedGoals[goal.id]
        const ready = !claimed && progress >= goal.target
        const goalLabel = t(`goal.${goal.id}_name`)
        const status = claimed
          ? t('menu.goalClaimed')
          : ready
            ? t('menu.goalReady', { reward: goal.reward })
            : t('menu.goalProgress', { progress, target: goal.target })
        rowText.setText(`${goalLabel} - ${status}`)
        rowText.setColor(claimed ? '#6f88a1' : ready ? '#8cffb2' : '#f4f8ff')
      }

      refresh()
      this.goalRowRefreshers.push(refresh)
    }
  }

  private tryClaimGoal(goalId: GoalId): void {
    const result = claimGoalReward(playerProfile, goalId)
    if (!result.ok) {
      emitFeedback('tap')
      return
    }
    setPlayerProfile(result.profile)
    saveProfile(result.profile)
    emitFeedback('success')
    trackRetentionEvent('goal_claimed', {
      goalId,
      reward: result.reward,
      currencyTotal: result.profile.currency,
    })
    this.refreshMetaUi()
  }

  private startRun(): void {
    if (!this.waiting) {
      return
    }
    this.waiting = false
    emitFeedback('confirm')
    gameState.run = 1
    gameState.totalScore = 0
    gameState.kills = 0
    gameState.eliteKills = 0
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
    trackRetentionEvent('input_mode', {
      mode: getControlMode(),
      source: 'run_start_menu',
      run: gameState.run,
    })
    this.scene.start('RelicDraft')
  }
}
