export type FeedbackVfxChannel = 'danger' | 'block' | 'pickup' | 'reward'

export type FeedbackVfxRender = {
  alphaMultiplier: number
  lineWidthMultiplier: number
  innerRadiusMultiplier: number
  innerAlphaMultiplier: number
}

export const resolveFeedbackVfxRender = (
  channel: FeedbackVfxChannel,
  reducedEffects: boolean,
): FeedbackVfxRender => {
  if (channel === 'danger') {
    return {
      alphaMultiplier: reducedEffects ? 0.8 : 1.1,
      lineWidthMultiplier: 1.16,
      innerRadiusMultiplier: 0.68,
      innerAlphaMultiplier: 0.5,
    }
  }
  if (channel === 'block') {
    return {
      alphaMultiplier: reducedEffects ? 0.74 : 0.88,
      lineWidthMultiplier: 0.9,
      innerRadiusMultiplier: 0.78,
      innerAlphaMultiplier: 0.62,
    }
  }
  if (channel === 'reward') {
    return {
      alphaMultiplier: reducedEffects ? 0.86 : 1.04,
      lineWidthMultiplier: 1.08,
      innerRadiusMultiplier: 0.74,
      innerAlphaMultiplier: 0.6,
    }
  }
  return {
    alphaMultiplier: reducedEffects ? 0.7 : 0.92,
    lineWidthMultiplier: 0.96,
    innerRadiusMultiplier: 0.72,
    innerAlphaMultiplier: 0.52,
  }
}
