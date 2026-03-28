export type HudStatId = 'run' | 'score' | 'floor' | 'kills'
export type HudStatPriority = 'primary' | 'secondary'

export const getHudStatPriority = (id: HudStatId): HudStatPriority => {
  if (id === 'score' || id === 'floor') return 'primary'
  return 'secondary'
}

export const normalizeRunStatus = (raw: string): { text: string; isActive: boolean } => {
  const text = raw.trim()
  return {
    text,
    isActive: text.length > 0,
  }
}
