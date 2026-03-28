export type MenuNavTab = 'play' | 'progress' | 'settings' | 'accessibility'

export const MENU_NAV_ORDER: MenuNavTab[] = ['play', 'progress', 'settings', 'accessibility']

export const resolveMenuTabByOffset = (currentTab: MenuNavTab, direction: -1 | 1): MenuNavTab => {
  const currentIndex = MENU_NAV_ORDER.indexOf(currentTab)
  const normalizedIndex = currentIndex >= 0 ? currentIndex : 0
  const nextIndex = (normalizedIndex + direction + MENU_NAV_ORDER.length) % MENU_NAV_ORDER.length
  return MENU_NAV_ORDER[nextIndex]
}

export const resolveMenuTabHotkey = (keyCode: string): MenuNavTab | null => {
  if (keyCode === 'Digit7' || keyCode === 'Numpad7') return 'play'
  if (keyCode === 'Digit8' || keyCode === 'Numpad8') return 'progress'
  if (keyCode === 'Digit9' || keyCode === 'Numpad9') return 'settings'
  if (keyCode === 'Digit0' || keyCode === 'Numpad0') return 'accessibility'
  return null
}

export const canStartRunFromMenuTab = (tab: MenuNavTab): boolean => tab === 'play'
