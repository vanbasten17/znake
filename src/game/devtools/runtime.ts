import { isDevMode } from '../core/devScenarios'
import type { RunReplayCapture } from '../simulation/replay'

export type RuntimeDevtoolsState = {
  runSeed: number
  slowMotion: number
}

export type RuntimeDevtoolsApi = {
  getState: () => RuntimeDevtoolsState
  getReplayCapture: () => RunReplayCapture | null
  setSlowMotion: (factor: number) => void
  restartWithSameSeed: () => void
}

let state: RuntimeDevtoolsState = {
  runSeed: 0,
  slowMotion: 1,
}

let restartWithSameSeed: (() => void) | null = null
let replayCaptureGetter: (() => RunReplayCapture | null) | null = null

declare global {
  interface Window {
    __znakeDevtools?: RuntimeDevtoolsApi
  }
}

export const getSlowMotionFactor = (): number => state.slowMotion

export const setDevRunSeed = (seed: number): void => {
  state = { ...state, runSeed: seed >>> 0 }
}

export const setSlowMotionFactor = (factor: number): void => {
  if (!Number.isFinite(factor)) {
    return
  }
  state = {
    ...state,
    slowMotion: Math.min(1, Math.max(0.1, factor)),
  }
}

export const bindRestartWithSameSeed = (handler: () => void): void => {
  restartWithSameSeed = handler
}

export const bindReplayCaptureGetter = (getter: () => RunReplayCapture | null): void => {
  replayCaptureGetter = getter
}

export const setupRuntimeDevtools = (): void => {
  if (!isDevMode()) {
    return
  }
  window.__znakeDevtools = {
    getState: () => ({ ...state }),
    getReplayCapture: () => replayCaptureGetter?.() ?? null,
    setSlowMotion: (factor) => setSlowMotionFactor(factor),
    restartWithSameSeed: () => {
      restartWithSameSeed?.()
    },
  }
}
