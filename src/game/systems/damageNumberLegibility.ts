export type DamageLabelKind = 'damage' | 'block' | 'pickup' | 'reward'

export type DamageLabelSpec = {
  text: string
  color: string
  durationMs: number
  risePxPerSec: number
  fontPx: number
}

export const MAX_DAMAGE_LABELS = 6

export const resolveDamageLabelSpec = (
  kind: DamageLabelKind,
  reducedEffects: boolean,
): DamageLabelSpec => {
  const compact = reducedEffects
  if (kind === 'damage') {
    return {
      text: '-1',
      color: '#ff9a90',
      durationMs: compact ? 280 : 420,
      risePxPerSec: compact ? 16 : 24,
      fontPx: compact ? 12 : 14,
    }
  }
  if (kind === 'block') {
    return {
      text: 'BLOCK',
      color: '#9ee8ff',
      durationMs: compact ? 260 : 380,
      risePxPerSec: compact ? 14 : 20,
      fontPx: compact ? 11 : 12,
    }
  }
  if (kind === 'reward') {
    return {
      text: 'BONUS',
      color: '#ffe68d',
      durationMs: compact ? 320 : 500,
      risePxPerSec: compact ? 14 : 18,
      fontPx: compact ? 12 : 14,
    }
  }
  return {
    text: '+1',
    color: '#9fffc2',
    durationMs: compact ? 260 : 360,
    risePxPerSec: compact ? 13 : 17,
    fontPx: compact ? 11 : 12,
  }
}

export const resolveOverflowLabelsToDrop = (
  currentCount: number,
  incomingCount: number,
  maxCount = MAX_DAMAGE_LABELS,
): number => Math.max(0, currentCount + incomingCount - maxCount)
