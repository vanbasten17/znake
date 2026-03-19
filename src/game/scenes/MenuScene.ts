import Phaser from 'phaser'
import styles from '../../styles/menuOverlay.module.css'
import { STORAGE_KEYS } from '../core/constants'
import {
  PROGRESSION_GOALS,
  TALENT_TREE,
  claimGoalReward,
  saveProfile,
  unlockTalent,
} from '../core/meta'
import { getFloorObjective, rollRunObjectiveOffset } from '../core/objectives'
import { gameState, playerProfile, setPlayerProfile } from '../core/state'
import type { GoalId } from '../core/types'
import { getAccessibilitySettings, updateAccessibilitySettings } from '../systems/accessibility'
import { getControlMode } from '../systems/controlScheme'
import { setSceneChrome } from '../systems/domHud'
import { emitFeedback } from '../systems/feedback'
import { getLanguage, t, toggleLanguage } from '../systems/i18n'
import { resetVirtualInput } from '../systems/input'
import { transitionToScene } from '../systems/sceneFlow'
import { trackRetentionEvent } from '../systems/telemetry'
import { getVoiceAvailability, syncVoiceInput } from '../systems/voiceInput'

export class MenuScene extends Phaser.Scene {
  private waiting = true
  private overlayRoot: HTMLDivElement | null = null
  private currencyValueEl: HTMLSpanElement | null = null
  private goalsTitleEl: HTMLParagraphElement | null = null
  private languageEl: HTMLButtonElement | null = null
  private talentRowRefreshers: Array<() => void> = []
  private goalRowRefreshers: Array<() => void> = []
  private accessibilityRefreshers: Array<() => void> = []

  public constructor() {
    super('Menu')
  }

  public create(): void {
    resetVirtualInput()
    this.waiting = true
    this.talentRowRefreshers = []
    this.goalRowRefreshers = []
    this.accessibilityRefreshers = []
    gameState.runObjectiveOffset = rollRunObjectiveOffset()
    setSceneChrome('menu')
    this.mountOverlay()

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => this.onKeyDown(event))
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.teardownOverlay()
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

  private mountOverlay(): void {
    this.teardownOverlay()
    const gameArea = document.getElementById('game-area')
    if (!gameArea) {
      return
    }

    const root = document.createElement('div')
    root.className = styles.overlay

    const top = document.createElement('div')
    top.className = styles.top
    root.append(top)

    const title = document.createElement('h1')
    title.className = styles.title
    title.textContent = 'ZNAKE'
    top.append(title)

    this.languageEl = document.createElement('button')
    this.languageEl.type = 'button'
    this.languageEl.className = styles.lang
    this.languageEl.addEventListener('click', () => {
      void this.switchLanguage()
    })
    top.append(this.languageEl)

    const stats = document.createElement('div')
    stats.className = styles.stats
    root.append(stats)

    const best = Number.parseInt(
      localStorage.getItem(STORAGE_KEYS.bestScore) ??
        localStorage.getItem(STORAGE_KEYS.legacyBestScore) ??
        '0',
      10,
    )
    const bestText = document.createElement('p')
    bestText.className = styles.stat
    bestText.textContent = `X ${t('menu.bestScore', { best })}`
    stats.append(bestText)

    const currencyText = document.createElement('p')
    currencyText.className = styles.stat
    currencyText.textContent = `© ${t('menu.currency', { value: '' })}`
    this.currencyValueEl = document.createElement('span')
    this.currencyValueEl.className = styles.currencyValue
    currencyText.append(this.currencyValueEl)
    stats.append(currencyText)

    const accessibility = document.createElement('div')
    accessibility.className = styles.accessibility
    root.append(accessibility)

    const accessibilityTitle = document.createElement('p')
    accessibilityTitle.className = styles.accessibilityTitle
    accessibility.append(accessibilityTitle)

    const createToggleRow = (
      labelKey: string,
      readValue: () => boolean,
      onToggle: () => void,
      options?: { disabled?: boolean },
    ): void => {
      const row = document.createElement('button')
      row.type = 'button'
      row.className = styles.accessibilityRow
      row.disabled = options?.disabled === true
      row.addEventListener('click', onToggle)
      accessibility.append(row)

      const labelEl = document.createElement('span')
      labelEl.className = styles.accessibilityLabel
      row.append(labelEl)

      const statusEl = document.createElement('span')
      statusEl.className = styles.accessibilityStatus
      row.append(statusEl)

      const refresh = (): void => {
        labelEl.textContent = t(labelKey)
        if (options?.disabled) {
          statusEl.textContent = t('menu.unavailable')
          row.classList.add(styles.accessibilityRowDisabled)
          return
        }
        statusEl.textContent = readValue() ? t('menu.on') : t('menu.off')
        row.classList.remove(styles.accessibilityRowDisabled)
      }
      this.accessibilityRefreshers.push(refresh)
      refresh()
    }

    this.accessibilityRefreshers.push(() => {
      accessibilityTitle.textContent = t('menu.accessibility')
    })

    const voiceSupported = getVoiceAvailability() === 'supported'
    createToggleRow(
      'menu.a11yVoice',
      () => getAccessibilitySettings().voiceEnabled,
      () => {
        if (!voiceSupported) {
          emitFeedback('tap')
          return
        }
        const { voiceEnabled } = getAccessibilitySettings()
        updateAccessibilitySettings({ voiceEnabled: !voiceEnabled })
        syncVoiceInput()
        this.refreshMetaUi()
        emitFeedback('confirm')
      },
      { disabled: !voiceSupported },
    )

    const talentTitle = document.createElement('p')
    talentTitle.className = styles.shopTitle
    talentTitle.textContent = t('menu.talentShop')
    root.append(talentTitle)

    const talentList = document.createElement('div')
    talentList.className = styles.talents
    root.append(talentList)
    for (const [index, talent] of TALENT_TREE.entries()) {
      const row = document.createElement('button')
      row.type = 'button'
      row.className = styles.row
      row.addEventListener('click', () => this.tryUnlockByIndex(index))
      talentList.append(row)

      const titleEl = document.createElement('span')
      titleEl.className = styles.rowTitle
      row.append(titleEl)

      const statusEl = document.createElement('span')
      statusEl.className = styles.rowStatus
      row.append(statusEl)

      const refresh = (): void => {
        const unlocked = playerProfile.unlockedTalents.includes(talent.id)
        const prereqOk = !talent.requires || playerProfile.unlockedTalents.includes(talent.requires)
        const affordable = playerProfile.currency >= talent.cost
        const actionable = !unlocked && prereqOk && affordable

        row.classList.toggle(styles.rowActionable, actionable)
        titleEl.textContent = `${index + 1}. ${this.getTalentLabel(talent.id, talent.name)}`

        if (unlocked) {
          statusEl.textContent = t('menu.unlocked')
          statusEl.style.color = 'var(--color-accent)'
          return
        }
        if (!prereqOk) {
          const prereq = TALENT_TREE.find((item) => item.id === talent.requires)
          statusEl.textContent = t('menu.req', {
            value: prereq
              ? this.getTalentLabel(prereq.id, prereq.name)
              : (talent.requires?.toUpperCase() ?? 'NONE'),
          })
          statusEl.style.color = '#667788'
          return
        }
        statusEl.textContent = !affordable
          ? t('menu.cost', { value: talent.cost })
          : t('menu.buy', { value: talent.cost })
        statusEl.style.color = 'var(--color-accent)'
      }

      this.talentRowRefreshers.push(refresh)
      refresh()
    }

    this.goalsTitleEl = document.createElement('p')
    this.goalsTitleEl.className = styles.goalsTitle
    root.append(this.goalsTitleEl)

    const goals = document.createElement('div')
    goals.className = styles.goals
    root.append(goals)
    for (const goal of PROGRESSION_GOALS) {
      const goalEl = document.createElement('button')
      goalEl.type = 'button'
      goalEl.className = styles.goal
      goalEl.addEventListener('click', () => this.tryClaimGoal(goal.id))
      goals.append(goalEl)

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
        goalEl.textContent = `${goalLabel} - ${status}`
        goalEl.style.color = claimed ? '#6f88a1' : ready ? 'var(--color-accent)' : '#f4f8ff'
      }

      this.goalRowRefreshers.push(refresh)
      refresh()
    }

