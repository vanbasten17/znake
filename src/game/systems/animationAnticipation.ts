export type MotionCue = {
  forwardScale: number
  sideScale: number
  forwardOffsetCells: number
}

const ANTICIPATION_START = 0.64
const ANTICIPATION_END = 1
const FOLLOWTHROUGH_START = 0
const FOLLOWTHROUGH_END = 0.2

export const resolveCycleProgress = (timerMs: number, intervalMs: number): number => {
  if (!Number.isFinite(timerMs) || !Number.isFinite(intervalMs) || intervalMs <= 0) {
    return 0
  }
  return Math.min(1, Math.max(0, timerMs / intervalMs))
}

export const resolveMotionCue = (cycleProgress: number, reducedEffects: boolean): MotionCue => {
  const progress = Math.min(1, Math.max(0, cycleProgress))
  const anticipation =
    progress <= ANTICIPATION_START
      ? 0
      : (progress - ANTICIPATION_START) / (ANTICIPATION_END - ANTICIPATION_START)
  const followthrough =
    progress >= FOLLOWTHROUGH_END
      ? 0
      : (FOLLOWTHROUGH_END - progress) / (FOLLOWTHROUGH_END - FOLLOWTHROUGH_START)

  const intensity = reducedEffects ? 0.45 : 1
  const forwardScale = 1 + (anticipation * 0.12 - followthrough * 0.05) * intensity
  const sideScale = 1 + (followthrough * 0.06 - anticipation * 0.08) * intensity
  const forwardOffsetCells = (anticipation * 0.075 - followthrough * 0.028) * intensity

  return {
    forwardScale,
    sideScale,
    forwardOffsetCells,
  }
}
