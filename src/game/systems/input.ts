import type { VirtualInput } from '../core/types'
import {
  INPUT_TOUCH_DIAGONAL_AMBIGUITY_RATIO,
  INPUT_TOUCH_DOUBLE_TAP_WINDOW_MS,
  INPUT_TOUCH_MIN_SWIPE_DISTANCE_PX,
} from '../shared/inputConstants'
import { emitFeedback } from './feedback'
import { interpretTouchGesture } from './input/gestureInterpreter'

declare global {
  interface Window {
    virtualInput: VirtualInput
  }
}

export const resetVirtualInput = (): void => {
  window.virtualInput.dir = null
  window.virtualInput.turn = null
  window.virtualInput.start = false
  window.virtualInput.pause = false
  window.virtualInput.ability = false
}

window.virtualInput = { dir: null, turn: null, start: false, pause: false, ability: false }

export const setupInput = (): void => {
  resetVirtualInput()
  setupRelativeSwipe()
}

const setupRelativeSwipe = (): void => {
  const gameArea = document.getElementById('game-area')
  if (!(gameArea instanceof HTMLElement)) {
    return
  }
  let startX = 0
  let startY = 0
  let active = false
  let lastTapAt = 0

  const shouldCapture = (event: Event): boolean => {
    if (document.body.dataset.uiShell !== 'run') {
      return false
    }
    const target = event.target
    if (target instanceof Element && target.closest('button')) {
      return false
    }
    return true
  }

  const onTouchStart = (event: TouchEvent): void => {
    if (!shouldCapture(event)) {
      active = false
      return
    }
    const canvas = document.querySelector('#phaser-container canvas')
    const surface = canvas instanceof HTMLCanvasElement ? canvas : gameArea
    const rect = surface.getBoundingClientRect()
    const point = event.touches[0]
    if (!point) {
      active = false
      return
    }
    if (
      point.clientX < rect.left ||
      point.clientX > rect.right ||
      point.clientY < rect.top ||
      point.clientY > rect.bottom
    ) {
      active = false
      return
    }
    startX = point.clientX
    startY = point.clientY
    active = true
  }

  const onTouchEnd = (event: TouchEvent): void => {
    if (!active || !shouldCapture(event)) {
      active = false
      return
    }
    const point = event.changedTouches[0]
    if (!point) {
      active = false
      return
    }
    const dx = point.clientX - startX
    const dy = point.clientY - startY
    active = false
    const interpreted = interpretTouchGesture({
      startX,
      startY,
      endX: point.clientX,
      endY: point.clientY,
      nowMs: performance.now(),
      lastTapAt,
      minSwipeDistancePx: INPUT_TOUCH_MIN_SWIPE_DISTANCE_PX,
      doubleTapWindowMs: INPUT_TOUCH_DOUBLE_TAP_WINDOW_MS,
      diagonalAmbiguityRatio: INPUT_TOUCH_DIAGONAL_AMBIGUITY_RATIO,
    })
    lastTapAt = interpreted.nextTapAt
    if (interpreted.ability) {
      window.virtualInput.ability = true
      emitFeedback('tap')
      return
    }
    if (interpreted.dir) {
      window.virtualInput.dir = interpreted.dir
      emitFeedback('tap')
    }
  }

  gameArea.addEventListener('touchstart', onTouchStart, { passive: true })
  gameArea.addEventListener('touchend', onTouchEnd, { passive: true })
}
