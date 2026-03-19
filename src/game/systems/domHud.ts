import { gameState } from '../core/state'
import { isKeyboardMode } from './controlScheme'
import { t } from './i18n'

const byId = <T extends HTMLElement>(id: string): T => {
  const node = document.getElementById(id)
  if (!node) {
    throw new Error(`Missing required element: #${id}`)
  }
  return node as T
}

type HudNodes = {
  scoreDisp: HTMLSpanElement
  floorDisp: HTMLSpanElement
  killsDisp: HTMLSpanElement
  runNum: HTMLSpanElement
  hintBar: HTMLDivElement | null
  runStatus: HTMLDivElement
}

let hudNodes: HudNodes | null = null

const resolveHudNodes = (): HudNodes => {
  if (hudNodes) {
    return hudNodes
  }
  hudNodes = {
    scoreDisp: byId<HTMLSpanElement>('score-disp'),
    floorDisp: byId<HTMLSpanElement>('floor-disp'),
    killsDisp: byId<HTMLSpanElement>('kills-disp'),
    runNum: byId<HTMLSpanElement>('run-num'),
    hintBar: document.getElementById('hint-bar') as HTMLDivElement | null,
    runStatus: byId<HTMLDivElement>('run-status'),
  }
  return hudNodes
}

export type UiShellMode = 'menu' | 'run'

const setShellClasses = (mode: UiShellMode): void => {
  document.body.classList.toggle('scene-menu', mode === 'menu')
  document.body.classList.toggle('scene-run', mode === 'run')
}

export const setUiShell = (mode: UiShellMode): void => {
  document.body.dataset.uiShell = mode
  setShellClasses(mode)
  if (mode !== 'run') {
    resolveHudNodes().runStatus.textContent = ''
  }
}

export const setUiShellSplit = (contentFr: number, controlsFr: number): void => {
  const content = Math.max(0.1, contentFr)
  const controls = Math.max(0.1, controlsFr)
  document.body.style.setProperty('--layout-shell-content-fr', `${content}fr`)
  document.body.style.setProperty('--layout-shell-controls-fr', `${controls}fr`)
}

export const resetUiShellSplit = (): void => {
  document.body.style.removeProperty('--layout-shell-content-fr')
  document.body.style.removeProperty('--layout-shell-controls-fr')
}

export const setSceneChrome = (mode: UiShellMode): void => {
  setUiShell(mode)
}

export const setHintText = (value: string): void => {
  const hintBar = resolveHudNodes().hintBar
  if (hintBar) {
    hintBar.textContent = value
  }
}

export const setRunStatusText = (value: string): void => {
  resolveHudNodes().runStatus.textContent = value
}

export const getMoveHintText = (): string =>
  isKeyboardMode() ? t('hint.moveKeyboard') : t('hint.moveTouch')

export const getStartHintText = (): string =>
  isKeyboardMode() ? t('hint.startKeyboard') : t('hint.startTouch')

export const getRestartHintText = (): string =>
  isKeyboardMode() ? t('hint.restartKeyboard') : t('hint.restartTouch')

export const getUpgradeHintText = (): string =>
  isKeyboardMode() ? t('hint.upgradeKeyboard') : t('hint.upgradeTouch')

export const updateHud = (score: number): void => {
  const { scoreDisp, floorDisp, killsDisp, runNum } = resolveHudNodes()
  scoreDisp.textContent = String(score)
  floorDisp.textContent = String(gameState.floor)
  killsDisp.textContent = String(gameState.kills)
  runNum.textContent = String(gameState.run)
}
