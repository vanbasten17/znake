import type { VirtualInput } from '../core/types'
import { emitFeedback } from './feedback'

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
  const minDistance = 16
  const doubleTapWindowMs = 280

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
    if (Math.hypot(dx, dy) < minDistance) {
      const now = performance.now()
      if (now - lastTapAt <= doubleTapWindowMs) {
        window.virtualInput.ability = true
        emitFeedback('tap')
        lastTapAt = 0
        return
      }
      lastTapAt = now
      return
    }
    if (Math.abs(dx) >= Math.abs(dy)) {
      window.virtualInput.dir = dx > 0 ? 'right' : 'left'
      emitFeedback('tap')
      return
    }
    window.virtualInput.dir = dy > 0 ? 'down' : 'up'
    emitFeedback('tap')
  }

  gameArea.addEventListener('touchstart', onTouchStart, { passive: true })
  gameArea.addEventListener('touchend', onTouchEnd, { passive: true })
}
