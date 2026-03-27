import Phaser from 'phaser'
import styles from '../../styles/menuOverlay.module.css'
import { STORAGE_KEYS } from '../core/constants'
import { DEV_SCENARIOS, type DevScenarioId, isDevMode } from '../core/devScenarios'
import {
  GLOSSARY_CATEGORIES,
  GLOSSARY_ENTRIES,
  type GlossaryCategoryId,
  type GlossaryMarkerTone,
} from '../core/glossary'
import {
  PROGRESSION_GOALS,
  TALENT_TREE,
  claimGoalReward,
  isChallengeMutatorsUnlocked,
  saveProfile,
  unlockTalent,
} from '../core/meta'
import { getRoomObjective, getRunObjectiveOffsetForSeed } from '../core/objectives'
import { gameState, playerProfile, setPlayerProfile } from '../core/state'
import type { GoalId } from '../core/types'
import { drawMarkerSpriteCanvas } from '../render/markerBitmapDraw'
import { ensureMarkerBitmapsLoaded } from '../render/markerBitmaps'
import {
  GLOSSARY_MARKER_DISPLAY_PX,
  MARKER_EXPORT_FRAME_PX_DEFAULT,
  MARKER_EXPORT_INNER_SIZE,
  MARKER_EXPORT_LOGICAL_FRAME,
  MARKER_EXPORT_SCALE_DEFAULT,
} from '../render/markerExportSpec'
import { createEmptyBossEncounterSummary } from '../simulation/eliteMiniboss'
import { deriveRunSeed } from '../simulation/rng'
import { createEmptyRouteMasterySummary } from '../simulation/routeMastery'
import { getAccessibilitySettings, updateAccessibilitySettings } from '../systems/accessibility'
import { getControlMode } from '../systems/controlScheme'
import { setSceneChrome } from '../systems/domHud'
import { emitFeedback } from '../systems/feedback'
import { getLanguage, t, toggleLanguage } from '../systems/i18n'
import { resetVirtualInput } from '../systems/input'
import { transitionToScene } from '../systems/sceneFlow'
import { trackRetentionEvent } from '../systems/telemetry'
import {
  type VoiceRuntimeStatus,
  getVoiceAvailability,
  getVoiceUxSnapshot,
  subscribeVoiceUx,
  syncVoiceInput,
} from '../systems/voiceInput'

const MARKER_CLASS_BY_TONE: Record<GlossaryMarkerTone, string> = {
  core: styles.glossaryMarkerCore,
  biomeCore: styles.glossaryMarkerBiomeCore,
  portal: styles.glossaryMarkerPortal,
  battery: styles.glossaryMarkerBattery,
  beacon: styles.glossaryMarkerBeacon,
  shield: styles.glossaryMarkerShield,
  slow: styles.glossaryMarkerSlow,
  ghost: styles.glossaryMarkerGhost,
  score: styles.glossaryMarkerScore,
  venom: styles.glossaryMarkerVenom,
  darkness: styles.glossaryMarkerDarkness,
  squeeze: styles.glossaryMarkerSqueeze,
  ice: styles.glossaryMarkerIce,
  sand: styles.glossaryMarkerSand,
  rift: styles.glossaryMarkerRift,
  enemyNormal: styles.glossaryMarkerEnemyNormal,
  enemyStalker: styles.glossaryMarkerEnemyStalker,
  enemyAmbusher: styles.glossaryMarkerEnemyAmbusher,
  enemyEgg: styles.glossaryMarkerEnemyEgg,
  enemyMirror: styles.glossaryMarkerEnemyMirror,
  enemyBoss: styles.glossaryMarkerEnemyBoss,
  talentSpeed: styles.glossaryMarkerTalentSpeed,
  talentSurvival: styles.glossaryMarkerTalentSurvival,
  talentHunt: styles.glossaryMarkerTalentHunt,
}

const createGlossaryMarkerCanvas = (tone: GlossaryMarkerTone): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  canvas.width = MARKER_EXPORT_FRAME_PX_DEFAULT
  canvas.height = MARKER_EXPORT_FRAME_PX_DEFAULT
  canvas.style.width = `${GLOSSARY_MARKER_DISPLAY_PX}px`
  canvas.style.height = `${GLOSSARY_MARKER_DISPLAY_PX}px`
  canvas.className = styles.glossaryMarkerCanvas
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas
  ctx.imageSmoothingEnabled = false
  ctx.setTransform(MARKER_EXPORT_SCALE_DEFAULT, 0, 0, MARKER_EXPORT_SCALE_DEFAULT, 0, 0)
  drawMarkerSpriteCanvas(
    ctx,
    tone,
    MARKER_EXPORT_LOGICAL_FRAME / 2,
    MARKER_EXPORT_LOGICAL_FRAME / 2,
    MARKER_EXPORT_INNER_SIZE,
  )

  return canvas
}

