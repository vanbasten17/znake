import Phaser from 'phaser'
import styles from '../../styles/deathOverlay.module.css'
import { STORAGE_KEYS } from '../core/constants'
import { applyRunGoalProgress, calculateRunRewardBreakdown, saveProfile } from '../core/meta'
import { rollRunObjectiveOffset } from '../core/objectives'
import { gameState, playerProfile, setPlayerProfile } from '../core/state'
import type { Upgrade } from '../core/types'
import { getControlMode } from '../systems/controlScheme'
import {
  getMoveHintText,
  getRestartHintText,
  getStartHintText,
  setHintText,
  setSceneChrome,
} from '../systems/domHud'
import { emitFeedback } from '../systems/feedback'
import { t } from '../systems/i18n'
import { resetVirtualInput } from '../systems/input'
import { transitionToScene } from '../systems/sceneFlow'
import { trackRetentionEvent } from '../systems/telemetry'

type DeathData = {
  score?: number
  deathReason?: string
  timeAliveMs?: number
}

type DeathOverlayData = {
  best: number
  score: number
  reward: number
  totalCurrency: number
}

export class DeathScene extends Phaser.Scene {
  private waiting = true
  private overlayRoot: HTMLDivElement | null = null

  public constructor() {
    super('Death')
  }

  public create(data: DeathData): void {
    setSceneChrome('run')
    this.waiting = true
    resetVirtualInput()

    const score = data.score ?? 0
    const deathReason = data.deathReason ?? 'unknown'
    const timeAliveMs = Math.max(0, Math.floor(data.timeAliveMs ?? 0))
    const rewardBreakdown = calculateRunRewardBreakdown(score, gameState.kills, gameState.floor)
    const reward = rewardBreakdown.finalReward

    const profileAfterRun = {
      ...playerProfile,
      currency: playerProfile.currency + reward,
      lifetimeStats: {
        ...playerProfile.lifetimeStats,
        totalScore: playerProfile.lifetimeStats.totalScore + score,
        totalKills: playerProfile.lifetimeStats.totalKills + gameState.kills,
        eliteKills: playerProfile.lifetimeStats.eliteKills + gameState.eliteKills,
        bestFloor: Math.max(playerProfile.lifetimeStats.bestFloor, gameState.floor),
      },
    }
    const goalProgressResult = applyRunGoalProgress(profileAfterRun, {
      floorReached: gameState.floor,
      eliteKills: gameState.eliteKills,
    })
    setPlayerProfile(goalProgressResult.profile)
    saveProfile(goalProgressResult.profile)

    trackRetentionEvent('run_reward_breakdown', {
      scorePart: rewardBreakdown.scorePart,
      killPart: rewardBreakdown.killPart,
      floorPart: rewardBreakdown.floorPart,
      baseReward: rewardBreakdown.baseReward,
      finalReward: rewardBreakdown.finalReward,
      floor: gameState.floor,
      kills: gameState.kills,
      score,
    })
    for (const transition of goalProgressResult.transitions) {
      trackRetentionEvent('goal_progressed', {
        goalId: transition.goalId,
        from: transition.from,
        to: transition.to,
        target: transition.target,
        claimed: transition.claimed,
        source: 'run_end',
      })
    }

    trackRetentionEvent('run_end', {
      score,
      kills: gameState.kills,
      floor: gameState.floor,
      reward,
      currencyTotal: goalProgressResult.profile.currency,
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

    this.mountOverlay({
      best,
      score,
      reward,
      totalCurrency: goalProgressResult.profile.currency,
    })

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (event.code === 'Enter' || event.code === 'Space' || event.code === 'KeyN') {
        this.restart()
      }
      if (event.code === 'KeyM') {
        this.backToMenu()
      }
    })
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.teardownOverlay()
      this.input.keyboard?.removeAllListeners()
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

  private mountOverlay(data: DeathOverlayData): void {
    this.teardownOverlay()
    const gameArea = document.getElementById('game-area')
    if (!gameArea) {
      return
    }

    const root = document.createElement('div')
    root.className = styles.overlay

    const title = document.createElement('h2')
    title.className = styles.title
    title.textContent = t('death.title')
    root.append(title)

    const score = document.createElement('p')
    score.className = styles.score
    score.textContent = t('death.score', { score: data.score })
    root.append(score)

    const meta = document.createElement('div')
    meta.className = styles.meta
    root.append(meta)
    meta.append(this.line(t('death.finalFloor', { floor: gameState.floor })))
    meta.append(this.line(t('death.enemiesDefeated', { kills: gameState.kills })))
    meta.append(this.line(t('death.best', { best: data.best }), styles.lineMuted))
    meta.append(this.line(t('death.runReward', { reward: data.reward }), styles.lineReward))
    meta.append(
      this.line(t('death.totalCurrency', { currency: data.totalCurrency }), styles.lineCurrency),
    )

    if (data.score >= data.best && data.score > 0) {
      const record = document.createElement('p')
      record.className = styles.newRecord
      record.textContent = t('death.newRecord')
      root.append(record)
    }

    this.renderUpgrades(root, gameState.persistentUpgrades)

    const actions = document.createElement('div')
    actions.className = styles.actions
    root.append(actions)

    const nextButton = document.createElement('button')
    nextButton.type = 'button'
    nextButton.className = `${styles.action} ${styles.actionPrimary}`
    nextButton.textContent = t('death.nextRun')
    nextButton.addEventListener('click', () => this.restart())
    actions.append(nextButton)

    const menuButton = document.createElement('button')
    menuButton.type = 'button'
    menuButton.className = styles.action
    menuButton.textContent = t('death.mainMenu')
    menuButton.addEventListener('click', () => this.backToMenu())
    actions.append(menuButton)

    gameArea.append(root)
    this.overlayRoot = root
  }

  private line(text: string, className?: string): HTMLParagraphElement {
    const p = document.createElement('p')
    p.className = className ? `${styles.line} ${className}` : styles.line
    p.textContent = text
    return p
  }

  private renderUpgrades(root: HTMLDivElement, upgrades: Upgrade[]): void {
    if (upgrades.length === 0) {
      return
    }
    const title = document.createElement('p')
    title.className = styles.upgradesTitle
    title.textContent = t('death.upgradesEarned')
    root.append(title)

    const list = document.createElement('div')
    list.className = styles.upgrades
    root.append(list)

    let rendered = 0
    for (const upgrade of upgrades) {
      if (rendered >= 5) {
        break
      }
      const row = document.createElement('p')
      row.className = styles.upgrade
      const upgradeName = t(`upgrade.${upgrade.id}_name`, { defaultValue: upgrade.name })
      row.textContent = `${upgrade.icon} ${upgradeName}`
      list.append(row)
      rendered += 1
    }
  }

  private teardownOverlay(): void {
    if (this.overlayRoot) {
      this.overlayRoot.remove()
      this.overlayRoot = null
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
    gameState.eliteKills = 0
    gameState.floor = 1
    gameState.currentRunSeed = null
    gameState.runObjectiveOffset = rollRunObjectiveOffset()
    gameState.persistentUpgrades = []
    gameState.selectedRelicId = null
    gameState.pendingFloorRoute = null
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
    this.teardownOverlay()
    setHintText(getMoveHintText())
    transitionToScene(this, 'RelicDraft', { chrome: 'run' })
  }

  private backToMenu(): void {
    if (!this.waiting) {
      return
    }
    this.waiting = false
    emitFeedback('tap')
    this.teardownOverlay()
    setHintText(getStartHintText())
    transitionToScene(this, 'Menu', { chrome: 'menu' })
  }
}
