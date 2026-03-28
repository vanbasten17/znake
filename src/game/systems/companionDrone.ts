export const COMPANION_DRONE_COOLDOWN_MS = 12000
const COMPANION_DRONE_BONUS_SCORE = 12

export const tickCompanionDroneCooldown = (cooldownMs: number, deltaMs: number): number =>
  Math.max(0, cooldownMs - deltaMs)

export const resolveCompanionDroneSupport = (params: {
  cooldownMs: number
  scoreMultiplier: number
}): { triggered: boolean; nextCooldownMs: number; bonusScore: number } => {
  if (params.cooldownMs > 0) {
    return {
      triggered: false,
      nextCooldownMs: params.cooldownMs,
      bonusScore: 0,
    }
  }
  return {
    triggered: true,
    nextCooldownMs: COMPANION_DRONE_COOLDOWN_MS,
    bonusScore: Math.floor(COMPANION_DRONE_BONUS_SCORE * params.scoreMultiplier),
  }
}
