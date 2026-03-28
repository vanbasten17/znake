const LARGE_SCREEN_QUERY = '(min-width: 900px)'
const TOUCH_FIRST_QUERY = '(pointer: coarse), (hover: none)'

export type ControlMode = 'touch' | 'keyboard'

let mediaQueries: {
  largeScreen: MediaQueryList
  touchFirst: MediaQueryList
} | null = null
let setupDone = false

const getMediaQueries = (): { largeScreen: MediaQueryList; touchFirst: MediaQueryList } => {
  if (!mediaQueries) {
    mediaQueries = {
      largeScreen: window.matchMedia(LARGE_SCREEN_QUERY),
      touchFirst: window.matchMedia(TOUCH_FIRST_QUERY),
    }
  }
  return mediaQueries
}

const getMode = (): ControlMode => {
  const queries = getMediaQueries()
  const isLargeScreen = queries.largeScreen.matches
  const isTouchFirst = queries.touchFirst.matches
  return !isLargeScreen && isTouchFirst ? 'touch' : 'keyboard'
}

const applyMode = (): void => {
  const mode = getMode()
  document.body.classList.toggle('touch-controls', mode === 'touch')
  document.body.classList.toggle('keyboard-controls', mode === 'keyboard')
}

export const setupControlScheme = (): void => {
  if (setupDone) {
    applyMode()
    return
  }
  setupDone = true
  applyMode()

  const queries = getMediaQueries()
  for (const mediaQuery of [queries.largeScreen, queries.touchFirst]) {
    mediaQuery.addEventListener('change', applyMode)
  }
}

export const isKeyboardMode = (): boolean => getMode() === 'keyboard'
export const getControlMode = (): ControlMode => getMode()
