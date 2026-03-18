import { gameState } from '../core/state'
import { isKeyboardMode } from './controlScheme'

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
  isKeyboardMode()
    ? 'ARROW KEYS OR WASD TO MOVE - SPACE TO PAUSE'
    : 'SWIPE OR D-PAD TO MOVE - PAUSE II'

export const getStartHintText = (): string =>
  isKeyboardMode() ? 'PRESS ENTER OR SPACE TO START' : 'TAP START TO PLAY'

export const getRestartHintText = (): string =>
  isKeyboardMode() ? 'ENTER/SPACE: NEXT RUN - M: MAIN MENU' : 'TAP NEXT RUN OR MAIN MENU'

export const getUpgradeHintText = (): string =>
  isKeyboardMode() ? 'PRESS 1, 2 OR 3 TO PICK AN UPGRADE' : 'TAP AN UPGRADE CARD TO CONTINUE'

export const updateHud = (score: number): void => {
  scoreDisp.textContent = String(score)
  floorDisp.textContent = String(gameState.floor)
  killsDisp.textContent = String(gameState.kills)
  runNum.textContent = String(gameState.run)
}
