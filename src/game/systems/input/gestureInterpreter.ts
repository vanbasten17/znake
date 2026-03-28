import type { DirectionName } from '../../core/types'

export type TouchGestureInterpretation = {
  dir: DirectionName | null
  ability: boolean
  nextTapAt: number
}

type TouchGestureParams = {
  startX: number
  startY: number
  endX: number
  endY: number
  nowMs: number
  lastTapAt: number
  minSwipeDistancePx: number
  doubleTapWindowMs: number
  diagonalAmbiguityRatio: number
}

const resolveSwipeDirection = (
  dx: number,
  dy: number,
  diagonalAmbiguityRatio: number,
): DirectionName | null => {
  const absX = Math.abs(dx)
  const absY = Math.abs(dy)
  const major = Math.max(absX, absY)
  const minor = Math.min(absX, absY)
  if (major <= 0) {
    return null
  }
  if (minor / major >= diagonalAmbiguityRatio) {
    return null
  }
  if (absX >= absY) {
    return dx > 0 ? 'right' : 'left'
  }
  return dy > 0 ? 'down' : 'up'
}

export const interpretTouchGesture = (params: TouchGestureParams): TouchGestureInterpretation => {
  const dx = params.endX - params.startX
  const dy = params.endY - params.startY
  if (Math.hypot(dx, dy) < params.minSwipeDistancePx) {
    if (params.nowMs - params.lastTapAt <= params.doubleTapWindowMs) {
      return { dir: null, ability: true, nextTapAt: 0 }
    }
    return { dir: null, ability: false, nextTapAt: params.nowMs }
  }
  const dir = resolveSwipeDirection(dx, dy, params.diagonalAmbiguityRatio)
  return { dir, ability: false, nextTapAt: params.lastTapAt }
}
