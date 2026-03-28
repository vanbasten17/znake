import Phaser from 'phaser'
import styles from '../../styles/menuOverlay.module.css'
import { resolveChallengePreset } from '../core/challengePresets'
import { createChallengeShareCode, parseChallengeShareCode } from '../core/challengeShare'
import { STORAGE_KEYS } from '../core/constants'
import { BASE_CONTENT_PACK } from '../core/contentPacks'
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
import { getMetaBoardBranchStatus } from '../core/metaBoard'
import { getRunObjectiveOffsetForSeed } from '../core/objectives'
import {
  dismissOnboardingAssist,
  markOnboardingAssistApplied,
  resolveOnboardingAssistRecommendation,
} from '../core/onboardingAssist'
import { loadLatestReplaySnapshot } from '../core/replayStore'
import { type RunHistoryEntry, loadRunHistory } from '../core/runHistory'
import { gameState, playerProfile, setPlayerProfile } from '../core/state'
import type { ChallengeMutatorId, ChallengePresetId, GoalId } from '../core/types'
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
import { createEmptyRouteMasterySummary } from '../simulation/routeMastery'
import {
  cycleAccessibilityPreset,
  cycleAudioProfile,
  getAccessibilityPresetId,
  getAccessibilitySettings,
  getAudioProfileId,
  updateAccessibilitySettings,
} from '../systems/accessibility'
import { resolveChallengeSharePromptCopy } from '../systems/challengeSharePromptCopy'
import { getControlMode } from '../systems/controlScheme'
import { createButton, createEl } from '../systems/domFactory'
import { setSceneChrome } from '../systems/domHud'
import { emitFeedback } from '../systems/feedback'
import { getLanguage, t, toggleLanguage } from '../systems/i18n'
import { resetVirtualInput } from '../systems/input'
import { getObjectivePreviewText } from '../systems/objectivePresenter'
import { getReleaseDisclosureLinks, getReleaseMetadata } from '../systems/release'
import { transitionToScene } from '../systems/sceneFlow'
import { trackRetentionEvent } from '../systems/telemetry'
import { trackInputMode, trackRunStart } from '../systems/telemetryEvents'
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
  private runHistoryEl: HTMLDivElement | null = null
  private masteryFocusEl: HTMLParagraphElement | null = null
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
  private releaseDiagnosticsEl: HTMLParagraphElement | null = null
  private onboardingActionButtons: HTMLButtonElement[] = []
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
    this.onboardingActionButtons = []
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

    const root = createEl('div', styles.overlay)
    const top = createEl('div', styles.top)
    root.append(top)

    const title = createEl('h1', styles.title, 'ZNAKE')
    top.append(title)

    const topActions = createEl('div', styles.topActions)
    top.append(topActions)

    this.guideButtonEl = createButton(styles.guide, '')
    this.guideButtonEl.addEventListener('click', () => this.toggleGlossary())
    topActions.append(this.guideButtonEl)

    this.languageEl = createButton(styles.lang, '')
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

    const playSectionTitle = document.createElement('p')
    playSectionTitle.className = styles.sectionLabel
    playSectionTitle.textContent = t('menu.sectionPlay')
    root.append(playSectionTitle)

    const playSection = createEl('div', styles.playSection)
    root.append(playSection)

    const objective = document.createElement('p')
    objective.className = styles.nextObjective
    objective.textContent = t('menu.nextObjective', {
      objective: getObjectivePreviewText(1, gameState.runObjectiveOffset),
    })
    playSection.append(objective)

    const playActions = createEl('div', styles.playActions)
    playSection.append(playActions)

    const start = createButton(styles.start, '')
    start.textContent = t('menu.startPrompt')
    start.addEventListener('click', () => this.startRun())
    playActions.append(start)

    const dailyStart = createButton(styles.startMinor, '')
    dailyStart.textContent = t('menu.startDaily')
    dailyStart.addEventListener('click', () => this.startRunWithPreset('daily'))
    playActions.append(dailyStart)

    const weeklyStart = createButton(styles.startMinor, '')
    weeklyStart.textContent = t('menu.startWeekly')
    weeklyStart.addEventListener('click', () => this.startRunWithPreset('weekly'))
    playActions.append(weeklyStart)

    const challengeActions = createEl('div', styles.challengeActions)
    playSection.append(challengeActions)

    const shareChallenge = createButton(styles.startMinor, 'SHARE LAST RUN')
    shareChallenge.addEventListener('click', () => this.copyLatestChallengeCode())
    challengeActions.append(shareChallenge)

    const importChallenge = createButton(styles.startMinor, 'PLAY SHARED CODE')
    importChallenge.addEventListener('click', () => this.importChallengeCode())
    challengeActions.append(importChallenge)

    const historySectionTitle = document.createElement('p')
    historySectionTitle.className = styles.sectionLabel
    historySectionTitle.textContent = t('menu.sectionHistory')
    root.append(historySectionTitle)

    const history = document.createElement('div')
    history.className = styles.runHistory
    root.append(history)
    this.runHistoryEl = history

    const buildSectionTitle = document.createElement('p')
    buildSectionTitle.className = styles.sectionLabel
    buildSectionTitle.textContent = t('menu.sectionBuild')
    root.append(buildSectionTitle)

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

    createToggleRow(
      'menu.a11yPreset',
      () => true,
      () => {
        cycleAccessibilityPreset()
        this.refreshMetaUi()
        emitFeedback('confirm')
      },
      {
        statusText: () => {
          const presetId = getAccessibilityPresetId()
          if (presetId === 'clarity') return t('menu.a11yPresetClarity')
          if (presetId === 'comfort') return t('menu.a11yPresetComfort')
          if (presetId === 'custom') return t('menu.a11yPresetCustom')
          return t('menu.a11yPresetDefault')
        },
      },
    )

    createToggleRow(
      'menu.a11yHighContrast',
      () => getAccessibilitySettings().highContrast,
      () => {
        const { highContrast } = getAccessibilitySettings()
        updateAccessibilitySettings({ highContrast: !highContrast })
        this.refreshMetaUi()
        emitFeedback('confirm')
      },
    )

    createToggleRow(
      'menu.a11yLargeText',
      () => getAccessibilitySettings().largeText,
      () => {
        const { largeText } = getAccessibilitySettings()
        updateAccessibilitySettings({ largeText: !largeText })
        this.refreshMetaUi()
        emitFeedback('confirm')
      },
    )

    createToggleRow(
      'menu.a11yReducedEffects',
      () => getAccessibilitySettings().reducedEffects,
      () => {
        const { reducedEffects } = getAccessibilitySettings()
        updateAccessibilitySettings({ reducedEffects: !reducedEffects })
        this.refreshMetaUi()
        emitFeedback('confirm')
      },
    )

    const voiceSupported = getVoiceAvailability() === 'supported'
    createToggleRow(
      'menu.a11yAudioProfile',
      () => true,
      () => {
        cycleAudioProfile()
        this.refreshMetaUi()
        emitFeedback('confirm')
      },
      {
        statusText: () => {
          const profile = getAudioProfileId()
          if (profile === 'focused') return t('menu.a11yAudioProfileFocused')
          if (profile === 'low_fatigue') return t('menu.a11yAudioProfileLowFatigue')
          return t('menu.a11yAudioProfileBalanced')
        },
      },
    )

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

    this.masteryFocusEl = document.createElement('p')
    this.masteryFocusEl.className = styles.masteryFocus
    root.append(this.masteryFocusEl)

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

    const releaseBlock = document.createElement('section')
    releaseBlock.className = styles.releaseBlock

    this.releaseDiagnosticsEl = document.createElement('p')
    this.releaseDiagnosticsEl.className = styles.releaseDiagnostics
    releaseBlock.append(this.releaseDiagnosticsEl)

    const releaseLinks = document.createElement('div')
    releaseLinks.className = styles.releaseLinks
    const { privacyUrl, telemetryUrl, faqUrl, feedbackUrl, contactUrl } =
      getReleaseDisclosureLinks()
    if (privacyUrl) {
      releaseLinks.append(this.createReleaseLink(privacyUrl, 'menu.privacyPolicy'))
    }
    if (telemetryUrl) {
      releaseLinks.append(this.createReleaseLink(telemetryUrl, 'menu.telemetryDisclosure'))
    }
    if (faqUrl) {
      releaseLinks.append(this.createReleaseLink(faqUrl, 'menu.faq'))
    }
    if (feedbackUrl) {
      releaseLinks.append(this.createReleaseLink(feedbackUrl, 'menu.feedback'))
    }
    if (contactUrl) {
      releaseLinks.append(this.createReleaseLink(contactUrl, 'menu.contact'))
    }
    if (releaseLinks.childElementCount > 0) {
      releaseBlock.append(releaseLinks)
    }
    root.append(releaseBlock)

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
    this.runHistoryEl = null
    this.masteryFocusEl = null
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
    this.releaseDiagnosticsEl = null
    this.onboardingActionButtons = []
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
    if (event.code === 'KeyD') {
      this.startRunWithPreset('daily')
      return
    }
    if (event.code === 'KeyW') {
      this.startRunWithPreset('weekly')
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
    if (this.masteryFocusEl) {
      this.masteryFocusEl.textContent = this.getMasteryFocusText()
    }
    if (this.languageEl) {
      this.languageEl.textContent = `${t('menu.language')}: ${getLanguage().toUpperCase()}`
    }
    if (this.guideButtonEl) {
      this.guideButtonEl.textContent = t('menu.guide')
    }
    this.refreshRunHistoryUi()
    for (const refresh of this.talentRowRefreshers) {
      refresh()
    }
    for (const refresh of this.goalRowRefreshers) {
      refresh()
    }
    for (const refresh of this.accessibilityRefreshers) {
      refresh()
    }
    if (this.releaseDiagnosticsEl) {
      const release = getReleaseMetadata()
      this.releaseDiagnosticsEl.textContent = t('menu.releaseDiagnostics', {
        version: release.release_version,
        channel: release.release_channel,
        buildId: release.build_id,
      })
    }
    this.refreshGlossaryUi()
  }

  private refreshRunHistoryUi(): void {
    if (!this.runHistoryEl) {
      return
    }
    this.runHistoryEl.replaceChildren()

    const title = document.createElement('p')
    title.className = styles.runHistoryTitle
    title.textContent = 'RECENT RUNS'
    this.runHistoryEl.append(title)

    const allEntries = loadRunHistory()
    const entries = allEntries.slice(0, 3)
    if (entries.length === 0) {
      const empty = document.createElement('p')
      empty.className = styles.runHistoryEmpty
      empty.textContent = 'No recent runs'
      this.runHistoryEl.append(empty)
      return
    }

    const list = document.createElement('div')
    list.className = styles.runHistoryList
    for (const entry of entries) {
      const row = document.createElement('p')
      row.className = styles.runHistoryEntry
      const preset =
        entry.challengePresetId === 'standard'
          ? 'STD'
          : entry.challengePresetId === 'daily'
            ? 'DAY'
            : 'WK'
      row.textContent = `${preset} · F${entry.floor} · ${entry.deathReason} · B:${entry.buildLeaning} · seed:${entry.runSeed}`
      list.append(row)
    }
    this.runHistoryEl.append(list)

    const ghostLine = document.createElement('p')
    ghostLine.className = styles.runHistoryMeta
    ghostLine.textContent = this.getGhostLaneSummary(entries)
    this.runHistoryEl.append(ghostLine)

    const boardLine = document.createElement('p')
    boardLine.className = styles.runHistoryMeta
    boardLine.textContent = this.getMetaBoardSummary()
    this.runHistoryEl.append(boardLine)

    const onboarding = resolveOnboardingAssistRecommendation(allEntries)
    if (onboarding.shouldSuggest) {
      const onboardingCard = document.createElement('div')
      onboardingCard.className = styles.onboardingCard
      this.runHistoryEl.append(onboardingCard)

      const onboardingText = document.createElement('p')
      onboardingText.className = styles.onboardingText
      onboardingText.textContent =
        'Need a cleaner first 3 floors? Apply onboarding rail (clarity preset + low-fatigue audio).'
      onboardingCard.append(onboardingText)

      const actions = document.createElement('div')
      actions.className = styles.onboardingActions
      onboardingCard.append(actions)

      const applyButton = document.createElement('button')
      applyButton.type = 'button'
      applyButton.className = styles.startMinor
      applyButton.textContent = 'APPLY RAIL'
      applyButton.addEventListener('click', () => this.applyOnboardingRail())
      actions.append(applyButton)

      const dismissButton = document.createElement('button')
      dismissButton.type = 'button'
      dismissButton.className = styles.startMinor
      dismissButton.textContent = 'NOT NOW'
      dismissButton.addEventListener('click', () => {
        dismissOnboardingAssist()
        this.refreshRunHistoryUi()
      })
      actions.append(dismissButton)
      this.onboardingActionButtons = [applyButton, dismissButton]
    } else {
      this.onboardingActionButtons = []
    }
  }

  private createReleaseLink(url: string, labelKey: string): HTMLAnchorElement {
    const link = document.createElement('a')
    link.className = styles.releaseLink
    link.href = url
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.textContent = t(labelKey)
    return link
  }

  private getTalentLabel(talentId: string, fallbackName: string): string {
    return t(`talent.${talentId}_name`, { defaultValue: fallbackName })
  }

  private getMasteryFocusText(): string {
    if (PROGRESSION_GOALS.length <= 0) {
      return 'MASTERY FOCUS · none'
    }
    const dayIndex = Math.floor(Date.now() / (24 * 60 * 60 * 1000))
    const goal = PROGRESSION_GOALS[Math.abs(dayIndex) % PROGRESSION_GOALS.length]
    const progress = Math.min(goal.target, playerProfile.goalProgress[goal.id])
    const claimed = playerProfile.claimedGoals[goal.id]
    const goalLabel = t(`goal.${goal.id}_name`)
    const status = claimed
      ? t('menu.goalClaimed')
      : progress >= goal.target
        ? t('menu.goalReady', { reward: goal.reward })
        : t('menu.goalProgress', { progress, target: goal.target })
    return `MASTERY FOCUS · ${goalLabel} · ${status}`
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

  private getGhostLaneSummary(entries: ReadonlyArray<RunHistoryEntry>): string {
    const latestReplay = loadLatestReplaySnapshot()
    if (latestReplay) {
      return `GHOST TARGET · F${latestReplay.floor} · S${latestReplay.score} · seed:${latestReplay.runSeed} · inputs:${latestReplay.events.length}`
    }
    const fallback = entries[0]
    if (!fallback) {
      return 'GHOST TARGET · no replay snapshot yet'
    }
    return `GHOST TARGET · F${fallback.floor} · S${fallback.score} · seed:${fallback.runSeed}`
  }

  private getMetaBoardSummary(): string {
    const branchStatus = getMetaBoardBranchStatus(playerProfile)
    const labels = branchStatus.map((entry) => {
      const tierText = entry.unlockedTiers > 0 ? `T${entry.unlockedTiers}` : 'T0'
      return `${entry.branch}:${tierText}`
    })
    return `META BOARD V2 · ${labels.join(' · ')}`
  }

  private async copyLatestChallengeCode(): Promise<void> {
    const latestReplay = loadLatestReplaySnapshot()
    const latestRun = loadRunHistory()[0]
    const sourceSeed = latestReplay?.runSeed ?? latestRun?.runSeed
    const sourcePreset =
      latestReplay?.challengePresetId ?? latestRun?.challengePresetId ?? 'standard'
    if (!Number.isFinite(sourceSeed)) {
      emitFeedback('tap')
      return
    }
    const challengeCode = createChallengeShareCode({
      seed: sourceSeed ?? 0,
      presetId: sourcePreset,
      forcedMutatorId: gameState.currentChallengePresetForcedMutatorId,
      floor: latestReplay?.floor ?? latestRun?.floor ?? 0,
      score: latestReplay?.score ?? latestRun?.score ?? 0,
    })
    const copy = resolveChallengeSharePromptCopy(t)
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(challengeCode)
      } else {
        window.prompt(copy.copyPromptTitle, challengeCode)
      }
      emitFeedback('success')
      trackRetentionEvent('challenge_share_exported', {
        presetId: sourcePreset,
      })
    } catch {
      window.prompt(copy.copyPromptTitle, challengeCode)
    }
  }

  private importChallengeCode(): void {
    const copy = resolveChallengeSharePromptCopy(t)
    const raw = window.prompt(copy.pastePromptTitle) ?? ''
    if (raw.trim().length <= 0) {
      return
    }
    const parsed = parseChallengeShareCode(raw)
    if (!parsed.ok || !parsed.payload) {
      emitFeedback('tap')
      trackRetentionEvent('challenge_share_import_failed', {
        reason: parsed.reason ?? 'invalid',
      })
      return
    }
    emitFeedback('success')
    trackRetentionEvent('challenge_share_imported', {
      presetId: parsed.payload.presetId,
      floor: parsed.payload.floor,
      score: parsed.payload.score,
    })
    this.startRunInternal(undefined, parsed.payload.presetId, {
      forcedSeed: parsed.payload.seed,
      forcedMutatorId: parsed.payload.forcedMutatorId,
      runStartSource: 'shared_code',
    })
  }

  private applyOnboardingRail(): void {
    updateAccessibilitySettings({
      highContrast: true,
      largeText: true,
      reducedEffects: false,
      audioProfile: 'low_fatigue',
    })
    markOnboardingAssistApplied()
    this.refreshMetaUi()
    emitFeedback('success')
    trackRetentionEvent('onboarding_rail_applied', {
      source: 'menu',
    })
  }

  private startRun(): void {
    this.startRunInternal()
  }

  private startRunWithPreset(presetId: ChallengePresetId): void {
    this.startRunInternal(undefined, presetId)
  }

  private startDevScenario(scenarioId: DevScenarioId): void {
    this.startRunInternal(scenarioId, 'standard')
  }

  private resolveForcedMutatorIdForPreset(
    presetId: ChallengePresetId,
    forcedMutatorId?: ChallengeMutatorId | null,
  ): ChallengeMutatorId | null {
    if (forcedMutatorId) {
      return forcedMutatorId
    }
    if (presetId === 'standard') {
      return null
    }
    const nowMs = Date.now()
    return resolveChallengePreset({
      presetId,
      nowMs,
      fallbackSeedParts: [nowMs, gameState.run, playerProfile.currency],
    }).forcedMutatorId
  }

  private startRunInternal(
    devScenarioId?: DevScenarioId,
    presetId: ChallengePresetId = 'standard',
    options?: {
      forcedSeed?: number
      forcedMutatorId?: ChallengeMutatorId | null
      runStartSource?: 'menu' | 'shared_code' | 'menu_dev'
    },
  ): void {
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
    const nowMs = Date.now()
    const resolvedPresetId: ChallengePresetId = devScenarioId ? 'standard' : presetId
    const resolvedPreset =
      options?.forcedSeed !== undefined
        ? {
            presetId: resolvedPresetId,
            runSeed: Math.floor(options.forcedSeed) >>> 0,
            forcedMutatorId: this.resolveForcedMutatorIdForPreset(
              resolvedPresetId,
              options.forcedMutatorId,
            ),
          }
        : resolveChallengePreset({
            presetId: resolvedPresetId,
            nowMs,
            fallbackSeedParts: [nowMs, gameState.run, playerProfile.currency],
          })
    gameState.currentRunSeed = resolvedPreset.runSeed
    gameState.currentChallengePresetId = resolvedPreset.presetId
    gameState.currentChallengePresetForcedMutatorId = resolvedPreset.forcedMutatorId
    gameState.runObjectiveOffset = getRunObjectiveOffsetForSeed(resolvedPreset.runSeed)
    gameState.activeContentPackId = BASE_CONTENT_PACK.id
    gameState.lastReplaySnapshot = null
    gameState.persistentUpgrades = []
    gameState.persistentRewards = []
    gameState.selectedRelicId = null
    gameState.pendingFloorRoute = null
    gameState.pendingEventChoiceConsequences = []
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
    trackRunStart({
      source: options?.runStartSource ?? (devScenarioId ? 'menu_dev' : 'menu'),
      currency: playerProfile.currency,
      unlockedTalents: playerProfile.unlockedTalents.length,
      devScenarioId: devScenarioId ?? null,
      challengePresetId: resolvedPreset.presetId,
      challengePresetMutatorId: resolvedPreset.forcedMutatorId,
      contentPackId: gameState.activeContentPackId,
    })
    trackInputMode({
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
