import { createButton, createEl } from '../../systems/domFactory'

type RewardOverlayShellParams = {
  cleanPlayText: string | null
  decisionFrameText: string
  objectiveText: string
  onOverclock: () => void
  subtitleText: string
  titleText: string
  styles: {
    overlay: string
    title: string
    subtitle: string
    framing: string
    overclock: string
    objective: string
    cards: string
  }
}

type RouteOverlayShellParams = {
  legendText: string
  subtitleText: string
  titleText: string
  styles: {
    overlay: string
    panel: string
    title: string
    subtitle: string
    body: string
    cards: string
  }
}

export type RewardOverlayShell = {
  root: HTMLDivElement
  cards: HTMLDivElement
  overclockButton: HTMLButtonElement
}

export type RouteOverlayShell = {
  root: HTMLDivElement
  cards: HTMLDivElement
}

export const createRewardOverlayShell = (params: RewardOverlayShellParams): RewardOverlayShell => {
  const root = createEl('div', params.styles.overlay)

  root.append(createEl('h2', params.styles.title, params.titleText))
  root.append(createEl('p', params.styles.subtitle, params.subtitleText))
  root.append(createEl('p', params.styles.framing, params.decisionFrameText))

  if (params.cleanPlayText) {
    root.append(createEl('p', params.styles.subtitle, params.cleanPlayText))
  }

  const overclockButton = createButton(params.styles.overclock, '')
  overclockButton.addEventListener('click', params.onOverclock)
  root.append(overclockButton)

  root.append(createEl('p', params.styles.objective, params.objectiveText))

  const cards = createEl('div', params.styles.cards)
  root.append(cards)

  return { root, cards, overclockButton }
}

export const createRouteOverlayShell = (params: RouteOverlayShellParams): RouteOverlayShell => {
  const root = createEl('div', params.styles.overlay)
  const panel = createEl('section', params.styles.panel)
  root.append(panel)

  panel.append(createEl('h2', params.styles.title, params.titleText))
  panel.append(createEl('p', params.styles.subtitle, params.subtitleText))
  panel.append(createEl('p', params.styles.body, params.legendText))

  const cards = createEl('div', params.styles.cards)
  panel.append(cards)

  return { root, cards }
}
