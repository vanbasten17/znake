import type Phaser from 'phaser'
import { saveProfile } from '../core/meta'
import { playerProfile } from '../core/state'
import { setHintText } from './domHud'
import { emitFeedback } from './feedback'

let autoPausedByLifecycle = false

const pauseGameScene = (game: Phaser.Game): void => {
  if (!game.scene.isActive('Game')) {
    return
  }
  game.scene.pause('Game')
  autoPausedByLifecycle = true
  setHintText('AUTO-PAUSED (APP BACKGROUND) - TAP PAUSE/START TO CONTINUE')
  emitFeedback('pause')
}

const resumeGameScene = (game: Phaser.Game): void => {
  if (!autoPausedByLifecycle || !game.scene.isPaused('Game')) {
    return
  }
  game.scene.resume('Game')
  autoPausedByLifecycle = false
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
