/**
 * @spec hud-updates
 * @component hud
 * @flow scene-to-hud
 */
import { gameState } from '../core/state'
import { isKeyboardMode } from './controlScheme'
import { t } from './i18n'
import { buildScoreHudViewModel, buildStatusHudViewModel } from './uiViewModelPresenter'

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
  objectiveStatus: HTMLDivElement
  routeStatus: HTMLDivElement
  hintBar: HTMLDivElement | null
  runStatus: HTMLDivElement
}

let hudNodes: HudNodes | null = null
let runPulseTimer: number | null = null
let objectivePulseTimer: number | null = null

const resolveHudNodes = (): HudNodes => {
  if (hudNodes) {
    return hudNodes
  }
  hudNodes = {
    scoreDisp: byId<HTMLSpanElement>('score-disp'),
    floorDisp: byId<HTMLSpanElement>('floor-disp'),
    killsDisp: byId<HTMLSpanElement>('kills-disp'),
    runNum: byId<HTMLSpanElement>('run-num'),
    objectiveStatus: byId<HTMLDivElement>('objective-status'),
    routeStatus: byId<HTMLDivElement>('route-status'),
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

let lastRunStatusText = ''
const setRunStatusEmphasis = (hasContent: boolean): void => {
  const runStatus = resolveHudNodes().runStatus
  runStatus.dataset.state = hasContent ? 'active' : 'idle'
}

export const setUiShell = (mode: UiShellMode): void => {
  document.body.dataset.uiShell = mode
  setShellClasses(mode)
  if (mode !== 'run') {
    lastRunStatusText = ''
    resolveHudNodes().runStatus.textContent = ''
    resolveHudNodes().routeStatus.textContent = ''
    setRunStatusEmphasis(false)
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
  const viewModel = buildStatusHudViewModel({
    runStatusText: value,
    objectiveStatusText: '',
    routeStatusText: '',
  })
  if (viewModel.runStatusText === lastRunStatusText) {
    return
  }
  lastRunStatusText = viewModel.runStatusText
  resolveHudNodes().runStatus.textContent = viewModel.runStatusText
  setRunStatusEmphasis(viewModel.runStatusActive)
}

export const setObjectiveStatusText = (value: string): void => {
  resolveHudNodes().objectiveStatus.textContent = value
}

export const setRouteStatusText = (value: string): void => {
  resolveHudNodes().routeStatus.textContent = value
}

export type HudPulseKind = 'danger' | 'pickup' | 'reward'

export const pulseHudNode = (
  target: 'run' | 'objective',
  kind: HudPulseKind,
  durationMs: number,
): void => {
  const nodes = resolveHudNodes()
  const node = target === 'run' ? nodes.runStatus : nodes.objectiveStatus
  const activeTimer = target === 'run' ? runPulseTimer : objectivePulseTimer
  if (activeTimer !== null) {
    window.clearTimeout(activeTimer)
  }
  node.dataset.juice = kind
  const timeoutId = window.setTimeout(() => {
    if (node.dataset.juice === kind) {
      delete node.dataset.juice
    }
    if (target === 'run') {
      runPulseTimer = null
    } else {
      objectivePulseTimer = null
    }
  }, durationMs)
  if (target === 'run') {
    runPulseTimer = timeoutId
  } else {
    objectivePulseTimer = timeoutId
  }
}

export const getMoveHintText = (): string =>
  isKeyboardMode() ? t('hint.moveKeyboard') : t('hint.moveTouch')

export const getStartHintText = (): string =>
  isKeyboardMode() ? t('hint.startKeyboard') : t('hint.startTouch')

export const getRestartHintText = (): string =>
  isKeyboardMode() ? t('hint.restartKeyboard') : t('hint.restartTouch')

export const getUpgradeHintText = (): string =>
  isKeyboardMode() ? t('hint.upgradeKeyboard') : t('hint.upgradeTouch')

export const getRewardHintText = (): string =>
  isKeyboardMode() ? t('hint.rewardKeyboard') : t('hint.rewardTouch')

export const updateHud = (score: number): void => {
  const viewModel = buildScoreHudViewModel({
    score,
    floor: gameState.floor,
    kills: gameState.kills,
    run: gameState.run,
  })
  const { scoreDisp, floorDisp, killsDisp, runNum } = resolveHudNodes()
  scoreDisp.textContent = viewModel.scoreText
  floorDisp.textContent = viewModel.floorText
  killsDisp.textContent = viewModel.killsText
  runNum.textContent = viewModel.runText
}
