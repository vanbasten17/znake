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

const scoreDisp = byId<HTMLSpanElement>('score-disp')
const floorDisp = byId<HTMLSpanElement>('floor-disp')
const killsDisp = byId<HTMLSpanElement>('kills-disp')
const runNum = byId<HTMLSpanElement>('run-num')
const hintBar = byId<HTMLDivElement>('hint-bar')

export const setHintText = (value: string): void => {
  hintBar.textContent = value
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
  scoreDisp.textContent = String(score)
  floorDisp.textContent = String(gameState.floor)
  killsDisp.textContent = String(gameState.kills)
  runNum.textContent = String(gameState.run)
}
