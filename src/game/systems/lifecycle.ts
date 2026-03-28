import type Phaser from 'phaser'
import { saveProfile } from '../core/meta'
import { getFloorObjective } from '../core/objectives'
import { playerProfile } from '../core/state'
import { gameState } from '../core/state'
import { setHintText } from './domHud'
import { emitFeedback } from './feedback'
import { t } from './i18n'

let autoPausedByLifecycle = false

const getObjectivePreviewLabel = (): string => {
  const objective = getFloorObjective(gameState.floor, gameState.runObjectiveOffset)
  if (objective.kind === 'score') {
    return t('game.objectiveScorePreview', { target: objective.scoreTarget })
  }
  if (objective.kind === 'kills') {
    return t('game.objectiveKillsPreview', { target: objective.killsTarget })
  }
  if (objective.kind === 'boss') {
    return t('game.objectiveBossPreview')
  }
  return t('game.objectivePortalPreview')
}

const getResumeContinuityContext = (): string => {
  const parts: string[] = []
  if (gameState.pendingFloorRoute) {
    parts.push(
      gameState.pendingFloorRoute === 'safer' ? t('game.routeSafer') : t('game.routeRiskier'),
    )
  }
  const delayedConsequenceCount = gameState.pendingEventChoiceConsequences.length
  if (delayedConsequenceCount > 0) {
    parts.push(t('hint.resumeDelayedConsequences', { count: delayedConsequenceCount }))
  }
  if (parts.length <= 0) {
    return t('hint.resumeNoPending')
  }
  return parts.join(' · ')
}

const pauseGameScene = (game: Phaser.Game): void => {
  if (!game.scene.isActive('Game')) {
    return
  }
  game.scene.pause('Game')
  autoPausedByLifecycle = true
  setHintText(t('hint.autoPaused'))
  emitFeedback('pause')
}

const resumeGameScene = (game: Phaser.Game): void => {
  if (!autoPausedByLifecycle || !game.scene.isPaused('Game')) {
    return
  }
  game.scene.resume('Game')
  autoPausedByLifecycle = false
  setHintText(
    t('hint.autoResumed', {
      floor: gameState.floor,
      objective: getObjectivePreviewLabel(),
      context: getResumeContinuityContext(),
    }),
  )
}

const flushProfile = (): void => {
  saveProfile(playerProfile)
}

export const setupLifecycle = (game: Phaser.Game): void => {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      pauseGameScene(game)
      flushProfile()
      return
    }
    resumeGameScene(game)
  })

  window.addEventListener('blur', () => {
    pauseGameScene(game)
    flushProfile()
  })

  window.addEventListener('focus', () => {
    resumeGameScene(game)
  })

  window.addEventListener('pagehide', () => {
    flushProfile()
  })

  window.addEventListener('beforeunload', () => {
    flushProfile()
  })
}
