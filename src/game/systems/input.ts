import type { DirectionName, VirtualInput } from '../core/types'
import { emitFeedback } from './feedback'

declare global {
  interface Window {
    virtualInput: VirtualInput
  }
}

export const resetVirtualInput = (): void => {
  window.virtualInput.dir = null
  window.virtualInput.start = false
  window.virtualInput.pause = false
}

window.virtualInput = { dir: null, start: false, pause: false }

export const setupInput = (): void => {
  resetVirtualInput()
  setupTapQuadrant()
}

const resolveQuadrantDirection = (
  x: number,
  y: number,
  width: number,
  height: number,
): DirectionName => {
  const clampedX = Math.max(0, Math.min(width, x))
  const clampedY = Math.max(0, Math.min(height, y))
  const downSlope = (height / width) * clampedX
  const upSlope = height - (height / width) * clampedX

  if (clampedY < downSlope && clampedY < upSlope) {
    return 'up'
  }
  if (clampedY > downSlope && clampedY > upSlope) {
    return 'down'
  }
  if (clampedY > downSlope && clampedY < upSlope) {
    return 'left'
  }
  return 'right'
}

const setupTapQuadrant = (): void => {
  const gameArea = document.getElementById('game-area')
  if (!(gameArea instanceof HTMLElement)) {
    return
  }

  const press = (event: MouseEvent | TouchEvent): void => {
    if (document.body.dataset.uiShell !== 'run') {
      return
    }
    const target = event.target
    if (target instanceof Element && target.closest('button')) {
      return
    }
    const rect = gameArea.getBoundingClientRect()
    const point =
      event instanceof TouchEvent ? (event.touches[0] ?? event.changedTouches[0]) : event
    if (!point) {
      return
    }
    const localX = point.clientX - rect.left
    const localY = point.clientY - rect.top
    window.virtualInput.dir = resolveQuadrantDirection(localX, localY, rect.width, rect.height)
    emitFeedback('tap')
  }

  gameArea.addEventListener('touchstart', press, { passive: true })
  gameArea.addEventListener('mousedown', press)
}
