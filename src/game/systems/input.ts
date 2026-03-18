import type { DirectionName, VirtualInput } from '../core/types'
import { emitFeedback } from './feedback'

declare global {
  interface Window {
    virtualInput: VirtualInput
  }
}

window.virtualInput = { dir: null, start: false, pause: false }

const bindPointerPress = (element: HTMLElement, onPress: () => void): void => {
  const trigger = (event: Event): void => {
    event.preventDefault()
    emitFeedback('tap')
    onPress()
  }
  element.addEventListener('touchstart', trigger, { passive: false })
  element.addEventListener('mousedown', trigger)
}

export const setupInput = (): void => {
  setupSwipe()
  setupDpad()
  setupActionButtons()
}

const setupSwipe = (): void => {
  let touchX = 0
  let touchY = 0

  const onTouchStart = (event: TouchEvent): void => {
    const touch = event.touches[0]
    if (!touch) {
      return
    }
    touchX = touch.clientX
    touchY = touch.clientY
  }

  const onTouchEnd = (event: TouchEvent): void => {
    const touch = event.changedTouches[0]
    if (!touch) {
      return
    }
    const dx = touch.clientX - touchX
    const dy = touch.clientY - touchY
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance < 15) {
      return
    }
    window.virtualInput.dir =
      Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up'
  }

  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { passive: true })
}

const setupDpad = (): void => {
  const dirs: DirectionName[] = ['up', 'down', 'left', 'right']

  for (const dir of dirs) {
    const button = document.getElementById(`btn-${dir}`)
    if (!(button instanceof HTMLButtonElement)) {
      continue
    }

    const press = (event: Event): void => {
      event.preventDefault()
      window.virtualInput.dir = dir
      emitFeedback('tap')
      button.classList.add('pressed')
    }

    const release = (): void => {
      button.classList.remove('pressed')
    }

    button.addEventListener('touchstart', press, { passive: false })
    button.addEventListener('mousedown', press)
    button.addEventListener('touchend', release, { passive: true })
    button.addEventListener('mouseup', release)
    button.addEventListener('mouseleave', release)
  }
}

const setupActionButtons = (): void => {
  const pauseButton = document.getElementById('btn-pause')
  const startButton = document.getElementById('btn-start')
  if (pauseButton instanceof HTMLElement) {
    bindPointerPress(pauseButton, () => {
      window.virtualInput.pause = true
    })
  }
  if (startButton instanceof HTMLElement) {
    bindPointerPress(startButton, () => {
      window.virtualInput.start = true
    })
  }
}
