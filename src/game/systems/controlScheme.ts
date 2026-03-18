const LARGE_SCREEN_QUERY = '(min-width: 900px)'
const TOUCH_FIRST_QUERY = '(pointer: coarse), (hover: none)'

const getMode = (): 'touch' | 'keyboard' => {
  const isLargeScreen = window.matchMedia(LARGE_SCREEN_QUERY).matches
  const isTouchFirst = window.matchMedia(TOUCH_FIRST_QUERY).matches
  return !isLargeScreen && isTouchFirst ? 'touch' : 'keyboard'
}

const applyMode = (): void => {
  const mode = getMode()
  document.body.classList.toggle('touch-controls', mode === 'touch')
  document.body.classList.toggle('keyboard-controls', mode === 'keyboard')
}

export const setupControlScheme = (): void => {
  applyMode()

  const mediaQueries = [window.matchMedia(LARGE_SCREEN_QUERY), window.matchMedia(TOUCH_FIRST_QUERY)]
  for (const mediaQuery of mediaQueries) {
    mediaQuery.addEventListener('change', applyMode)
  }
}

export const isKeyboardMode = (): boolean => getMode() === 'keyboard'