export class MenuScene extends Phaser.Scene {
  private waiting = true
  private overlayRoot: HTMLDivElement | null = null
  private currencyValueEl: HTMLSpanElement | null = null
  private goalsTitleEl: HTMLParagraphElement | null = null
  private languageEl: HTMLButtonElement | null = null
  private guideButtonEl: HTMLButtonElement | null = null
  private talentRowRefreshers: Array<() => void> = []
  private goalRowRefreshers: Array<() => void> = []
  private accessibilityRefreshers: Array<() => void> = []
  private unsubscribeVoiceUx: (() => void) | null = null
  private glossaryOpen = false
  private glossaryModalEl: HTMLDivElement | null = null
  private glossaryTitleEl: HTMLHeadingElement | null = null
  private glossarySubtitleEl: HTMLParagraphElement | null = null
  private glossaryCloseEl: HTMLButtonElement | null = null
  private glossaryTabButtons: Partial<Record<GlossaryCategoryId, HTMLButtonElement>> = {}
  private glossaryListEl: HTMLDivElement | null = null
  private glossaryCategory: GlossaryCategoryId = 'items'
  private readonly devMode = isDevMode()

  public constructor() {
    super('Menu')
  }

  public async create(): Promise<void> {
    await ensureMarkerBitmapsLoaded()
    resetVirtualInput()
    this.waiting = true
    this.talentRowRefreshers = []
    this.goalRowRefreshers = []
    this.accessibilityRefreshers = []
    this.unsubscribeVoiceUx = subscribeVoiceUx(() => {
      this.refreshMetaUi()
    })
    this.glossaryOpen = false
    this.glossaryCategory = 'items'
    this.glossaryTabButtons = {}
    if (!Number.isFinite(gameState.runObjectiveOffset)) {
      gameState.runObjectiveOffset = 0
    }
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

    const topActions = document.createElement('div')
    topActions.className = styles.topActions
    top.append(topActions)

    this.guideButtonEl = document.createElement('button')
    this.guideButtonEl.type = 'button'
    this.guideButtonEl.className = styles.guide
    this.guideButtonEl.addEventListener('click', () => this.toggleGlossary())
    topActions.append(this.guideButtonEl)

    this.languageEl = document.createElement('button')
    this.languageEl.type = 'button'
    this.languageEl.className = styles.lang
    this.languageEl.addEventListener('click', () => {
      void this.switchLanguage()
    })
    topActions.append(this.languageEl)

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
      options?: { disabled?: boolean; statusText?: () => string },
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
        statusEl.textContent =
          options?.statusText?.() ?? (readValue() ? t('menu.on') : t('menu.off'))
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
      {
        disabled: !voiceSupported,
        statusText: () => {
          const snapshot = getVoiceUxSnapshot()
          if (!snapshot.enabled && snapshot.status !== 'denied') {
            return t('menu.off')
          }
          return this.getVoiceStatusLabel(snapshot.status)
        },
      },
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
          statusEl.style.color = 'var(--color-sem-control-muted)'
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
        goalEl.style.color = claimed
          ? 'var(--color-sem-control-muted)'
          : ready
            ? 'var(--color-sem-economy)'
            : 'var(--color-text-primary)'
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

    if (this.devMode) {
      const devSection = document.createElement('div')
      devSection.className = styles.devSection

      const devTitle = document.createElement('p')
      devTitle.className = styles.devTitle
      devTitle.textContent = 'DEV SCENARIOS'
      devSection.append(devTitle)

      const devRows = document.createElement('div')
      devRows.className = styles.devRows
      devSection.append(devRows)

      for (const scenario of DEV_SCENARIOS) {
        const button = document.createElement('button')
        button.type = 'button'
        button.className = styles.devButton
        button.textContent = scenario.label
        button.addEventListener('click', () => {
          this.startDevScenario(scenario.id)
        })
        devRows.append(button)
      }

      root.append(devSection)
    }

    root.append(start)
    this.mountGlossaryModal(root)

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
    this.guideButtonEl = null
    this.talentRowRefreshers = []
    this.goalRowRefreshers = []
    this.accessibilityRefreshers = []
    if (this.unsubscribeVoiceUx) {
      this.unsubscribeVoiceUx()
      this.unsubscribeVoiceUx = null
    }
    this.glossaryModalEl = null
    this.glossaryTitleEl = null
    this.glossarySubtitleEl = null
    this.glossaryCloseEl = null
    this.glossaryTabButtons = {}
    this.glossaryListEl = null
    this.glossaryOpen = false
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Escape' && this.glossaryOpen) {
      this.toggleGlossary(false)
      return
    }
    if (event.code === 'KeyG' || event.code === 'KeyB') {
      this.toggleGlossary()
      return
    }
    if (this.glossaryOpen) {
      return
    }
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
      this.goalsTitleEl.textContent = `${t('menu.goalsTitle')} · ${this.getMutatorUnlockStatusText()}`
    }
    if (this.languageEl) {
      this.languageEl.textContent = `${t('menu.language')}: ${getLanguage().toUpperCase()}`
    }
    if (this.guideButtonEl) {
      this.guideButtonEl.textContent = t('menu.guide')
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
    this.refreshGlossaryUi()
  }

  private getTalentLabel(talentId: string, fallbackName: string): string {
    return t(`talent.${talentId}_name`, { defaultValue: fallbackName })
  }

  private getObjectivePreview(floor: number): string {
    const objective = getRoomObjective(floor, gameState.runObjectiveOffset)
    if (objective.kind === 'collect_cores') {
      return t('game.roomObjectiveCollectCoresPreview', { target: objective.target })
    }
    if (objective.kind === 'defeat_elite') {
      return t('game.roomObjectiveDefeatElitePreview', { target: objective.target })
    }
    if (objective.kind === 'activate_terminals') {
      return t('game.roomObjectiveActivateTerminalsPreview', { target: objective.target })
    }
    return t('game.roomObjectiveSurvivePreview', {
      seconds: Math.ceil(objective.target / 1000),
    })
  }

  private getMutatorUnlockStatusText(): string {
    return isChallengeMutatorsUnlocked(playerProfile)
      ? t('menu.mutatorsUnlocked')
      : t('menu.mutatorsLocked')
  }

  private getVoiceStatusLabel(status: VoiceRuntimeStatus): string {
    if (status === 'listening') {
      return t('menu.voiceStatusListening')
    }
    if (status === 'denied') {
      return t('menu.voiceStatusDenied')
    }
    if (status === 'unsupported') {
      return t('menu.unavailable')
    }
    return t('menu.voiceStatusIdle')
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
    this.startRunInternal()
  }

  private startDevScenario(scenarioId: DevScenarioId): void {
    this.startRunInternal(scenarioId)
  }

  private startRunInternal(devScenarioId?: DevScenarioId): void {
    if (!this.waiting) {
      return
    }
    if (this.glossaryOpen) {
      return
    }
    this.waiting = false
    emitFeedback('confirm')
    gameState.run = 1
    gameState.totalScore = 0
    gameState.kills = 0
    gameState.eliteKills = 0
    gameState.floor = 1
    const runSeed = deriveRunSeed([Date.now(), gameState.run, playerProfile.currency])
    gameState.currentRunSeed = runSeed
    gameState.runObjectiveOffset = getRunObjectiveOffsetForSeed(runSeed)
    gameState.persistentUpgrades = []
    gameState.persistentRewards = []
    gameState.selectedRelicId = null
    gameState.pendingFloorRoute = null
    gameState.currentRunMapNodeId = null
    gameState.pendingRunMapNodeId = null
    gameState.currentRunMutators = []
    gameState.biomeRuleSummary = {
      activationEvents: 0,
      transitionEvents: 0,
      blockedEvents: 0,
      fallbackEvents: 0,
      activatedBiomeIds: [],
      activatedRuleIds: [],
    }
    gameState.eliteMinibossReadability = {
      phaseWindowEvents: 0,
      damageEvents: 0,
      failureReasonCounts: {
        late_react: 0,
        trapped_path: 0,
        telegraph_missed: 0,
        stacked_pressure: 0,
      },
    }
    gameState.bossEncounterSummary = createEmptyBossEncounterSummary()
    gameState.predatorPreyPacingSummary = {
      transitionEvents: 0,
      transitionsByPhase: {
        hunt: 0,
        escape: 0,
        reset: 0,
      },
      guardrailInterventions: 0,
      guardrailReasonCounts: {
        overlap_budget_exceeded: 0,
        cadence_gap_enforced: 0,
        phase_escape_window: 0,
      },
    }
    gameState.routeMasterySummary = createEmptyRouteMasterySummary()
    gameState.runCleanPlaySummary = {
      completedObjectives: 0,
      cleanClears: 0,
      totalBonusScore: 0,
      awardedByKind: {
        survive: 0,
        collect_cores: 0,
        defeat_elite: 0,
        activate_terminals: 0,
      },
    }
    playerProfile.lifetimeStats.runsPlayed += 1
    saveProfile(playerProfile)
    trackRetentionEvent('run_start', {
      source: devScenarioId ? 'menu_dev' : 'menu',
      currency: playerProfile.currency,
      unlockedTalents: playerProfile.unlockedTalents.length,
      devScenarioId: devScenarioId ?? null,
    })
    trackRetentionEvent('input_mode', {
      mode: getControlMode(),
      source: devScenarioId ? 'run_start_menu_dev' : 'run_start_menu',
      run: gameState.run,
    })
    this.teardownOverlay()
    if (devScenarioId) {
      transitionToScene(this, 'Game', {
        chrome: 'run',
        data: { devScenarioId, score: 0 },
      })
      return
    }
    transitionToScene(this, 'RelicDraft', { chrome: 'run' })
  }

  private mountGlossaryModal(root: HTMLDivElement): void {
    const modal = document.createElement('div')
    modal.className = styles.glossaryModal
    modal.setAttribute('aria-hidden', 'true')

    const panel = document.createElement('section')
    panel.className = styles.glossaryPanel
    modal.append(panel)

    const panelTop = document.createElement('div')
    panelTop.className = styles.glossaryTop
    panel.append(panelTop)

    this.glossaryTitleEl = document.createElement('h2')
    this.glossaryTitleEl.className = styles.glossaryTitle
    panelTop.append(this.glossaryTitleEl)

    const close = document.createElement('button')
    close.type = 'button'
    close.className = styles.glossaryClose
    close.addEventListener('click', () => this.toggleGlossary(false))
    panelTop.append(close)
    this.glossaryCloseEl = close

    this.glossarySubtitleEl = document.createElement('p')
    this.glossarySubtitleEl.className = styles.glossarySubtitle
    panel.append(this.glossarySubtitleEl)

    const tabs = document.createElement('div')
    tabs.className = styles.glossaryTabs
    panel.append(tabs)

    for (const category of GLOSSARY_CATEGORIES) {
      const tab = document.createElement('button')
      tab.type = 'button'
      tab.className = styles.glossaryTab
      tab.addEventListener('click', () => this.selectGlossaryCategory(category))
      tabs.append(tab)
      this.glossaryTabButtons[category] = tab
    }

    this.glossaryListEl = document.createElement('div')
    this.glossaryListEl.className = styles.glossaryList
    panel.append(this.glossaryListEl)

    modal.addEventListener('click', (event: MouseEvent) => {
      if (event.target === modal) {
        this.toggleGlossary(false)
      }
    })

    this.glossaryModalEl = modal
    root.append(modal)
  }

  private toggleGlossary(nextState?: boolean): void {
    const next = nextState ?? !this.glossaryOpen
    if (next === this.glossaryOpen) {
      return
    }
    this.glossaryOpen = next
    if (!this.glossaryModalEl) {
      return
    }
    this.glossaryModalEl.classList.toggle(styles.glossaryModalOpen, next)
    this.glossaryModalEl.setAttribute('aria-hidden', next ? 'false' : 'true')
    if (next) {
      this.refreshGlossaryUi()
      emitFeedback('confirm')
      return
    }
    emitFeedback('tap')
  }

  private selectGlossaryCategory(category: GlossaryCategoryId): void {
    if (this.glossaryCategory === category) {
      return
    }
    this.glossaryCategory = category
    this.refreshGlossaryUi()
    emitFeedback('tap')
  }

  private refreshGlossaryUi(): void {
    if (!this.glossaryTitleEl || !this.glossarySubtitleEl || !this.glossaryListEl) {
      return
    }
    this.glossaryTitleEl.textContent = t('glossary.title')
    this.glossarySubtitleEl.textContent = t('glossary.subtitle')
    if (this.glossaryCloseEl) {
      this.glossaryCloseEl.textContent = t('glossary.close')
    }

    for (const category of GLOSSARY_CATEGORIES) {
      const tab = this.glossaryTabButtons[category]
      if (!tab) {
        continue
      }
      tab.textContent = t(`glossary.category.${category}`)
      tab.classList.toggle(styles.glossaryTabActive, category === this.glossaryCategory)
    }

    this.glossaryListEl.textContent = ''
    const entries = GLOSSARY_ENTRIES.filter((entry) => entry.category === this.glossaryCategory)
    for (const entry of entries) {
      const row = document.createElement('article')
      row.className = styles.glossaryRow

      const marker = document.createElement('span')
      marker.className = `${styles.glossaryMarker} ${MARKER_CLASS_BY_TONE[entry.marker]}`
      marker.append(createGlossaryMarkerCanvas(entry.marker))
      row.append(marker)

      const content = document.createElement('div')
      content.className = styles.glossaryContent
      row.append(content)

      const name = document.createElement('p')
      name.className = styles.glossaryName
      name.textContent = t(`glossary.entry.${entry.id}.name`)
      content.append(name)

      const desc = document.createElement('p')
      desc.className = styles.glossaryDesc
      desc.textContent = t(`glossary.entry.${entry.id}.description`)
      content.append(desc)

      this.glossaryListEl.append(row)
    }
  }
}
