import type { AudioProfileId } from './accessibility'

export type ScreenShakeProfileId = 'balanced' | 'soft' | 'off'

export type ScreenShakeProfile = {
  id: ScreenShakeProfileId
  durationMultiplier: number
  amplitudeMultiplier: number
}

export const resolveScreenShakeProfile = (params: {
  reducedEffects: boolean
  audioProfile: AudioProfileId
}): ScreenShakeProfile => {
  if (params.reducedEffects) {
    return {
      id: 'off',
      durationMultiplier: 0,
      amplitudeMultiplier: 0,
    }
  }
  if (params.audioProfile === 'low_fatigue') {
    return {
      id: 'soft',
      durationMultiplier: 0.62,
      amplitudeMultiplier: 0.48,
    }
  }
  return {
    id: 'balanced',
    durationMultiplier: 1,
    amplitudeMultiplier: 1,
  }
}

export const applyShakeDuration = (baseSeconds: number, profile: ScreenShakeProfile): number =>
  Math.max(0, baseSeconds * profile.durationMultiplier)
