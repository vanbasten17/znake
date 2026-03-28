import Phaser from 'phaser'
import styles from '../../styles/deathOverlay.module.css'
import { getDepthBandForFloor } from '../core/balance'
import { resolveChallengePreset } from '../core/challengePresets'
import { STORAGE_KEYS } from '../core/constants'
import { BASE_CONTENT_PACK } from '../core/contentPacks'
import { type DeathRecapBuildLeaning, buildDeathRecap } from '../core/deathRecap'
import { applyRunGoalProgress, calculateRunRewardBreakdown, saveProfile } from '../core/meta'
import { getRunObjectiveOffsetForSeed } from '../core/objectives'
import { appendRunHistoryEntry, loadRunHistory } from '../core/runHistory'
import { gameState, playerProfile, setPlayerProfile } from '../core/state'
import type { UpgradeFamily } from '../core/types'
import { UPGRADE_FAMILIES } from '../core/upgrades'
import { createEmptyBossEncounterSummary } from '../simulation/eliteMiniboss'
import { createEmptyRouteMasterySummary } from '../simulation/routeMastery'
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
  recap: ReturnType<typeof buildDeathRecap>
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
    const recap = buildDeathRecap({
      deathReason,
      upgrades: gameState.persistentUpgrades,
      routeMastery: gameState.routeMasterySummary,
      cleanPlay: {
        completedObjectives: gameState.runCleanPlaySummary.completedObjectives,
        cleanClears: gameState.runCleanPlaySummary.cleanClears,
        totalBonusScore: gameState.runCleanPlaySummary.totalBonusScore,
      },
    })

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
      depthBand: getDepthBandForFloor(gameState.floor),
      reward,
      currencyTotal: goalProgressResult.profile.currency,
      deathReason,
      timeAliveMs,
      inputMode: getControlMode(),
      buildLeaning: recap.buildLeaning,
      notableChoices: recap.notableChoices.map((upgrade) => upgrade.id).join(','),
      cleanPlayCompletedObjectives: recap.cleanPlay.completedObjectives,
      cleanPlayClears: recap.cleanPlay.cleanClears,
      cleanPlayBonusScore: recap.cleanPlay.totalBonusScore,
      mutatorCount: gameState.currentRunMutators.length,
      mutatorIds: gameState.currentRunMutators.map((mutator) => mutator.id).join(','),
      mutatorDomains: gameState.currentRunMutators.map((mutator) => mutator.domain).join(','),
      biomeRuleActivationEvents: gameState.biomeRuleSummary.activationEvents,
      biomeRuleTransitionEvents: gameState.biomeRuleSummary.transitionEvents,
      biomeRuleBlockedEvents: gameState.biomeRuleSummary.blockedEvents,
      biomeRuleFallbackEvents: gameState.biomeRuleSummary.fallbackEvents,
      biomeIdsSeen: gameState.biomeRuleSummary.activatedBiomeIds.join(','),
      biomeRuleIdsSeen: gameState.biomeRuleSummary.activatedRuleIds.join(','),
      eliteMinibossPhaseWindowEvents: gameState.eliteMinibossReadability.phaseWindowEvents,
      eliteMinibossDamageEvents: gameState.eliteMinibossReadability.damageEvents,
      eliteMinibossReasonLateReact:
        gameState.eliteMinibossReadability.failureReasonCounts.late_react,
      eliteMinibossReasonTrappedPath:
        gameState.eliteMinibossReadability.failureReasonCounts.trapped_path,
      eliteMinibossReasonTelegraphMissed:
        gameState.eliteMinibossReadability.failureReasonCounts.telegraph_missed,
      eliteMinibossReasonStackedPressure:
        gameState.eliteMinibossReadability.failureReasonCounts.stacked_pressure,
      bossEncountered: gameState.bossEncounterSummary.encountered,
      bossIdentityId: gameState.bossEncounterSummary.identityId,
      bossHighestPhase: gameState.bossEncounterSummary.highestPhase,
      bossPhaseWindowEvents: gameState.bossEncounterSummary.phaseWindowEvents,
      bossDamageEvents: gameState.bossEncounterSummary.damageEvents,
      bossReasonLateReact: gameState.bossEncounterSummary.failureReasonCounts.late_react,
      bossReasonTrappedPath: gameState.bossEncounterSummary.failureReasonCounts.trapped_path,
      bossReasonTelegraphMissed:
        gameState.bossEncounterSummary.failureReasonCounts.telegraph_missed,
      bossReasonStackedPressure:
        gameState.bossEncounterSummary.failureReasonCounts.stacked_pressure,
      predatorPreyTransitionEvents: gameState.predatorPreyPacingSummary.transitionEvents,
      predatorPreyTransitionsHunt: gameState.predatorPreyPacingSummary.transitionsByPhase.hunt,
      predatorPreyTransitionsEscape: gameState.predatorPreyPacingSummary.transitionsByPhase.escape,
      predatorPreyTransitionsReset: gameState.predatorPreyPacingSummary.transitionsByPhase.reset,
      predatorPreyGuardrailInterventions:
        gameState.predatorPreyPacingSummary.guardrailInterventions,
      predatorPreyGuardrailOverlapBudget:
        gameState.predatorPreyPacingSummary.guardrailReasonCounts.overlap_budget_exceeded,
      predatorPreyGuardrailCadenceGap:
        gameState.predatorPreyPacingSummary.guardrailReasonCounts.cadence_gap_enforced,
      predatorPreyGuardrailEscapeWindow:
        gameState.predatorPreyPacingSummary.guardrailReasonCounts.phase_escape_window,
      routeMasteryDecisions: gameState.routeMasterySummary.routeDecisions,
      routeMasteryBranchDecisions: gameState.routeMasterySummary.branchDecisions,
      routeMasteryEliteChoices: gameState.routeMasterySummary.eliteChoices,
      routeMasteryNonCombatChoices: gameState.routeMasterySummary.nonCombatChoices,
      routeMasteryBiomePivots: gameState.routeMasterySummary.biomePivotChoices,
      routeMasteryPreviewEliteSeen: gameState.routeMasterySummary.previewEliteSeen,
      challengePresetId: gameState.currentChallengePresetId,
      challengePresetMutatorId: gameState.currentChallengePresetForcedMutatorId,
    })
    if (gameState.currentRunSeed !== null) {
      appendRunHistoryEntry({
        endedAt: Date.now(),
        runSeed: gameState.currentRunSeed,
        floor: gameState.floor,
        score,
        deathReason,
        buildLeaning: recap.buildLeaning,
        challengePresetId: gameState.currentChallengePresetId,
      })
    }

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
      recap,
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

    this.renderRecap(root, data.recap)

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

  private getBuildLeaningLabel(buildLeaning: DeathRecapBuildLeaning): string {
    if (buildLeaning === 'mixed') {
      return t('death.recap.buildLeaning.mixed')
    }
    if (buildLeaning === 'none') {
      return t('death.recap.buildLeaning.none')
    }
    return t('death.recap.buildLeaning.family', {
      family: this.getFamilyLabel(buildLeaning),
    })
  }

  private getBuildLeaningSummary(buildLeaning: DeathRecapBuildLeaning): string {
    if (buildLeaning === 'mixed') {
      return t('death.recap.buildLeaning.mixedSummary')
    }
    if (buildLeaning === 'none') {
      return t('death.recap.buildLeaning.noneSummary')
    }
    return t(`upgrade.family.${buildLeaning}.summary`, {
      defaultValue: UPGRADE_FAMILIES[buildLeaning].summary,
    })
  }

  private getFamilyLabel(family: UpgradeFamily): string {
    return t(`upgrade.family.${family}.label`, {
      defaultValue: UPGRADE_FAMILIES[family].label,
    })
  }

  private getDeathReasonText(deathReason: string): string {
    return t(`death.recap.reason.${deathReason}`, {
      defaultValue: t('death.recap.reason.unknown'),
    })
  }

  private renderRecap(root: HTMLDivElement, recap: ReturnType<typeof buildDeathRecap>): void {
    const section = document.createElement('section')
    section.className = styles.recap
    root.append(section)

    const title = document.createElement('p')
    title.className = styles.recapTitle
    title.textContent = t('death.recap.title')
    section.append(title)

    section.append(
      this.createRecapBlock(
        t('death.recap.deathReasonLabel'),
        this.getDeathReasonText(recap.deathReason),
      ),
    )
    section.append(
      this.createRecapBlock(
        t('death.recap.buildLeaningLabel'),
        this.getBuildLeaningLabel(recap.buildLeaning),
        this.getBuildLeaningSummary(recap.buildLeaning),
      ),
    )
    const cleanPlayValue =
      recap.cleanPlay.completedObjectives > 0
        ? t('death.recap.cleanPlayValue', {
            clean: recap.cleanPlay.cleanClears,
            total: recap.cleanPlay.completedObjectives,
          })
        : t('death.recap.cleanPlayNone')
    const cleanPlayDetail =
      recap.cleanPlay.totalBonusScore > 0
        ? t('death.recap.cleanPlayBonus', {
            bonus: recap.cleanPlay.totalBonusScore,
          })
        : undefined
    section.append(
      this.createRecapBlock(t('death.recap.cleanPlayLabel'), cleanPlayValue, cleanPlayDetail),
    )
    section.append(
      this.createRecapBlock(
        t('death.recap.routeMasteryLabel', { defaultValue: 'Route Mastery' }),
        recap.routeMastery.label,
        recap.routeMastery.detail,
      ),
    )
    const trend = this.getDeathTrendInsight(recap.deathReason)
    section.append(this.createRecapBlock('Why You Died Trend', trend.value, trend.detail))

    const choices = document.createElement('div')
    choices.className = styles.recapBlock
    section.append(choices)

    const choicesLabel = document.createElement('p')
    choicesLabel.className = styles.recapLabel
    choicesLabel.textContent = t('death.recap.notableChoicesLabel')
    choices.append(choicesLabel)

    if (recap.notableChoices.length === 0) {
      const empty = document.createElement('p')
      empty.className = styles.recapFallback
      empty.textContent = t('death.recap.noNotableChoices')
      choices.append(empty)
      return
    }

    const list = document.createElement('div')
    list.className = styles.upgrades
    choices.append(list)

    for (const upgrade of recap.notableChoices) {
      const row = document.createElement('p')
      row.className = styles.upgrade
      const upgradeName = t(`upgrade.${upgrade.id}_name`, { defaultValue: upgrade.name })
      row.textContent = `${upgrade.icon} ${upgradeName}`
      list.append(row)
    }
  }

  private createRecapBlock(label: string, value: string, detail?: string): HTMLDivElement {
    const block = document.createElement('div')
    block.className = styles.recapBlock

    const labelNode = document.createElement('p')
    labelNode.className = styles.recapLabel
    labelNode.textContent = label
    block.append(labelNode)

    const valueNode = document.createElement('p')
    valueNode.className = styles.recapValue
    valueNode.textContent = value
    block.append(valueNode)

    if (detail) {
      const detailNode = document.createElement('p')
      detailNode.className = styles.recapDetail
      detailNode.textContent = detail
      block.append(detailNode)
    }

    return block
  }

  private getDeathTrendInsight(currentDeathReason: string): { value: string; detail: string } {
    const recent = loadRunHistory().slice(0, 6)
    if (recent.length <= 1) {
      return {
        value: this.getDeathReasonText(currentDeathReason),
        detail: 'Need more runs for trend signal',
      }
    }
    const counts = new Map<string, number>()
    for (const entry of recent) {
      counts.set(entry.deathReason, (counts.get(entry.deathReason) ?? 0) + 1)
    }
    let topReason = currentDeathReason
    let topCount = counts.get(currentDeathReason) ?? 0
    for (const [reason, count] of counts.entries()) {
      if (count > topCount) {
        topReason = reason
        topCount = count
      }
    }
    const latest = recent[0]
    const latestLabel = latest ? this.getDeathReasonText(latest.deathReason) : 'unknown'
    return {
      value: `${this.getDeathReasonText(topReason)} · ${topCount}/${recent.length}`,
      detail: `Latest run: ${latestLabel} · floor ${latest?.floor ?? 0} · seed ${latest?.runSeed ?? 0}`,
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
    const nowMs = Date.now()
    const resolvedPreset = resolveChallengePreset({
      presetId: gameState.currentChallengePresetId,
      nowMs,
      fallbackSeedParts: [nowMs, gameState.run, playerProfile.currency],
    })
    gameState.currentRunSeed = resolvedPreset.runSeed
    gameState.currentChallengePresetId = resolvedPreset.presetId
    gameState.currentChallengePresetForcedMutatorId = resolvedPreset.forcedMutatorId
    gameState.runObjectiveOffset = getRunObjectiveOffsetForSeed(resolvedPreset.runSeed)
    gameState.persistentUpgrades = []
    gameState.persistentRewards = []
    gameState.selectedRelicId = null
    gameState.pendingFloorRoute = null
    gameState.pendingEventChoiceConsequences = []
    gameState.currentRunMapNodeId = null
    gameState.pendingRunMapNodeId = null
    gameState.currentRunMutators = []
    gameState.activeContentPackId = BASE_CONTENT_PACK.id
    gameState.lastReplaySnapshot = null
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
      source: 'death_restart',
      currency: playerProfile.currency,
      unlockedTalents: playerProfile.unlockedTalents.length,
      challengePresetId: resolvedPreset.presetId,
      challengePresetMutatorId: resolvedPreset.forcedMutatorId,
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
    gameState.activeContentPackId = BASE_CONTENT_PACK.id
    transitionToScene(this, 'Menu', { chrome: 'menu' })
  }
}