    const start = document.createElement('button')
    start.type = 'button'
    start.className = styles.start
    start.textContent = t('menu.startPrompt')
    start.addEventListener('click', () => this.startRun())

    const objective = document.createElement('p')
    objective.className = styles.nextObjective
    objective.textContent = t('menu.nextObjective', {
      objective: this.getObjectivePreview(1),
    })
    root.append(objective)

    root.append(start)

    gameArea.append(root)
    this.overlayRoot = root
    this.refreshMetaUi()
  }

  private teardownOverlay(): void {
    if (this.overlayRoot) {
      this.overlayRoot.remove()
      this.overlayRoot = null
    }
    this.currencyValueEl = null
    this.goalsTitleEl = null
    this.languageEl = null
    this.talentRowRefreshers = []
    this.goalRowRefreshers = []
    this.accessibilityRefreshers = []
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
    if (this.currencyValueEl) {
      this.currencyValueEl.textContent = String(playerProfile.currency)
    }
    if (this.goalsTitleEl) {
      this.goalsTitleEl.textContent = t('menu.goalsTitle')
    }
    if (this.languageEl) {
      this.languageEl.textContent = `${t('menu.language')}: ${getLanguage().toUpperCase()}`
    }
    for (const refresh of this.talentRowRefreshers) {
      refresh()
    }
    for (const refresh of this.goalRowRefreshers) {
      refresh()
    }
    for (const refresh of this.accessibilityRefreshers) {
      refresh()
    }
  }

  private getTalentLabel(talentId: string, fallbackName: string): string {
    return t(`talent.${talentId}_name`, { defaultValue: fallbackName })
  }

  private getObjectivePreview(floor: number): string {
    const objective = getFloorObjective(floor, gameState.runObjectiveOffset)
    if (objective.kind === 'boss') {
      return t('game.objectiveBossPreview')
    }
    if (objective.kind === 'score') {
      return t('game.objectiveScorePreview', { target: objective.scoreTarget })
    }
    if (objective.kind === 'kills') {
      return t('game.objectiveKillsPreview', { target: objective.killsTarget })
    }
    return t('game.objectivePortalPreview')
  }

  private async switchLanguage(): Promise<void> {
    if (!this.waiting) {
      return
    }
    emitFeedback('confirm')
    await toggleLanguage()
    syncVoiceInput()
    this.scene.restart()
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
    this.teardownOverlay()
    transitionToScene(this, 'RelicDraft', { chrome: 'run' })
  }
}
